// Ionic Starter App

angular.module('starter', ['ionic','ngCordova', 'starter.controllers','starter.services','firebase'])

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

  $ionicPlatform.registerBackButtonAction(function (event) {
    navigator.app.exitApp(); //<-- remove this line to disable the exit
  }, 100);
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.autor', {
    url: '/autor',
    views: {
      'menuContent': {
        templateUrl: 'templates/autor.html',
        controller: 'AutorCtrl'
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
   .state('app.login', {
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl'
        }
      }
    })


  .state('app.banda', {
      url: '/banda',
      views: {
        'menuContent': {
          templateUrl: 'templates/banda.html',
          controller: 'PianoCtrl'
        }
      }
    })


  $urlRouterProvider.otherwise('/app/banda');
});
