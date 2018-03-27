class QuantitySerializer < ActiveModel::Serializer
  attributes :id, :quantity, :unit, :ingredient_id, :ingredient
  belongs_to :ingredient, serializer: IngredientSerializer

  def ingredient_name
    # object.ingredient.map do |ingredient|
      IngredientSerializer.new(object.ingredient, only: [:name])
    # end
  end
end
