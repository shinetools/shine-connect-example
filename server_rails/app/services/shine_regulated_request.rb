require 'net/http'
require 'uri'
require 'json'
require 'openssl'
require 'base64'
require 'time'

class ShineRegulatedRequest
  QSEAL_HEADERS = %w[
    (request-target)
    date
    psu-ip-address
    psu-ip-port
    psu-http-method
    psu-date
    psu-user-agent
    psu-referer
    psu-accept
    psu-accept-charset
    psu-accept-encoding
    psu-accept-language
  ].freeze

  attr_reader :api_host, :qseal_key_path, :qwac_cert_path, :qwac_key_path, :key_id, :root_ca_path, :is_local

  def initialize(options = {})
    @api_host = options[:api_host] || ShineConnect::API_HOST
    @qseal_key_path = options[:qseal_key_path] || resolve_path(ShineConnect::QSEAL_KEY_PATH)
    @qwac_cert_path = options[:qwac_cert_path] || resolve_path(ShineConnect::QWAC_CERT_PATH)
    @qwac_key_path = options[:qwac_key_path] || resolve_path(ShineConnect::QWAC_KEY_PATH)
    @root_ca_path = options[:root_ca_path] || resolve_path(ShineConnect::ROOT_CA_PATH)
    @key_id = options[:key_id] || ShineConnect::KEY_ID
    @is_local = options[:is_local] || Rails.env.development?
  end

  # Main method to make regulated API requests
  # @param method [String] HTTP method (GET, POST, etc.)
  # @param path [String] API path
  # @param authorization [String] Bearer token
  # @param payload [Hash] Optional request body
  # @param short_lived_token [String] Optional short-lived token
  # @return [Hash] Response with :body and :status
  def call(method:, path:, authorization:, payload: nil, short_lived_token: nil)
    uri = URI.parse("#{api_host}#{path}")
    port = uri.port || 443

    # Prepare request body
    post_data = payload ? JSON.generate(payload) : nil

    # Build headers
    headers = build_headers(method, port, post_data, authorization, short_lived_token)

    # Create HTTPS connection with client certificates
    http = create_https_connection(uri)

    # Create request
    request = create_request(method, uri, headers, post_data)

    # Sign the request
    sign_request(request, uri, post_data)

    Rails.logger.info "Making regulated request to: #{uri}"
    Rails.logger.debug "Request headers: #{headers.inspect}"

    # Execute request
    begin
      response = http.request(request)
      parse_response(response)
    rescue StandardError => e
      Rails.logger.error "Request failed: #{e.message}"
      raise e
    end
  end

  private

  # Resolve relative paths from config to absolute paths
  def resolve_path(path)
    return nil if path.nil?
    
    # If it's already an absolute path, return as is
    return path if path.start_with?('/')
    
    # Remove leading './' if present and resolve relative to Rails root
    clean_path = path.sub(/^\.\//, '')
    Rails.root.join(clean_path).to_s
  end

  # Build all required headers for the request
  def build_headers(method, port, post_data, authorization, short_lived_token)
    headers = {
      'Authorization' => "Bearer #{authorization}",
      'Date' => Time.now.httpdate,
    }

    # Add local development headers
    # headers.merge!(add_local_load_balancer_headers) if is_local

    # Add short-lived token if provided
    headers['short-lived-token'] = short_lived_token if short_lived_token

    # Add PSU headers
    headers.merge!(get_psu_headers(method, port))

    # Add content headers and digest for POST requests
    if post_data
      headers['Content-Type'] = 'application/json'
      headers['Content-Length'] = post_data.bytesize.to_s
      headers['Digest'] = generate_digest(post_data)
    end

    headers
  end

  # Headers exclusively for the Shine development environment
  # Content will be automatically injected by the Shine load balancer in production
  def add_local_load_balancer_headers
    {
      'public_load_balancer' => 'false',
      'client_cert_present' => 'true',
      'client_cert_chain_verified' => 'true'
    }
  end

  # PSU (Payment Service User) headers required for PSD2 compliance
  def get_psu_headers(method, port)
    {
      'PSU-Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'PSU-Accept-Charset' => 'utf-8',
      'PSU-Accept-Encoding' => 'gzip, deflate, br',
      'PSU-Accept-Language' => 'en-US,en;q=0.9',
      'PSU-Date' => '2019-01-01T00:00:00Z',
      'PSU-HTTP-Method' => method.to_s.upcase,
      'PSU-IP-Address' => '127.0.0.1',
      'PSU-IP-Port' => port.to_s,
      'PSU-Referer' => "https://localhost:#{port}/",
      'PSU-User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
    }
  end

  # Generate digest for request body using QSEAL private key
  def generate_digest(body)
    qseal_key = OpenSSL::PKey::RSA.new(File.read(qseal_key_path))
    signature = qseal_key.sign(OpenSSL::Digest::SHA256.new, body)
    Base64.strict_encode64(signature)
  end

  # Create HTTPS connection with client certificates for mutual TLS
  def create_https_connection(uri)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    # Load client certificates
    if File.exist?(qwac_cert_path) && File.exist?(qwac_key_path)
      http.cert = OpenSSL::X509::Certificate.new(File.read(qwac_cert_path))
      http.key = OpenSSL::PKey::RSA.new(File.read(qwac_key_path))
    else
      Rails.logger.warn "Client certificates not found at #{qwac_cert_path} or #{qwac_key_path}"
    end

    # SSL verification
    http.verify_mode = OpenSSL::SSL::VERIFY_PEER

    http
  end

  # Create the appropriate HTTP request object
  def create_request(method, uri, headers, post_data)
    # Use the full path with query string
    path = uri.request_uri rescue (uri.path + (uri.query ? "?#{uri.query}" : ""))
    
    case method.to_s.upcase
    when 'GET'
      request = Net::HTTP::Get.new(path)
    when 'POST'
      request = Net::HTTP::Post.new(path)
      request.body = post_data if post_data
    when 'PUT'
      request = Net::HTTP::Put.new(path)
      request.body = post_data if post_data
    when 'DELETE'
      request = Net::HTTP::Delete.new(path)
    when 'PATCH'
      request = Net::HTTP::Patch.new(path)
      request.body = post_data if post_data
    else
      raise ArgumentError, "Unsupported HTTP method: #{method}"
    end

    # Set headers
    headers.each { |key, value| request[key] = value }

    request
  end

  # Sign the request using HTTP Signature specification
  def sign_request(request, uri, post_data)
    return unless File.exist?(qseal_key_path)

    qseal_key = OpenSSL::PKey::RSA.new(File.read(qseal_key_path))
    
    # Determine which headers to sign
    headers_to_sign = QSEAL_HEADERS.dup
    headers_to_sign << 'digest' if post_data

    # Build signing string
    signing_string = build_signing_string(request, uri, headers_to_sign)

    # Sign the string
    signature = qseal_key.sign(OpenSSL::Digest::SHA256.new, signing_string)
    encoded_signature = Base64.strict_encode64(signature)

    # Build signature header
    signature_header = build_signature_header(headers_to_sign, encoded_signature)
    
    request['Signature'] = signature_header
    
    Rails.logger.debug "Signature header: #{signature_header}"
  end

  # Build the string to be signed according to HTTP Signature specification
  def build_signing_string(request, uri, headers)
    parts = headers.map do |header|
      case header
      when '(request-target)'
        method = request.method.downcase
        path = uri.request_uri rescue (uri.path + (uri.query ? "?#{uri.query}" : ""))
        "#{header}: #{method} #{path}"
      else
        header_name = header
        # Handle case-insensitive header lookup
        actual_header = request.each_header.find { |h| h[0].downcase == header_name.downcase }
        value = actual_header ? actual_header[1] : request[header_name]
        "#{header_name.downcase}: #{value}"
      end
    end
    
    parts.join("\n")
  end

  # Build the Signature header according to HTTP Signature specification
  def build_signature_header(headers, encoded_signature)
    headers_str = headers.join(' ')
    expires = Time.now.to_i + 3600
    
    %(keyId="#{key_id}",algorithm="rsa-sha256",headers="#{headers_str}",signature="#{encoded_signature}",expires="#{expires}")
  end

  # Parse the HTTP response
  def parse_response(response)
    body = nil
    
    if response.body && !response.body.empty?
      content_type = response['content-type'] || ''
      
      if content_type.include?('application/json')
        body = JSON.parse(response.body)
      else
        body = response.body
      end
      
      Rails.logger.debug "Response body: #{response.body}"
    end

    status = response.code.to_i

    # Handle error responses
    if status >= 400
      error_message = body.is_a?(Hash) ? body['message'] || body['error'] : body
      Rails.logger.error "Request failed with status #{status}: #{error_message}"
      raise StandardError, "API request failed with status #{status}: #{error_message}"
    end

    {
      body: body,
      status: status
    }
  end
end
