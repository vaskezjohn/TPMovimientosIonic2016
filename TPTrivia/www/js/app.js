// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','firebase','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.trivia', {
      url: '/trivia',
      views: {
        'menuContent': {
          templateUrl: 'templates/trivia.html',
          controller: 'TriviaCtrl'
        }
      }
    })
   .state('app.archivo', {
      url: '/archivo',
      views: {
        'menuContent': {
          templateUrl: 'templates/archivo.html',
          controller: 'ArchivoCtrl'
        }
      }
    })
  .state('app.prog', {
      url: '/prog',
      views: {
        'menuContent': {
          templateUrl: 'templates/prog.html',
          controller: 'ProgramadorCtrl'
        }
      }
    })

  .state('app.login', {
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl'
        }
      }
    })
  .state('app.estadisticas', {
      url: '/estadisticas',
      views: {
        'menuContent': {
          templateUrl: 'templates/estadisticas.html',
          controller: 'EstadisticasCtrl'
        }
      }
    })
   .state('app.fin', {
      url: '/fin',
      views: {
        'menuContent': {
          templateUrl: 'templates/finJuego.html',
          controller: 'FinCtrl'
        }
      }
    })
  .state('app.user', {
      url: '/user',
      views: {
        'menuContent': {
          templateUrl: 'templates/user.html',
          controller: 'UserCtrl'
        }
      }
    })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('app/trivia');
});
