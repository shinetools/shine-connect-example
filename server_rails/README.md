# Shine Connect - Ruby on Rails Server

This is a Ruby on Rails implementation of the Shine Connect OAuth2 login flow.

## Prerequisites

- Ruby 3.2.0 or higher
- Bundler
- SQLite3

## Setup

1. Install dependencies:

```bash
cd server_rails
bundle install
```

2. Configure your Shine Connect credentials:

   - Edit `config/shine_config.yml` with your client ID, client secret, and other credentials
   - Update the `redirect_uri` if needed (default: http://localhost:9877/redirect)

3. Start the server:

```bash
bundle exec rails server -p 9877
```

The server will start on port 9877 by default.

## Available Endpoints

### GET /login

Initiates the OAuth2 authorization flow by redirecting to Shine's authorization endpoint.

**Query Parameters:**

- `requestedScope` (optional): Custom OAuth2 scope. Defaults to "bank user:profile:read"

**Example:**

```
http://localhost:9877/login
http://localhost:9877/login?requestedScope=bank
```

### GET /redirect

OAuth2 callback endpoint that handles the authorization code and exchanges it for access tokens.

This endpoint is automatically called by Shine after user authorization.

## Configuration

The application configuration is located in `config/shine_config.yml`. You can configure different settings for:

- `development`: Local development environment
- `staging`: Staging environment
- `production`: Production environment

The configuration includes:

- `client_id`: Your Shine Connect client ID
- `client_secret`: Your Shine Connect client secret
- `scope`: Default OAuth2 scopes
- `redirect_uri`: OAuth2 callback URL
- `webhook_secret`: Webhook signature verification secret
- `api_host`: Shine API host URL
- `auth_host`: Shine Auth host URL

## Environment Variables

You can override the Rails environment using:

```bash
RAILS_ENV=production bundle exec rails server
```

## Development

The application runs in API mode and includes:

- CORS support for cross-origin requests
- HTTParty for HTTP requests
- Logging for debugging OAuth2 flow

## Security Notes

⚠️ **WARNING**: This example passes the access token to the frontend via URL parameters. In a production application, you should:

- Store tokens securely in a backend session or database
- Use HTTP-only cookies for token storage
- Never expose sensitive tokens to the client-side
- Implement proper token refresh mechanisms

## Project Structure

```
server_rails/
├── app/
│   └── controllers/
│       ├── application_controller.rb
│       └── auth_controller.rb          # Login and callback logic
├── config/
│   ├── initializers/
│   │   ├── cors.rb                     # CORS configuration
│   │   └── shine_config.rb             # Load Shine configuration
│   ├── shine_config.yml                # Shine Connect credentials
│   ├── routes.rb                       # Application routes
│   └── puma.rb                         # Server configuration
├── Gemfile                             # Ruby dependencies
└── README.md                           # This file
```

## Testing the Login Flow

1. Start the Rails server:

```bash
bundle exec rails server -p 9877
```

2. Open your browser and navigate to:

```
http://localhost:9877/login
```

3. You'll be redirected to Shine's authorization page

4. After authorization, you'll be redirected back to the callback URL with the access token

## Troubleshooting

- Check the Rails logs for detailed error messages
- Ensure your `redirect_uri` in `shine_config.yml` matches the one registered in your Shine Connect application
- Verify your client credentials are correct
- Make sure the Shine API endpoints are accessible from your environment
