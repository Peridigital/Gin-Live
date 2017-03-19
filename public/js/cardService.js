angular.module('cardGame').service('cardService', function($http) {
  this.serviceTest = 'Hello, I am a working test!'



  this.getDeck = function() {
    return $http({
      method: 'GET',
      url: 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1',
    }).then(function(response){
      return {
        deckId: response.data.deck_id,
        remainingCards: response.data.remaining
      }
    })
  }
  this.drawCard = function(deckId) {
    return $http({
      method: 'GET',
      url: 'https://deckofcardsapi.com/api/deck/' + deckId + '/draw/?count=1',
    }).then(function(response){
      var card = response.data.cards[0]
      card.selected = false
      return {
        cards: card,
        remainingCards: response.data.remaining
      }
    })
  }



})
