class SessionsController < ApplicationController

  def new
    @user = User.new
  end

  def create
    if auth_hash = request.env["omniauth.auth"]
      @user = User.find_or_create_by_omniauth(auth_hash)
      session[:user_id] = @user.id
      redirect_to root_path
    else
      @user = User.find_by(email: params[:user][:email])

      if @user && @user.authenticate(params[:user][:password])
        session[:user_id] = @user.id
        redirect_to root_path
      else
        flash[:notice] = "Invalid email or password!"
        render :new
      end
    end
  end

  def destroy
    reset_session
    redirect_to root_path
  end

  private

  def auth
    request.env['omniauth.auth']
  end

end
