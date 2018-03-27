class Ingredient {

  constructor(id, quantity, unit, name) {
    this.id = id
    this.quantity = quantity
    this.unit = unit
    this.name = name
  }

  populateFullCard() {
    let $ingredientLI = `<li>${this.quantity} ${this.unit} of ${this.name}</li>`
    $('#smoothieFullCard .smoothie-ingredients ul').append($ingredientLI)
  }

  populateForm() {
    let $ingredientInput = $("#ingredient-list .form-row").first().clone()

    $ingredientInput.find(`select[name="smoothy[quantities_attributes][][ingredient_id]"] option[value=${this.id}]`).prop('selected', true)
    $ingredientInput.find('input[name="smoothy[quantities_attributes][][quantity]"]').val(this.quantity)
    $ingredientInput.find(`select[name="smoothy[quantities_attributes][][unit]"] option[value=${this.unit}]`).prop('selected', true)

    $('#ingredient-list').append($ingredientInput)
  }

  static removeIngredientFromForm(delButton) {
    let hasAddBtn = $(delButton).parent().find('.btn-add-ingredient').length

    if ($('#ingredient-list .form-row').length > 1) {
      $(delButton).closest('.form-row').fadeOut('fast', function() {
        $(this).remove()
        // Re-add the add ingredient button last ingredient input was deleted
        if (hasAddBtn === 1) {
          $('#ingredient-list .form-row:last div:last').append('<button class="btn btn-primary btn-add-ingredient">+</button>')
        }
      })
    }
  }

  static addIngredientToForm(addButton) {
    let $ingredientInput = $(addButton).closest('.form-row').clone()
    $ingredientInput.find('input[name="smoothy[quantities_attributes][][ingredient_id]"] option:first').prop('checked', true)
    $ingredientInput.find('input[name="smoothy[quantities_attributes][][quantity]"]').val('')
    $ingredientInput.find('input[name="smoothy[quantities_attributes][][unit]"] option:first').prop('checked', true)

    $('#ingredient-list').hide().append($ingredientInput).fadeIn();

    $(addButton).remove()
  }
}
