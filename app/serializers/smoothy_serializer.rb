class SmoothySerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :visibility, :category
  belongs_to :user, serializer: UserSerializer
  belongs_to :category, serializer: CategorySerializer
  has_many :quantities, serializer: QuantitySerializer
end
