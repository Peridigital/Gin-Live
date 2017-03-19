

angular.module('cardGame', ['ui.router', 'firebase'])

  .config( function ($urlRouterProvider, $stateProvider ){

$urlRouterProvider.when('', '/');

  $stateProvider
    .state('welcome', {
      templateUrl: 'Views/welcome.html',

      url: '/',
      resolve: {
        loginCheck: function (gameService, $state) {
          if (gameService.localPlayer) {
            $state.go('game')
          }
        }
      }
    })

    .state('gameSelection', {
      templateUrl: 'Views/gameSelection.html' ,

      url: '/gameSelection',
      resolve: {

      }
    })

    .state('game', {
      templateUrl: 'Views/game.html' ,

      url: '/game',
      resolve: {
        loginCheck: function (gameService, $state) {
          if (!gameService.localPlayer) {
            $state.go('welcome')
          }
        }
      }
    })

})
