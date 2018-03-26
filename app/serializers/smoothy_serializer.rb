class SmoothySerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :visibility
  belongs_to :user, serializer: UserSerializer
  # has_many :ingredients, serializer: IngredientSerializer
  has_many :quantities, serializer: QuantitySerializer

  # def ingredients
  #   object.ingredients.map do |ingredient|
  #     IngredientSerializer.new(ingredient).attributes
  #   end
  # end
end
