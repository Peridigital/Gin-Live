angular.module('cardGame')
.directive('handDirective', function() {
  return {
    templateUrl: "Views/hand.html",
    restrict: 'E',
    scope: {
      game: '=',
      localPlayer: '='

    },
    controller: function( $scope ) {
      $scope.selectCard = function (index, localPlayer, game) {
        localPlayer.selected = game.players[localPlayer.playerID - 1].hand[index]
        localPlayer.selected.index = index
      }
    },
    link: function(scope, element, attributes ) {
    }
  }
});
