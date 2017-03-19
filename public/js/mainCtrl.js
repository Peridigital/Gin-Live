angular.module('cardGame').controller('mainCtrl', function($scope, cardService, gameService, firebaseService, $firebaseObject, $firebaseAuth, $firebaseArray) {

  $scope.loginUser = function (name) {
    console.log('logging in');
    firebase.auth().signInAnonymously().then(function () {
      $scope.currentUser = firebase.auth().currentUser;
      console.log($scope.currentUser.displayName);
      $scope.currentUser.updateProfile({
        displayName: name
      }).then(function () {

        $scope.$apply()
      })

    })

  }
  $scope.logoutUser = function () {
    firebase.auth().signOut();

  }
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
  // User is signed in.

  $scope.currentUser = firebase.auth().currentUser;
  $scope.$apply()
  console.log('Logged in');
  // ...
  } else {
  // User is signed out.
  // ...

  $scope.currentUser = ''
  $scope.$apply()
  console.log('Logged out');
  }
  // ...
  });




  var ref = firebase.database().ref().child("data");


  var syncObject = $firebaseObject(ref);
  // synchronize the object with a three-way data binding
  // click on `index.html` above to see it used in the DOM!
  syncObject.$bindTo($scope, "data").then(function () {
    $scope.data.dolphins = {
      dopl: "ye",
      vinl: 'non'
    }
  })
  $scope.addPlayer = function () {
    $scope.data.players.push("Aaron")
  }

  $scope.addGame = function (name) {
    $scope.currentGameID = 'GAME' + $scope.currentUser.uid;
    firebase.database().ref('gameList/' + $scope.currentGameID).set({
      name: name,
      gameID: 'GAME' + $scope.currentUser.uid,
      playerCount: 1
    });
    $scope.grabDeck().then(function (data) {
      firebase.database().ref('games/' + $scope.currentGameID).set({
        deckID: data.deckId,
        name: name,
        gameID: 'GAME' + $scope.currentUser.uid,
        players: {
          p1: {
            name: $scope.currentUser.displayName,
            uid: $scope.currentUser.uid,
            ready: false,
            hand: ['placeholder']
          },
          p2: {
            name: 'Waiting for player...',
            uid: '',
            ready: false,
            hand: ['placeholder']
          }
        },
        turn: {
          currentPlayer: 1,
          currentPhase: 'Draw'
        }
      });
      var gameDataRef = firebase.database().ref('games/' + $scope.currentGameID)
      var localPlayerRef = firebase.database().ref('games/' + $scope.currentGameID + "/players/p1")
      var opponentRef = firebase.database().ref('games/' + $scope.currentGameID + "/players/p2")
      var gameSync = $firebaseObject(gameDataRef);
      var localPlayerSync = $firebaseObject(localPlayerRef);
      var opponentSync = $firebaseObject(opponentRef);

      gameSync.$bindTo($scope, "currentGame")
      localPlayerSync.$bindTo($scope, "localPlayer")
      opponentSync.$bindTo($scope, "opponent")
    })

  }
  $scope.testAdvanceTurn = function () {
    gameService.advancePhase($scope.currentGame.turn)

  }
  $scope.joinGame = function (gameID) {
    $scope.currentGameID = gameID
    console.log($scope.currentGameID);
    var updates = {};
    updates['/games/' + $scope.currentGameID + "/players/p2"] = {
      uid: $scope.currentUser.uid,
      name: $scope.currentUser.displayName,
      ready: false,
      hand: ['placeholder']
    }
    updates['/gameList/' + $scope.currentGameID + "/playerCount"] = 2
    firebase.database().ref().update(updates)
    // $scope.currentGame.p2 = $scope.currentUser.displayName
    var gameDataRef = firebase.database().ref('games/' + $scope.currentGameID)
    var localPlayerRef = firebase.database().ref('games/' + $scope.currentGameID + "/players/p2")
    var opponentRef = firebase.database().ref('games/' + $scope.currentGameID + "/players/p1")
    var gameSync = $firebaseObject(gameDataRef);
    var localPlayerSync = $firebaseObject(localPlayerRef);
    var opponentSync = $firebaseObject(opponentRef);

    gameSync.$bindTo($scope, "currentGame")
    localPlayerSync.$bindTo($scope, "localPlayer")
    opponentSync.$bindTo($scope, "opponent")
}
  // create a synchronized array
  // click on `index.html` above to see it used in the DOM!
  $scope.games = $firebaseArray( firebase.database().ref().child("gameList"))
  $scope.test = 2

  $scope.readyUp = function () {
    $scope.localPlayer.ready = true
  }

  $scope.players = []

  //GETs a deck from the API
  $scope.grabDeck = function() {
    return cardService.getDeck().then(function (data) {
      return data
    })
  }
  //Draws a card into a specific hand but GETting a card from the deckID API
  $scope.drawCard = function (index, deckId) {
    cardService.drawCard(deckId).then(function (data) {
      $scope.game.players[index].hand.push(data.cards)
      $scope.game.remainingCards = data.remainingCards
    })
  }
  //Draws a number of cards to every hand
  $scope.deal = function (dealCount) {
    for (var i = 0; i < dealCount; i++) {
      for (var j = 0; j < 2; j++) {
        $scope.drawCard(j, $scope.game.deckId)
      }
    }
  }
  //Creates a new hand
  $scope.newHand = function () {
    $scope.hands.push(
      {
        name: $scope.playerName,
        cards: []
      }
    );
    $scope.playerName = ''
  }
  $scope.loginPlayer = function (playerName) {
    var playerSlot = $scope.players.length + 1;
    $scope.localPlayer = gameService.makePlayer(playerName, playerSlot);
    $scope.players.push($scope.localPlayer);
  }
