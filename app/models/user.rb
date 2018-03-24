class User < ApplicationRecord
  has_secure_password

  has_many :smoothies

  validates :name, presence: true
  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates :role, presence: true, inclusion: { in: %w(admin user) }
end
