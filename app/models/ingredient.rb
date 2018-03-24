class Ingredient < ApplicationRecord
  has_many :quantities
  has_many :smoothies, through: :quantities

  validates :name, presence: true, uniqueness: { case_sensitive: false }
end
