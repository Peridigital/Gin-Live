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
        started: false,
        discardedCards: [{image: ''}],
        players: {
          1: {
            name: $scope.currentUser.displayName,
            uid: $scope.currentUser.uid,
            ready: false,
          },
          2: {
            name: 'Waiting for player...',
            uid: '',
            ready: false,
          }
        },
        turn: {
          currentPlayer: 1,
          currentPhase: 'Draw'
        }
      });
      var gameDataRef = firebase.database().ref('games/' + $scope.currentGameID)
      var localPlayerRef = firebase.database().ref('games/' + $scope.currentGameID + "/players/1")
      var opponentRef = firebase.database().ref('games/' + $scope.currentGameID + "/players/2")

      var gameSync = $firebaseObject(gameDataRef);
      var localPlayerSync = $firebaseObject(localPlayerRef);
      var opponentSync = $firebaseObject(opponentRef);

      gameSync.$bindTo($scope, "currentGame")
      localPlayerSync.$bindTo($scope, "localPlayer")
      opponentSync.$bindTo($scope, "opponent")


      var localHand = firebase.database().ref('games/' + $scope.currentGameID + "/players/1/hand")
      $scope.localPlayerHand = $firebaseArray(localHand)
      // var opponentHand = firebase.database().ref('games/' + $scope.currentGameID + "/players/2/hand")
      // $scope.opponentHand = $firebaseArray(opponentHand)
      $scope.opponentHand = [1,2,3,4,5,6,7]
      // var discardedCards = firebase.database().ref('games/' + $scope.currentGameID + "/discardedCards")
      // $scope.discardedCards = $firebaseArray(discardedCards)

    })

  }
  $scope.testAdvanceTurn = function () {
    gameService.advancePhase($scope.currentGame.turn)

  }
  $scope.joinGame = function (gameID) {
    $scope.currentGameID = gameID
    console.log($scope.currentGameID);
    var updates = {};
    updates['/games/' + $scope.currentGameID + "/players/2"] = {
      uid: $scope.currentUser.uid,
      name: $scope.currentUser.displayName,
      ready: false,
      hand: []
    }
    updates['/gameList/' + $scope.currentGameID + "/playerCount"] = 2
    firebase.database().ref().update(updates)
    // $scope.currentGame.2 = $scope.currentUser.displayName
    var gameDataRef = firebase.database().ref('games/' + $scope.currentGameID)
    var localPlayerRef = firebase.database().ref('games/' + $scope.currentGameID + "/players/2")
    var opponentRef = firebase.database().ref('games/' + $scope.currentGameID + "/players/1")
    var testRef = firebase.database().ref('games/' + $scope.currentGameID + "/players/1/hand")

    var gameSync = $firebaseObject(gameDataRef);
    var localPlayerSync = $firebaseObject(localPlayerRef);
    var opponentSync = $firebaseObject(opponentRef);
    var testSync = $firebaseObject(testRef)

    gameSync.$bindTo($scope, "currentGame")
    localPlayerSync.$bindTo($scope, "localPlayer")
    opponentSync.$bindTo($scope, "opponent")
    testSync.$bindTo($scope, "testHand")

    var localHand = firebase.database().ref('games/' + $scope.currentGameID + "/players/2/hand")
    $scope.localPlayerHand = $firebaseArray(localHand)
    var opponentHand = firebase.database().ref('games/' + $scope.currentGameID + "/players/1/hand")
    $scope.opponentHand = $firebaseArray(opponentHand)
}
  // create a synchronized array
  // click on `index.html` above to see it used in the DOM!
  $scope.games = $firebaseArray( firebase.database().ref().child("gameList"))
  $scope.test = 2

  $scope.readyUp = function () {
    $scope.localPlayer.ready = true;
    $scope.currentGame.started = true;
    cardService.drawCard($scope.currentGame.deckID).then(function (data) {
      $scope.currentGame.discardedCards.unshift(data.cards)
      console.log('Talon');
    })
  }

  $scope.players = []

  //GETs a deck from the API
  $scope.grabDeck = function() {
    return cardService.getDeck().then(function (data) {
      return data
    })
  }
  //Draws a card into a specific hand but GETting a card from the deckID API
  $scope.drawCard = function () {

    cardService.drawCard($scope.currentGame.deckID).then(function (data) {


      $scope.localPlayerHand.$add(data.cards)

    })
  }
  //Draws a number of cards to every hand
  $scope.deal = function (dealCount) {
    for (var i = 0; i < dealCount; i++) {

        setTimeout(function () {
          $scope.drawCard()

        }, 10);

    }
  }
  $scope.handPull = function () {
    console.log($scope.localPlayerHand);
    var hand = []
    hand.push($scope.localPlayerHand[0])
    hand.push($scope.localPlayerHand[1])
    hand.push($scope.localPlayerHand[2])
    hand.push($scope.localPlayerHand[3])
    hand.push($scope.localPlayerHand[4])
    hand.push($scope.localPlayerHand[5])
    hand.push($scope.localPlayerHand[6])
    console.log(hand);
    return hand
    // $scope.localPlayerHand.$loaded().then(function (data) {
    //   console.log(data);
    //   console.log(data[0]);
    // })
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


    var winCheck = gameService.advancePhase($scope.currentGame.turn, $scope.localPlayer, $scope.localPlayerHand)
    console.log(winCheck);
    if (winCheck) {
      $scope.winner = true
      if (winCheck === $scope.localPlayer.playerID) {

      }
    }
  }
  $scope.drawFromDeck = function () {
    if (gameService.checkTurn($scope.localPlayer.$id, 'Draw', $scope.currentGame.turn)) {
      setTimeout(function () {
        $scope.drawCard()
        $scope.advancePhase($scope.opponentHand)
      }, 100);
      // cardService.drawCard($scope.game.deckId).then(function (data) {
      //   $scope.game.players[$scope.localPlayer.playerID - 1].hand.push(data.cards)
      //   $scope.game.remainingCards = data.remainingCards
      //   $scope.advancePhase()
      //   $scope.aiTurn()
      // })
    }
  }
  $scope.drawFromDiscard = function () {
    if (gameService.checkTurn($scope.localPlayer.$id, 'Draw', $scope.currentGame.turn)) {
      var drawnCard = {}
      setTimeout(function () {
        console.log('attempting to discard');
        drawnCard = $scope.currentGame.discardedCards[0]
        $scope.currentGame.discardedCards.shift()

      }, 50);

      setTimeout(function () {
        console.log($scope.currentGame.discardedCards[0]);
        $scope.localPlayerHand.$add(drawnCard)
      }, 200);



      $scope.advancePhase()

    }
  }
  $scope.declareWinner = function () {
    gameService.declareWinner($scope.currentGame, $scope.localPlayer, $scope.localPlayerHand)
  };

  $scope.dealWinningHand = function () {

    console.log($scope.localPlayerHand);
    $scope.testerHand = []
    $scope.testerHand.push($scope.localPlayerHand[0])
    $scope.testerHand.push($scope.localPlayerHand[1])
    $scope.testerHand.push($scope.localPlayerHand[2])
    $scope.testerHand.push($scope.localPlayerHand[3])
    $scope.testerHand.push($scope.localPlayerHand[4])
    $scope.testerHand.push($scope.localPlayerHand[5])
    $scope.testerHand.push($scope.localPlayerHand[6])
    console.log("I'm the hand in advancePhase");
    console.log($scope.testerHand);
    gameService.logThis($scope.testerHand)


    $scope.localPlayer.hand = '';
    setTimeout(function () {
      var winningHand = gameService.dealWinningHand()
      for (var i = 0; i < winningHand.length; i++) {
        $scope.localPlayerHand.$add(winningHand[i])

      }
      console.log("Relogging tester");
      console.log($scope.localPlayer.tester);
      var index = 0
      console.log($scope.localPlayerHand[index]);


    }, 100);

  }
  $scope.discardCard= function () {
    if (gameService.checkTurn($scope.localPlayer.$id, 'Discard', $scope.currentGame.turn)) {
      if ($scope.localPlayer.selected) {
        $scope.currentGame.discardedCards.unshift($scope.localPlayer.selected)

        setTimeout(function () {

          $scope.localPlayerHand.$remove($scope.localPlayer.selected.index)
          console.log('done');
          $scope.localPlayer.selected = ''
        }, 100);

        $scope.advancePhase($scope.opponentHand)
      } else {
        console.log('No card selected');
      }

    }
  }
  $scope.dumbDiscard= function () {
    $scope.currentGame.discardedCards.unshift($scope.localPlayer.selected)
  }
  $scope.resetGame = function () {



    console.log($scope.currentGame.declaredWinner);
    // $scope.game = '';
    // $scope.players = [];
    // $scope.localPlayer = '';
    // $scope.winner = '';
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
