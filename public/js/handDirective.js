angular.module('cardGame')
.directive('handDirective', function() {
  return {
    templateUrl: "Views/hand.html",
    restrict: 'E',
    scope: {
      currentGame: '=',
      localPlayerHand: '=',
      localPlayer: '=',
      opponentHand: '=',
      testThing: '='

    },
    controller: function( $scope ) {
      $scope.selectCard = function (index, localPlayer, game, localPlayerHand) {

        localPlayer.selected = localPlayerHand[index]
        localPlayer.selected.index = index
        localPlayer.tester = localPlayerHand
        testThing = localPlayerHand[index]
        console.log("Logging tester");
        console.log(localPlayer.tester);
      }
    },
    link: function(scope, element, attributes ) {
    }
  }
});
