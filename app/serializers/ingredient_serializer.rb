class IngredientSerializer < ActiveModel::Serializer
  attributes :id, :name
  has_many :quantities
end