;
  $scope.startNewGame = function () {
    $scope.grabDeck().then(function (data) {
      $scope.game = gameService.makeGame($scope.players, data);
      cardService.drawCard($scope.game.deckId).then(function (data) {
        $scope.game.discardedCards.unshift(data.cards)
        $scope.aiTurn()
      })
      $scope.deal(7)

      console.log($scope.game);
    })
    $scope.loginPlayer("Roboto")
    // TODO Remove after testing
    $scope.loginPlayer("Aaron")
  }
  $scope.advancePhase = function () {
    var winCheck = $scope.game.turn.advancePhase($scope.game, $scope.localPlayer)
    if (winCheck) {
      $scope.winner = true
      if (winCheck === $scope.localPlayer.playerID) {

      }
    }
  }
  $scope.drawFromDeck = function () {
    if ($scope.game.checkTurn($scope.localPlayer.playerID, 'Draw')) {

      cardService.drawCard($scope.game.deckId).then(function (data) {
        $scope.game.players[$scope.localPlayer.playerID - 1].hand.push(data.cards)
        $scope.game.remainingCards = data.remainingCards
        $scope.advancePhase()
        $scope.aiTurn()
      })
    }
  }
  $scope.drawFromDiscard = function () {
    if ($scope.game.checkTurn($scope.localPlayer.playerID, 'Draw')) {
      $scope.game.players[$scope.localPlayer.playerID - 1].hand.push($scope.game.discardedCards[0])
      $scope.game.discardedCards.shift()
      $scope.advancePhase()
      $scope.aiTurn()

    }
  }
  $scope.dealWinningHand = function () {
    $scope.game.players[$scope.localPlayer.playerID - 1].hand = [];
    var winningHand = gameService.dealWinningHand()
    for (var i = 0; i < winningHand.length; i++) {
      $scope.game.players[$scope.localPlayer.playerID - 1].hand.push(winningHand[i])

    }
    $scope.advancePhase()
    $scope.advancePhase()
    $scope.aiTurn
  }
  $scope.discardCard= function (localPlayer) {
    if ($scope.game.checkTurn($scope.localPlayer.playerID, 'Discard')) {
      if (localPlayer.selected) {
        $scope.game.discardCard(localPlayer)
        $scope.advancePhase()
        $scope.aiTurn()
      } else {
        console.log('No card selected');
      }

    }
  }
  $scope.resetGame = function () {
    $scope.game = '';
    $scope.players = [];
    $scope.localPlayer = '';
    $scope.winner = '';
  }
  $scope.aiTurn = function () {
    if ($scope.game.turn.currentPlayer === $scope.localPlayer.opponent) {
      $scope.game.players[$scope.localPlayer.opponent - 1].hand.push($scope.game.discardedCards[0])
      $scope.game.discardedCards.shift()
      $scope.advancePhase()
      $scope.game.discardedCards.unshift($scope.game.players[$scope.localPlayer.opponent - 1].hand[0])
      $scope.game.players[$scope.localPlayer.opponent - 1].hand.splice(0, 1)
      $scope.advancePhase()
    }
  }


  //end of the line
})
