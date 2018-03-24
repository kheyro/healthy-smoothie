class Ingredient < ApplicationRecord
  has_many :quantities
  has_many :smoothies, through: :quantities
end
