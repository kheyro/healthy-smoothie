class SmoothySerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :visibility, :category, :user, :quantities
  belongs_to :user, serializer: UserSerializer
  belongs_to :category, serializer: CategorySerializer
  has_many :quantities, serializer: QuantitySerializer

  def category
    CategorySerializer.new(object.category, root: false)
  end

  def user
    UserSerializer.new(object.user, root: false)
  end

end
