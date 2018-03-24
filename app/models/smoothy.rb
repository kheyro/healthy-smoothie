class Smoothy < ApplicationRecord
  belongs_to :user
  has_many :smoothy_categories
  has_many :categories, through: :smoothy_categories
  has_many :quantities
  has_many :ingredients, through: :quantities
end
