# ShineRegulatedRequest Usage Examples

## Overview

`ShineRegulatedRequest` is a Ruby service class that provides regulated API requests to the Shine API with:

- HTTP Signature authentication (QSEAL)
- Mutual TLS authentication (QWAC certificates)
- PSD2-compliant PSU headers
- Request body signing and digest generation

## Basic Usage

```ruby
# Initialize the service
regulated_request = ShineRegulatedRequest.new

# Make a GET request
response = regulated_request.call(
  method: 'GET',
  path: '/v3/bank-accounts',
  authorization: access_token
)

puts response[:body]  # Response data
puts response[:status]  # HTTP status code
```

## POST Request with Payload

```ruby
regulated_request = ShineRegulatedRequest.new

response = regulated_request.call(
  method: 'POST',
  path: '/v3/transfers/recipients',
  authorization: access_token,
  payload: {
    name: 'John Doe',
    iban: 'FR7630001007941234567890185'
  }
)
```

## With Short-Lived Token

```ruby
regulated_request = ShineRegulatedRequest.new

response = regulated_request.call(
  method: 'POST',
  path: '/v3/action-request',
  authorization: access_token,
  short_lived_token: short_lived_token,
  payload: {
    action: 'BANK_TRANSFER',
    # ... other data
  }
)
```

## Custom Configuration

```ruby
# Use custom certificate paths and settings
regulated_request = ShineRegulatedRequest.new(
  api_host: 'https://public.api.staging.shine.fr',
  qseal_key_path: Rails.root.join('custom', 'path', 'qseal_key.pem'),
  qwac_cert_path: Rails.root.join('custom', 'path', 'qwac_cert.pem'),
  qwac_key_path: Rails.root.join('custom', 'path', 'qwac_key.pem'),
  key_id: 'your-key-id',
  is_local: false
)
```

## Usage in Controllers

```ruby
class BankAccountsController < ApplicationController
  def index
    access_token = session[:access_token]

    regulated_request = ShineRegulatedRequest.new

    begin
      response = regulated_request.call(
        method: 'GET',
        path: '/v3/bank-accounts',
        authorization: access_token
      )

      render json: response[:body], status: response[:status]
    rescue StandardError => e
      Rails.logger.error "Failed to fetch bank accounts: #{e.message}"
      render json: { error: e.message }, status: :internal_server_error
    end
  end
end
```

## Configuration Requirements

### Certificate Files

Place your certificates in `server_rails/server/certificates/`:

- `qseal_key.pem` - QSEAL private key for signing
- `qwac_cert.pem` - QWAC certificate for mutual TLS
- `qwac_key.pem` - QWAC private key for mutual TLS

### Environment Variables

Set `KEY_ID` in your environment:

```bash
export KEY_ID="your-qseal-key-id"
```

Or configure in `shine_config.yml`:

```yaml
development:
  # ... other config
  key_id: 'your-qseal-key-id'
```

## Error Handling

The service raises `StandardError` for:

- HTTP status codes >= 400
- Network errors
- Certificate loading errors
- Invalid JSON responses

```ruby
begin
  response = regulated_request.call(
    method: 'GET',
    path: '/v3/bank-accounts',
    authorization: access_token
  )
rescue StandardError => e
  Rails.logger.error "Request failed: #{e.message}"
  # Handle error appropriately
end
```

## Differences from TypeScript Version

The Ruby implementation is functionally equivalent to the TypeScript `regulatedRequest` function with the following adaptations:

1. **Class-based approach**: Uses a Ruby service class instead of a function
2. **Ruby idioms**: Uses Ruby naming conventions (snake_case) and patterns
3. **Rails integration**: Integrates with Rails logger and configuration
4. **Error handling**: Raises Ruby exceptions instead of Promise rejections
5. **Certificate handling**: Uses Ruby's OpenSSL library for certificate operations

## Testing

```ruby
# In a controller or service
def test_regulated_request
  regulated_request = ShineRegulatedRequest.new

  response = regulated_request.call(
    method: 'GET',
    path: '/v3/user/profile',
    authorization: 'your-access-token'
  )

  Rails.logger.info "Response: #{response[:body].inspect}"
end
```
