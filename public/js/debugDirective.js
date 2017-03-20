angular.module('cardGame')
.directive('debugDirective', function($document, $rootScope) {
  return {
    restrict: 'E',
    scope: {
      debugConsole: '=',
      updateDebug: '&'

    },
    controller: function( $scope ) {

      // $scope.debugUpdate = function (debugConsole) {
      //   debugConsole = 'bbbbb'
      //   console.log(debugConsole);
      //   $scope.$apply()
      // }
    },
    link: function(scope, element, attributes ) {
      $document.bind('keyup', function(e) {
        if (e.which ==192) {
          console.log('going');

          scope.$evalAsync(scope.updateDebug)
        }
        })
        }


  }
});
