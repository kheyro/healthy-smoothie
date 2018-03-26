class SmoothiesController < ApplicationController

  protect_from_forgery :only => [:update, :create]
  # protect_from_forgery :except => [:update, :destroy, :create]

  def index
    @smoothies = Smoothy.where(user: current_user)
    @smoothy = current_user.smoothies.build
  end

  def create
    @smoothie = Smoothy.new(smoothie_params)
    @smoothie.user = current_user
    @smoothie.save!
    render json: @smoothie, status: 201, include: [:user]
  end

  def show
    @smoothie = Smoothy.find_by_id(params[:id])
    render json: @smoothie, include: [:user, :quantities]
  end

  def update
    @smoothie = Smoothy.find_by_id(params[:id])
    if @smoothie.update!(smoothie_params) && current_user == @smoothie.user
      render json: @smoothie, status: 200, include: [:user]
    end
  end

  def destroy
    @smoothie = Smoothy.find_by_id(params[:id])

    if current_user == @smoothie.user && @smoothie.destroy!
      render json: { success_message: 'Successfully deleted!' }, status: 200
    end
  end

  private

    def smoothie_params
      params.require(:smoothy).permit(:name, :description, :visibility, quantities_attributes: [:ingredient_id, :quantity, :unit])
    end
end
