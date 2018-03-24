class Smoothie < ApplicationRecord
  belongs_to :user
  has_many :smoothie_categories
  has_many :categories, through: :smoothie_categories
  has_many :quantities
  has_many :ingredients, through: :quantities
end
