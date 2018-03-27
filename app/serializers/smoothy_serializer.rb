class SmoothySerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :visibility
  belongs_to :user, serializer: UserSerializer
  has_many :quantities, serializer: QuantitySerializer
end
