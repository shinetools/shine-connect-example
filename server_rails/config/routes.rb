Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # OAuth2 routes
  get '/login', to: 'auth#login'
  get '/redirect', to: 'auth#callback'

  # User profile routes
  get '/user_profile', to: 'user_profile#show'
  get '/user_profile_mtls', to: 'user_profile#show_mtls'
end
