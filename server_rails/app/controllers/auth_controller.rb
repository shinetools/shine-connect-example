class AuthController < ApplicationController
  # GET /login
  # Initiates the OAuth2 authorization flow by redirecting to Shine's authorization endpoint
  def login
    requested_scope = params[:requestedScope] || ShineConnect::SCOPE
    
    query_params = {
      client_id: ShineConnect::CLIENT_ID,
      scope: requested_scope,
      redirect_uri: ShineConnect::REDIRECT_URI
    }
    
    redirect_url = "#{ShineConnect::AUTH_HOST}/oauth2/authorize?#{query_params.to_query}"
    
    Rails.logger.info "Redirecting to Shine authorization: #{redirect_url}"
    
    redirect_to redirect_url, allow_other_host: true
  end

  # GET /redirect
  # OAuth2 callback endpoint that exchanges authorization code for access token
  def callback
    code = params[:code]
    error = params[:error]

    if error.present? || code.blank?
      Rails.logger.warn 'Authorization request denied 😞'
      return redirect_to "/?authorized=false", allow_other_host: true
    end

    Rails.logger.info 'Authorization request accepted 🎉'

    begin
      # Exchange authorization code for tokens
      response = HTTParty.post(
        "#{ShineConnect::AUTH_HOST}/oauth2/token",
        body: {
          client_id: ShineConnect::CLIENT_ID,
          client_secret: ShineConnect::CLIENT_SECRET,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: ShineConnect::REDIRECT_URI
        },
        headers: { 'Content-Type' => 'application/x-www-form-urlencoded' }
      )

      if response.success?
        data = JSON.parse(response.body)
        access_token = data['access_token']
        refresh_token = data['refresh_token']
        metadata = data['metadata']
        id_token = data['id_token']

        Rails.logger.info 'Tokens retrieved ✅'

        # Extract metadata
        company_profile_id = metadata['companyProfileId']
        uid = metadata['uid']
        company_user_id = metadata['companyUserId']

        # DANGER: This is an example - in production, don't share access_token with client
        redirect_params = {
          authorized: true,
          access_token: access_token,
          refresh_token: refresh_token,
          companyProfileId: company_profile_id,
          companyUserId: company_user_id,
          uid: uid,
          id_token: id_token
        }

        redirect_to "/?#{redirect_params.to_query}", allow_other_host: true
      else
        Rails.logger.error "Token exchange failed: #{response.code} - #{response.body}"
        redirect_to "/?authorized=false", allow_other_host: true
      end
    rescue StandardError => e
      Rails.logger.error "Error during token exchange: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      redirect_to "/?authorized=false", allow_other_host: true
    end
  end
end
