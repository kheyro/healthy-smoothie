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


$(function(){
  var currentSmoothie

  // Save smoothie
  $('#new_smoothy').on('submit', function(e) {
    e.preventDefault()

    let data = $(this).serialize()

    if (!currentSmoothie) {
      $.ajax({
        url: $(this).action,
        data: data,
        method: 'post',
        dataType: 'json'
      }).done(function(data) {
        console.log('Add smoothie Smoothy#create: ', data)

        let smoothie = data.data.attributes
        let user = data.included[0].attributes

        let smoothieCard = `
            <div class="card" data-id="${data.data.id}">
              <!-- <img class="card-img-top" src="..." alt="Card image cap"> -->
              <div class="card-body">
                <h5 class="card-title">${smoothie.name}</h5>
                <p class="card-text">${smoothie.description}</p>
              </div>
              <div class="card-footer">
                <small class="text-muted">By ${user.name}</small>
                <div class="card-action">
                  <a href="#" class="edit-smoothie">Edit</a>
                  <a href="#" class="delete-smoothie">Delete</a>
                </div>
              </div>
            </div>`

        $('#smoothies-list .card-columns').append(smoothieCard)
        resetSmoothieForm()
      })
    } else {
      let url = `/users/2/smoothies/${currentSmoothie}`

      $.ajax({
        url: url,
        data: data,
        method: 'patch',
        dataType: 'json'
      }).done(function(data) {
        console.log('Smoothy#update log:', data)
        resetSmoothieForm()
      })
    }

  })

  $('#smoothies-list').on('click', '.delete-smoothie', function(e) {
    e.preventDefault()

    let $smoothieCard = $(this).closest('div.card')
    let url = `/users/2/smoothies/${$smoothieCard.attr('data-id')}`

    $.ajax({
      method: 'delete',
      url: url
    }).done(function(data) {
      $smoothieCard.remove()
    })
  })

  $('#smoothies-list').on('click', '.edit-smoothie', function(e) {
    e.preventDefault()

    let $smoothieCard = $(this).closest('div.card')
    console.log($(this))
    let url = `/users/2/smoothies/${$smoothieCard.attr('data-id')}`

    $.ajax({
      method: 'get',
      url: url,
      dataType: 'json'
    }).done(function(data) {
      console.log('Edit show#smoothy log:', data)

      let smoothie = data.data.attributes
      let user = data.included[0].attributes
      let ingredients = data.included.slice(1)

      currentSmoothie = data.data.id

      $('#new_smoothy input[name="smoothy[name]"]').val(smoothie.name)
      $('#new_smoothy textarea[name="smoothy[description]"]').val(smoothie.description)
      $('#new_smoothy input[name="smoothy[visibility]"][value="' + smoothie.visibility + '"]').prop('checked', true)

      // delete all ingredient field except last one (to be cloned)
      $("#ingredient-list .form-row:not(:last)").remove();

      ingredients.forEach(function(el, i) {
        // console.log('Edit show#smoothy ingredient ' + i + ':', el)
        let $ingredientInput = $("#ingredient-list .form-row").first().clone()

        $ingredientInput.find('select[name="smoothy[quantities_attributes][][ingredient_id]"] option[value=' + el.attributes["ingredient-id"] + ']').prop('selected', true)
        $ingredientInput.find('input[name="smoothy[quantities_attributes][][quantity]"]').val(el.attributes.quantity)
        $ingredientInput.find('select[name="smoothy[quantities_attributes][][unit]"] option[value=' + el.attributes.unit + ']').prop('selected', true)

        $('#ingredient-list').append($ingredientInput)

      })

      $("#ingredient-list .form-row").first().remove() // remove the first row used for clone
      $("#ingredient-list .form-row:not(:last) div .btn-add-ingredient").remove(); // Clean add ingredient button
    })
  })

  $('#ingredient-list').on('click', '.btn-add-ingredient', function(e) {
    e.preventDefault()

    let $ingredientInput = $(this).closest('.form-row').clone()
    $ingredientInput.find('input[name="smoothy[quantities_attributes][][ingredient_id]"] option:first').prop('checked', true)
    $ingredientInput.find('input[name="smoothy[quantities_attributes][][quantity]"]').val('')
    $ingredientInput.find('input[name="smoothy[quantities_attributes][][unit]"] option:first').prop('checked', true)

    $('#ingredient-list').append($ingredientInput);


    $(this).remove()
  })

  $('#ingredient-list').on('click', '.btn-remove-ingredient', function(e) {
    e.preventDefault()

    let hasAddBtn = $(this).parent().find('.btn-add-ingredient').length

    if ($('#ingredient-list .form-row').length > 1) {
      $(this).closest('.form-row').remove()
      // Re-add the add ingredient button last ingredient input was deleted
      if (hasAddBtn === 1) {
        $('#ingredient-list .form-row:last div:last').append('<button class="btn btn-primary btn-add-ingredient">+</button>')
      }
    }
  })
})

let resetSmoothieForm = () => {
  $('#new_smoothy #ingredient-list .form-row:not(:last)').remove();
  $('#new_smoothy')[0].reset()
}
