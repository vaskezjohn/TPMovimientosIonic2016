angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };


})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];


})

.controller('PlaylistCtrl', function($scope, $stateParams) {


 
  
})


.controller('BrowseCtrl', function($scope, $stateParams,$timeout,$ionicPlatform) {
  $scope.objecto;
  var cantPreg=0;
  var preg=1;
  var ref = new Firebase('https://trivia-86f1c.firebaseio.com/preguntas');

  $ionicPlatform.ready(function() {
    ionic.Platform.fullScreen();
  });

  ref.once("value", function(snapshot) {
  cantPreg = snapshot.numChildren();
  });

  CargoPregunta(preg);

  

  $scope.respuesta=function(res){
    if ($scope.objecto.respOk==res)
    {
      console.log(preg);
      if(cantPreg>preg){
         preg+=1;
         CargoPregunta(preg); 
      }else{
        preg=1;
        console.log(preg);
        CargoPregunta(preg);  
      }
     
    //  console.log(cantPreg + " - " + preg);
       
    }
  }

   function CargoPregunta(nroPreg){
     ref.orderByChild("idPreg").equalTo("00"+nroPreg)
          .on("child_added", function(snapshot) {

              // $scope.$apply(function() {
              //     // console.info(snapshot.val());
              //      $scope.objecto = snapshot.val();
              // });

                $timeout(function() {
                   $scope.objecto = snapshot.val();
                }, 0);



          });
  }




  

});

