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
