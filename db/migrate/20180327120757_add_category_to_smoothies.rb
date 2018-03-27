class AddCategoryToSmoothies < ActiveRecord::Migration[5.1]
  def change
    add_reference :smoothies, :category, foreign_key: true
  end
end
