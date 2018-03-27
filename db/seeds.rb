# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# Users
User.create(name: "admin", email: "admin@gmail.com", password: "admin", role: "admin")
john = User.create(name: "john", email: "john@gmail.com", password: "user", role: "user")

# Ingredients
30.times do
  Ingredient.create!(name: Faker::Food.unique.ingredient)
end

# Categories
detox = Category.create(name: "Detox smoothie")
green = Category.create(name: "Green smoothie")
protein = Category.create(name: "Protein smoothie")
vegan = Category.create(name: "Vegan smoothie")
yogurt = Category.create(name: "Yogurt smoothie")

# Smoothie
first_smoothie = john.smoothies.create(
  name: "My first smoothie",
  description: "The perfect protein smoothie after a long work out session, refreshing, energizing and full of protein!")
first_smoothie.category = protein
first_smoothie.save
first_smoothie.quantities.create(ingredient: Ingredient.first, unit: "pcs")
first_smoothie.quantities.create(ingredient: Ingredient.last, unit: "pcs")
first_smoothie.save
