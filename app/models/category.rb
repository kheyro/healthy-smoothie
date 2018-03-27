class Category < ApplicationRecord
  has_many :smoothies

  validates :name, presence: true, uniqueness: { case_sensitive: false }
end
