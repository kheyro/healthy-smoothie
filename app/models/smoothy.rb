class Smoothy < ApplicationRecord
  belongs_to :user
  has_many :smoothy_categories
  has_many :categories, through: :smoothy_categories
  has_many :quantities
  has_many :ingredients, through: :quantities

  validates :name, presence: true, uniqueness: { case_sensitive: false }
  validates :visibility, presence: true, inclusion: { in: %w(public private) }
end
