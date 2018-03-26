class QuantitySerializer < ActiveModel::Serializer
  attributes :id, :quantity, :unit, :ingredient_id
  belongs_to :ingredient, serializer: IngredientSerializer
end
