class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  helper_method :current_user

  def welcome
  end

  def index
    @smoothies = Smoothy.where(visibility: 'public').order(updated_at: :desc)
    render json: @smoothies
  end

  rescue_from ActiveRecord::RecordInvalid do |e|
    render json: { error: { RecordInvalid: e.record.errors } }, status: 406
  end

  private

  def current_user
    @current_user ||= User.find_by_id(session[:user_id]) if session[:user_id]
  end

  def is_logged_in?
    !!current_user
  end

  def required_signed_in
    redirect_to :root if !is_logged_in?
  end
end
