class Category < ApplicationRecord
  has_many :smoothie_categories
  has_many :smoothies, through: :smoothie_categories
end
