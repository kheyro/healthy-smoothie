class CreateQuantities < ActiveRecord::Migration[5.1]
  def change
    create_table :quantities do |t|
      t.belongs_to :smoothie, foreign_key: true
      t.belongs_to :ingredient, foreign_key: true
      t.float :quantity
      t.string :unit

      t.timestamps
    end
  end
end
