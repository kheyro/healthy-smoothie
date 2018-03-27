class QuantitySerializer < ActiveModel::Serializer
  attributes :id, :quantity, :unit, :ingredient_id, :ingredient
  belongs_to :ingredient, serializer: IngredientSerializer
end
