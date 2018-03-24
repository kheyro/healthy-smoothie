class CreateSmoothyCategories < ActiveRecord::Migration[5.1]
  def change
    create_table :smoothy_categories do |t|
      t.belongs_to :smoothy, foreign_key: true
      t.belongs_to :category, foreign_key: true

      t.timestamps
    end
  end
end
