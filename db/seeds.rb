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
  description: "The perfect protein smoothie after a long work out session, refreshing, energizing and full of protein!",
  visibility: "public",
  category: protein)
first_smoothie.quantities.create(ingredient: Ingredient.first, quantity: 10, unit: "pcs")
first_smoothie.quantities.create(ingredient: Ingredient.last, quantity: 5, unit: "g")
first_smoothie.save

second_smoothie = john.smoothies.create(
  name: "My second smoothie",
  description: "The perfect protein smoothie after a long work out session, refreshing, energizing and full of protein!",
  visibility: "public",
  category: vegan)
second_smoothie.quantities.create(ingredient: Ingredient.find(5), quantity: 1, unit: "pcs")
second_smoothie.quantities.create(ingredient: Ingredient.find(6), quantity: 7, unit: "g")
second_smoothie.quantities.create(ingredient: Ingredient.find(10), quantity: 12, unit: "ml")
second_smoothie.save
