// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require turbolinks
//= require_tree .
//= require jquery3
//= require popper
//= require bootstrap

var currentSmoothie

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

class Smoothie {
  constructor(data) {
    this.id = data.data.id
    this.name = data.data.attributes.name
    this.userId = data.included[0].id
    this.username = data.included[0].attributes.name
    this.description = data.data.attributes.description
    this.visibility = data.data.attributes.visibility
    this.ingredients = data.included.slice(1)
  }

  populateForm() {
    $('#new_smoothy input[name="smoothy[name]"]').val(this.name)
    $('#new_smoothy textarea[name="smoothy[description]"]').val(this.description)
    $(`#new_smoothy input[name="smoothy[visibility]"][value="${this.visibility}"]`).prop('checked', true)
    // // delete all ingredient field except last one (to be cloned)
    $("#ingredient-list .form-row:not(:last)").remove();

    this.ingredients.forEach(function(el, i) {
      // console.log('Edit show#smoothy ingredient ' + i + ':', el)
      let newIngredient = new Ingredient(el.attributes["ingredient-id"], el.attributes.quantity, el.attributes.unit, el.attributes.ingredient.name)
      newIngredient.populateForm()
    })

    $("#ingredient-list .form-row").first().remove() // remove the first row used for clone
    $("#ingredient-list .form-row:not(:last) div .btn-add-ingredient").remove(); // Clean add ingredient button
  }

  renderCard() {
    return `
        <div class="card" data-id="${this.id}">
          <!-- <img class="card-img-top" src="..." alt="Card image cap"> -->
          <div class="card-body">
            <h5 class="card-title">${this.name}</h5>
            <p class="card-text">${this.description}</p>
          </div>
          <div class="card-footer">
            <small class="smoothie-user text-muted" data-id="${this.userId}">By ${this.username}</small>
            <div class="card-action float-right">
              <a href="#" class="edit-smoothie">Edit</a>
              <a href="#" class="delete-smoothie">Delete</a>
            </div>
          </div>
        </div>`
  }

  populateFullCard() {
    let $smoothieFullCard = $('#smoothieFullCard')

    $smoothieFullCard.find('h5.smoothie-title').text(this.name)
    $smoothieFullCard.find('.smoothie-description p').text(this.description)
    $smoothieFullCard.find('.smoothie-author span').text(this.username)

    this.ingredients.forEach(function(el, i) {
      // console.log('Edit show#smoothy ingredient ' + i + ':', el)
      let newIngredient = new Ingredient(el.attributes["ingredient-id"], el.attributes.quantity, el.attributes.unit, el.attributes.ingredient.name)
      newIngredient.populateFullCard()
    })

    $('#smoothieFullCardModal').modal('show')
  }

  updateCard(){
    let $card = $(`.card[data-id="${this.id}"]`)
    $card.find('.card-title').text(this.name)
    $card.find('.card-text').text(this.description)
  }

  static getUrl(el) {
    let $smoothie = $(el).closest('div.card')
    let smoothieId = $smoothie.attr('data-id')
    let userId = $smoothie.find('.smoothie-user').attr('data-id')
    // let userId = $(el).parent().siblings('.smoothie-user').attr('data-id')
    return `/users/${userId}/smoothies/${smoothieId}`
  }

  static resetSmoothieForm() {
    $('#new_smoothy #ingredient-list .form-row:not(:last)').remove();
    $('#new_smoothy')[0].reset()
    currentSmoothie = null
  }
}

$(function(){

  // Add / Edit smoothie
  $('#new_smoothy').on('submit', function(e) {
    e.preventDefault()
    let url = (!currentSmoothie) ? $(this).action : `/users/${$('div.card:first .smoothie-user').attr('data-id')}/smoothies/${currentSmoothie}`
    let data = $(this).serialize()

    $.ajax({
      url: url,
      data: data,
      method: (!currentSmoothie) ? 'post' : 'patch',
      dataType: 'json'
    }).done(function(data) {
      let smoothie = new Smoothie(data)

      if (!currentSmoothie) {
        currentSmoothie = smoothie.id
        smoothieCard = smoothie.renderCard()
        $('#smoothies-list .card-columns').hide().prepend(smoothieCard).fadeIn("slow")
      } else {
        smoothie.updateCard()
      }
      $('#smoothieFormModal').modal('hide')
      Smoothie.resetSmoothieForm()
    })

  })

  // Delete smoothie
  $('#smoothies-list').on('click', '.delete-smoothie', function(e) {
    e.preventDefault()
    e.stopPropagation()

    let url = Smoothie.getUrl(this)

    $.ajax({
      method: 'delete',
      url: url
    }).done((data) => {
      $(this).closest('div.card').fadeOut(400, function() { $(this).remove() })
    })
  })

  // Populate form for edition
  $('#smoothies-list').on('click', '.edit-smoothie', function(e) {
    e.preventDefault()
    e.stopPropagation()
    let url = Smoothie.getUrl(this)

    $.ajax({
      method: 'get',
      url: url,
      dataType: 'json'
    }).done(function(data) {
      let smoothie = new Smoothie(data)
      console.log(data)
      currentSmoothie = smoothie.id
      smoothie.populateForm()
      $('#smoothieFormModal').modal('show')
    })
  })

  $('#smoothies-list').on('click', '.card', function (e) {
    e.preventDefault()
    let url = Smoothie.getUrl(this)
    $.ajax({
      method: 'get',
      url: url,
      dataType: 'json'
    }).done(function(data) {
      let smoothie = new Smoothie(data)
      console.log(data)

      $('#smoothieFullCard .smoothie-ingredients ul').html('')
      smoothie.populateFullCard()
    })
  })

  // Add ingredient field on the form
  $('#ingredient-list').on('click', '.btn-add-ingredient', function(e) {
    e.preventDefault()
    Ingredient.addIngredientToForm(this)
  })

  // Remove ingredient field on the form
  $('#ingredient-list').on('click', '.btn-remove-ingredient', function(e) {
    e.preventDefault()
    Ingredient.removeIngredientFromForm(this)
  })

  $('#smoothieFormModal').on('hidden.bs.modal', () => {
    Smoothie.resetSmoothieForm()
    currentSmoothie = null
  })

})
