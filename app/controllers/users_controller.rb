class UsersController < ApplicationController
  before_action :required_signed_in, only: [:show]

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      session[:user_id] = @user.id
      redirect_to root_path, notice: "Sign up successful! Welcome #{@user.name}!"
    else
      render :new
    end
  end

  def show
    
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end
