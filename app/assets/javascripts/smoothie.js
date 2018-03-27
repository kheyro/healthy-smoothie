class Smoothie {
  constructor(data) {
    this.id = data.data.id
    this.name = data.data.attributes.name
    this.userId = data.included[0].id
    let defaultUsername = data.included[0].attributes.name
    this.username = defaultUsername[0].toUpperCase() + defaultUsername.substr(1)
    this.description = data.data.attributes.description
    this.visibility = data.data.attributes.visibility
    this.ingredients = data.included.slice(1)
    this.category = data.data.attributes.category
  }

  populateForm() {
    $('#new_smoothy input[name="smoothy[name]"]').val(this.name)
    $('#new_smoothy textarea[name="smoothy[description]"]').val(this.description)
    $(`#new_smoothy input[name="smoothy[visibility]"][value="${this.visibility}"]`).prop('checked', true)

    $(`#new_smoothy select[name="smoothy[category_id]"] option[value=${this.category.id}]`).prop('selected', true)

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
            <small class="smoothie-user text-muted" data-id="${this.userId}">by ${this.username} in <span class="card-category">${this.category.name}</span></small>
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
    $smoothieFullCard.find('.smoothie-author').text(this.username)
    $smoothieFullCard.find('.smoothie-category').text(this.category.name)

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
    $card.find('.card-category').text(this.category.name)
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
