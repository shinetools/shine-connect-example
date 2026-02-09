# Load Shine Connect configuration
SHINE_CONFIG = YAML.load_file(Rails.root.join('config', 'shine_config.yml'), aliases: true)[Rails.env]

# Make configuration available as constants
module ShineConnect
  CLIENT_ID = SHINE_CONFIG['client_id']
  CLIENT_SECRET = SHINE_CONFIG['client_secret']
  SCOPE = SHINE_CONFIG['scope']
  REDIRECT_URI = SHINE_CONFIG['redirect_uri']
  WEBHOOK_SECRET = SHINE_CONFIG['webhook_secret']
  API_HOST = SHINE_CONFIG['api_host']
  AUTH_HOST = SHINE_CONFIG['auth_host']
  KEY_ID = SHINE_CONFIG['key_id']
  QWAC_KEY_PATH = SHINE_CONFIG['qwac_key_path']
  QWAC_CERT_PATH = SHINE_CONFIG['qwac_cert_path']
  QSEAL_KEY_PATH = SHINE_CONFIG['qseal_key_path']
  ROOT_CA_PATH = SHINE_CONFIG['root_ca_path']
end
