class Quantity < ApplicationRecord
  belongs_to :smoothy
  belongs_to :ingredient

  validates :quantity, presence:true, numericality: { greater_than: 0}
end
