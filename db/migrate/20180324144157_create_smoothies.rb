class CreateSmoothies < ActiveRecord::Migration[5.1]
  def change
    create_table :smoothies do |t|
      t.string :name
      t.text :description
      t.string :visibility
      t.belongs_to :user, foreign_key: true

      t.timestamps
    end
  end
end
