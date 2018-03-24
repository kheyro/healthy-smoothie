class Category < ApplicationRecord
  has_many :smoothy_categories
  has_many :smoothies, through: :smoothy_categories

  validates :name, presence: true, uniqueness: { case_sensitive: false }
end
