# Shine API Request Module
# Ruby equivalent of the TypeScript shineRequest function
# Makes authenticated requests to the Shine API

module ShineRequest
  extend ActiveSupport::Concern

  # Make a request to the Shine API
  # @param method [String] HTTP method (GET, POST, etc.)
  # @param path [String] API endpoint path
  # @param authorization [String] Bearer token
  # @param payload [Hash] Optional request body
  # @return [Hash] Response with :body and :status
  def shine_request(method:, path:, authorization:, payload: nil)
    url = "#{ShineConnect::API_HOST}#{path}"
    
    headers = {
      'Authorization' => "Bearer #{authorization}",
      'Content-Type' => 'application/json'
    }

    print "Making #{method} request to #{url} with payload: #{payload} and headers: #{headers}"

    # Add local development headers if needed (equivalent to addLocalLoadBalancerHeaders)
    if Rails.env.development? && ShineConnect::API_HOST.include?('localhost')
      headers.merge!(
        'public_load_balancer' => 'true',
        'client_cert_present' => 'false',
        'client_cert_chain_verified' => 'false'
      )
    end

    options = {
      headers: headers
    }

    options[:body] = payload.to_json if payload.present?

    begin
      response = HTTParty.send(method.downcase.to_sym, url, options)
      
      {
        body: JSON.parse(response.body),
        status: response.code
      }
    rescue JSON::ParserError
      {
        body: response.body,
        status: response.code
      }
    rescue StandardError => e
      Rails.logger.error "Shine API request failed: #{e.message}"
      {
        body: { message: e.message },
        status: 500
      }
    end
  end
end
