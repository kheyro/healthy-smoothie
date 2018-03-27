Rails.application.routes.draw do
  root 'application#welcome'

  resources :users do
    resources :smoothies
  end

  get '/signin' => 'sessions#new'
  post '/signin' => 'sessions#create'
  get '/logout' => 'sessions#destroy', as: 'destroy_user'
  get '/auth/:provider/callback' => 'sessions#create'

  get '/smoothies' => 'application#index'
end
