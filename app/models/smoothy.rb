class Smoothy < ApplicationRecord
  belongs_to :user
  has_many :smoothy_categories
  has_many :categories, through: :smoothy_categories
  has_many :quantities, :dependent => :delete_all
  has_many :ingredients, through: :quantities

  validates :name, presence: true, uniqueness: { case_sensitive: false }
  validates :visibility, presence: true, inclusion: { in: %w(public private) }

  accepts_nested_attributes_for :quantities

  def quantities_attributes=(quantities_attributes)
    self.quantities.destroy_all
    # uniq { |p| p["ingredient_id"] } uniq ingredient, keep the first in the array
    quantities_attributes.uniq { |p| p["ingredient_id"] }.each do |t|
      self.quantities.build(t)
    end

    # if self.quantities.find_by(ingredient_id: t["ingredient_id"])
    #   self.quantities.update(t)
    # else
      # self.quantities.build(t)
    # end
  end
end
