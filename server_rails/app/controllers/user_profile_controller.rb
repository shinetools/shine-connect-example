class UserProfileController < ApplicationController
  # GET /user_profile
  # Retrieves user profile information from Shine API
  # Query params: access_token, uid
  def show
    access_token = params[:access_token]
    uid = params[:uid]

    if access_token.blank? || uid.blank?
      return render json: {
        status: 400,
        message: 'Missing required parameters: access_token and uid'
      }, status: :bad_request
    end

    begin
      result = shine_request(
        method: 'GET',
        path: "/users/profiles/#{uid}",
        authorization: access_token
      )

      render json: result[:body], status: result[:status]
    rescue StandardError => e
      Rails.logger.error "Error fetching user profile: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      
      render json: {
        status: 500,
        message: e.message
      }, status: :internal_server_error
    end
  end

  # GET /user_profile_mtls
  # Retrieves user profile information from Shine API using regulated request with mTLS
  # Query params: access_token, uid
  def show_mtls
    access_token = params[:access_token]
    uid = params[:uid]

    if access_token.blank? || uid.blank?
      return render json: {
        status: 400,
        message: 'Missing required parameters: access_token and uid'
      }, status: :bad_request
    end

    begin
      regulated_request = ShineRegulatedRequest.new

      result = regulated_request.call(
        method: 'GET',
        path: "/users/profiles/#{uid}",
        authorization: access_token
      )

      render json: result[:body], status: result[:status]
    rescue StandardError => e
      Rails.logger.error "Error fetching user profile with mTLS: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      
      render json: {
        status: 500,
        message: e.message
      }, status: :internal_server_error
    end
  end
end
