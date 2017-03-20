angular.module('cardGame').service('gameService', function($http) {

  this.makePlayer = function (playerName, playerID){
    var opponent
    function test() {
      if (playerID === 2) {
        opponent = 1
      } else if (playerID === 1) {
        opponent = 2
      }
    }
    test()
    this.localPlayer = {
      name: playerName,
      playerID: playerID,
      opponent: opponent,
      hand: []
    }
    return this.localPlayer
  }

  this.makeGame = function (players, deck) {
    return {
      deckId: deck.deckId,
      remainingCards: deck.remainingCards,
      players: players,
      discardedCards: [{image: ''}],
      discardCard: function (localPlayer) {
        this.discardedCards.unshift(localPlayer.selected)
        this.players[localPlayer.playerID - 1].hand.splice(localPlayer.selected.index, 1)
        localPlayer.selected = ''
      },
      declareWinner: function (player) {
        this.declaredWinner = player.name;
        this.winningHand = player.hand
      },
      checkTurn: function (playerID, action) {
        if (playerID === this.turn.currentPlayer) {
          if (action === this.turn.currentPhase) {
            return true
          } else {
            console.log('Wrong phase');
          }
        } else {
          console.log('Wrong player, ' + playerID);
        }
      },
      turn: {
        currentPlayer: 1,
        currentPhase: 'Draw',
        turnCount: 1,
        sortHand: function (hand) {
          console.log(hand);
          var sortedHand = [];

          for (var i = 0; i < hand.length; i++) {
            switch (hand[i].value) {
              case 'ACE':
                sortedHand.push('14')
              break;
              case 'KING':
                sortedHand.push('13')
              break;
              case 'QUEEN':
                sortedHand.push('12')
              break;
              case 'JACK':
                sortedHand.push('11')
              break;
              default:
                sortedHand.push(hand[i].value)
            }
          }
          sortedHand.sort(function (a, b) {
            return a - b
          })
          return sortedHand
        },
        checkWinner: function (game, localPlayer) {

          var hand = game.players[localPlayer.playerID - 1].hand
          var sortedHand = this.sortHand(hand)

          var suitTracker = {
            "HEARTS": 0,
            "CLUBS": 0,
            "SPADES": 0,
            "DIAMONDS": 0
          }
          var fullSuit = false
          for (var i = 0; i < hand.length; i++) {
            suitTracker[hand[i].suit] ++
          }
          for (var suit in suitTracker) {
            if (suitTracker.hasOwnProperty(suit)) {
              if (suitTracker[suit] === 7) {
                fullSuit = true
              }
            }
          }
          if (fullSuit) {
            var handStr = sortedHand.join('')
            if ('234567891011121314'.indexOf(handStr) != -1) {
              return true
            }
          }
          var valueTracker = {

          }
          for (var i = 0; i < sortedHand.length; i++) {
            if (valueTracker.hasOwnProperty(sortedHand[i])) {
              valueTracker[sortedHand[i]] ++
            } else {
              valueTracker[sortedHand[i]] = 1
            }
          }
          console.log(valueTracker);
          for (var value in valueTracker) {
            if (valueTracker.hasOwnProperty(value)) {
              console.log('Step 1');
              if (valueTracker[value] === 4) {
                console.log('Step 2');
                for (var secValue in valueTracker) {
                  if (valueTracker.hasOwnProperty(secValue)) {
                    console.log('Step 3');
                    if (valueTracker[secValue] === 3) {
                      console.log('Step 4');
                      return true
                    }
                  }
                }
              }
            }
          }
        }
        // advancePhase: function (game, opponentHand) {
        //   switch (this.currentPhase) {
        //     case 'Draw':
        //         this.currentPhase = 'Discard'
        //     break;
        //     case 'Discard':
        //         // this.currentPhase = 'Draw'
        //         //
        //         // // TODO check for winner
        //
        //         // if (this.checkWinner(game, localPlayer)) {
        //         //   return this.currentPlayer
        //         // }
        //
        //
        //         switch (this.currentPlayer) {
        //           case 1:
        //               this.currentPlayer = 2
        //           break;
        //           case 2:
        //               this.currentPlayer = 1
        //               this.turnCount ++
        //           break;
        //           default:
        //         }
        //     break;
        //
        //     default:
        //
        //   }
        // }
      }
    }
  }




  this.declareWinner= function (currentGame, localPlayer, localPlayerHand) {
    currentGame.declaredWinner = localPlayer.name;
    currentGame.winningHand = localPlayerHand
  }

  this.advancePhase = function (turn, localPlayer, localPlayerHand) {

    switch (turn.currentPhase) {
      case 'Draw':

          turn.currentPhase = 'Discard'
      break;
      case 'Discard':
          turn.currentPhase = 'Draw'
          //
          // // TODO check for winner
          function sortHand(hand) {
            var sortedHand = [];

            for (var i = 0; i < hand.length; i++) {
              switch (hand[i].value) {
                case 'ACE':
                  sortedHand.push('14')
                break;
                case 'KING':
                  sortedHand.push('13')
                break;
                case 'QUEEN':
                  sortedHand.push('12')
                break;
                case 'JACK':
                  sortedHand.push('11')
                break;
                default:
                  sortedHand.push(hand[i].value)
              }
            }
            sortedHand.sort(function (a, b) {
              return a - b
            })
            return sortedHand
          }
          function checkWinner() {



            // setTimeout(function () {
              // console.log('done');
              // console.log(localPlayerHand);
              // console.log(localPlayerHand[0]);
            // return  localPlayerHand.$loaded().then(function (data) {
                var hand = []
                hand.push(localPlayerHand[0]);
                hand.push(localPlayerHand[1]);
                hand.push(localPlayerHand[2]);
                hand.push(localPlayerHand[3]);
                hand.push(localPlayerHand[4]);
                hand.push(localPlayerHand[5]);
                hand.push(localPlayerHand[6]);

                var sortedHand = sortHand(hand)
                console.log('Checking Hand for Winner');
                var suitTracker = {
                  "HEARTS": 0,
                  "CLUBS": 0,
                  "SPADES": 0,
                  "DIAMONDS": 0
                }
                var fullSuit = false
                for (var i = 0; i < hand.length; i++) {
                  suitTracker[hand[i].suit] ++
                }
                for (var suit in suitTracker) {
                  if (suitTracker.hasOwnProperty(suit)) {
                    if (suitTracker[suit] === 7) {
                      fullSuit = true
                    }
                  }
                }
                if (fullSuit) {
                  var handStr = sortedHand.join('')
                  if ('234567891011121314'.indexOf(handStr) != -1) {
                    return true
                  }
                }
                var valueTracker = {

                }
                for (var i = 0; i < sortedHand.length; i++) {
                  if (valueTracker.hasOwnProperty(sortedHand[i])) {
                    valueTracker[sortedHand[i]] ++
                  } else {
                    valueTracker[sortedHand[i]] = 1
                  }
                }
                console.log(valueTracker);
                for (var value in valueTracker) {
                  if (valueTracker.hasOwnProperty(value)) {
                    console.log('Step 1');
                    if (valueTracker[value] === 4) {

                      for (var secValue in valueTracker) {
                        if (valueTracker.hasOwnProperty(secValue)) {

                          if (valueTracker[secValue] === 3) {
                            console.log('Step 4');
                            return true
                          }
                        }
                      }
                    }
                  }
                }

                console.log(hand);
              // }, 2000);


            // })
          }
            if (checkWinner()) {
              console.log("******* WINNER ********");
              return turn.currentPlayer
            } else {
              console.log('***No such luck***');
            }

            switch (turn.currentPlayer) {
              case 1:

                  turn.currentPlayer = 2
              break;
              case 2:

                  turn.currentPlayer = 1
              break;
              default:
            }
        break;

        default:


    }
  }

  this.checkTurn = function (playerID, action, turn) {
    console.log(playerID);
    console.log(turn);
    if (playerID == turn.currentPlayer) {
      if (action === turn.currentPhase) {
        return true
      } else {
        console.log('Wrong phase');
      }
    } else {
      console.log('Wrong player, ' + playerID);
    }
  },

  this.discardCard = function (localPlayer) {
    this.discardedCards.unshift(localPlayer.selected)
    this.players[localPlayer.playerID - 1].hand.splice(localPlayer.selected.index, 1)
    localPlayer.selected = ''
  },

  this.dealWinningHand = function () {
    return [{
      code: "2H",
      image: 'http://deckofcardsapi.com/static/img/2H.png',
      suit: "HEARTS",
      value: "2"
    },
    {
      code: "2S",
      image: 'http://deckofcardsapi.com/static/img/2S.png',
      suit: "SPADES",
      value: "2"
    },
    {
      code: "5D",
      image: 'http://deckofcardsapi.com/static/img/5D.png',
      suit: "DIAMONDS",
      value: "5"
    },
    {
      code: "2C",
      image: 'http://deckofcardsapi.com/static/img/2C.png',
      suit: "CLUBS",
      value: "2"
    },
    {
      code: "5S",
      image: 'http://deckofcardsapi.com/static/img/5S.png',
      suit: "SPADES",
      value: "5"
    },
    {
      code: "2D",
      image: 'http://deckofcardsapi.com/static/img/2D.png',
      suit: "DIAMONDS",
      value: "2"
    },
    {
      code: "5C",
      image: 'http://deckofcardsapi.com/static/img/5C.png',
      suit: "CLUBS",
      value: "5"
    }]
    // return [{
    //   code: "2H",
    //   image: 'http://deckofcardsapi.com/static/img/2H.png',
    //   suit: "HEARTS",
    //   value: "2"
    // },
    // {
    //   code: "3H",
    //   image: 'http://deckofcardsapi.com/static/img/3H.png',
    //   suit: "HEARTS",
    //   value: "3"
    // },
    // {
    //   code: "4H",
    //   image: 'http://deckofcardsapi.com/static/img/4H.png',
    //   suit: "HEARTS",
    //   value: "4"
    // },
    // {
    //   code: "8H",
    //   image: 'http://deckofcardsapi.com/static/img/8H.png',
    //   suit: "HEARTS",
    //   value: "8"
    // },
    // {
    //   code: "5H",
    //   image: 'http://deckofcardsapi.com/static/img/5H.png',
    //   suit: "HEARTS",
    //   value: "5"
    // },
    // {
    //   code: "6H",
    //   image: 'http://deckofcardsapi.com/static/img/6H.png',
    //   suit: "HEARTS",
    //   value: "6"
    // },
    // {
    //   code: "7H",
    //   image: 'http://deckofcardsapi.com/static/img/7H.png',
    //   suit: "HEARTS",
    //   value: "7"
    // }]
  }
  this.logThis = function (param) {
    console.log("logging param");
    console.log(param);
  }
})
