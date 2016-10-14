angular.module('starter.controllers', [])


.controller('AppCtrl', function($scope, $ionicModal,$ionicPopup,$cordovaNativeAudio,$ionicPlatform, $timeout, UsuarioSecuencia) {

  $ionicPlatform.ready(function(){
      
      //if($ionicPlatform.isAndroid){
      //BANDA.

      $cordovaNativeAudio
        .preloadSimple('chewbacca', 'mp3/banda/chewbacca.mp3')
        .then(function (msg) {
          console.log(msg);
        }, function (error) {
          alert(error);
      });
      $cordovaNativeAudio
        .preloadSimple('Lightsaber', 'mp3/banda/Lightsaber.mp3')
        .then(function (msg) {
          console.log(msg);
        }, function (error) {
          alert(error);
      });   
      $cordovaNativeAudio
        .preloadSimple('r2d2', 'mp3/banda/r2d2.mp3')
        .then(function (msg) {
          console.log(msg);
        }, function (error) {
          alert(error);
        });
      $cordovaNativeAudio
        .preloadSimple('blaster', 'mp3/banda/blaster.mp3')
        .then(function (msg) {
          console.log(msg);
        }, function (error) {
          alert(error);
        });
        //}


  });

$scope.UsuarioSecuencia = UsuarioSecuencia;

$ionicPlatform.registerBackButtonAction(function (event) {
    $cordovaNativeAudio.unload('chewbacca');
    $cordovaNativeAudio.unload('Lightsaber');
    $cordovaNativeAudio.unload('r2d2');
    $cordovaNativeAudio.unload('blaster');
    navigator.app.exitApp(); //<-- remove this line to disable the exit
  }, 100);

  // Form data for the login modal
  $scope.loginData = {};
  $scope.registerData = {};
  $scope.isLogged = false;
  $scope.modalState = 'Login';

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope,
    backdropClickToClose: false
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.login();
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modalState = 'Login';
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    firebase.auth().signInWithEmailAndPassword($scope.loginData.username, $scope.loginData.password)
      .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.info("ERROR " + errorCode, errorMessage);
      // ...
    }).then(function(success){
      console.info("SUCCESS",success);
      $timeout(function(){
        if(success){
          if(firebase.auth().currentUser.emailVerified){
            $scope.isLogged = true;
          }else{
            firebase.auth().currentUser.sendEmailVerification().then(function(){
               var alertPopup = $ionicPopup.alert({
                 title: 'Verificacion de Email',
                 template: 'Se ha enviado un mail para verificar la direccion del usuario'
               });

               alertPopup.then(function(res) {
                 console.log('Alert de Verificacion cerrado');
               });
            },function(error){
              console.info("Verification error",error);
            });
            
          }
        }else{
          $scope.isLogged = false;
        }
      },100);
    });

    console.log('Doing login', $scope.loginData);
    UsuarioSecuencia.login($scope.loginData.username);
  };

  $scope.doRegister = function(){
      firebase.auth().createUserWithEmailAndPassword($scope.registerData.username, $scope.registerData.password)
      .then(function(respuesta) {
        console.info("Success Register",respuesta);
        console.log(firebase.auth().currentUser);
        if(!respuesta.emailVerified){
          firebase.auth().currentUser.sendEmailVerification().then(function(){
               var alertPopup = $ionicPopup.alert({
                 title: 'Verificacion de Email',
                 template: 'Se ha enviado un mail para verificar la direccion del usuario'
               });

               alertPopup.then(function(res) {
                 console.log('Alert de Verificacion cerrado');
               });
            },function(error){
              console.info("Verification error",error);
            });
        }
      }, function(error) {
        console.info("Error Register",error);
        var alertPopup = $ionicPopup.alert({
           title: 'Register Error',
           template: error.message
         });
      });
  }

  $scope.resetPassword = function(){
      firebase.auth().sendPasswordResetEmail($scope.loginData.username).then(function(respuesta) {
        // Email sent.
        console.info("Success Reset",respuesta);
      }, function(error) {
        // An error happened.
        console.info("Error Reset",error);
      });
  };

  $scope.goToRegister = function(){
    $timeout(function(){
      $scope.modalState = 'Register';
    },100);
  };

  $scope.goToLogin = function(){
    $timeout(function(){
      $scope.modalState = 'Login';
    },100);
  };

  $scope.doLogout = function(){
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log("LOG OUT SUCCESS");
      $timeout(function(){
          $scope.isLogged = false;
      },100);
    }, function(error) {
      console.info("ERROR LOGOUT",error);
    });
  };
})

.controller('AutorCtrl', function($scope, $stateParams,$cordovaInAppBrowser) {
  var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'no'
    };

  $scope.OpenGitHub=function(){
    $cordovaInAppBrowser.open('https://github.com/vaskezjohn/', '_self', options)
      .then(function(event) {
        // success
      })
      .catch(function(event) {
        // error
      });
  };
})

.controller('UserCtrl', function($scope, $timeout,$state,$ionicHistory) {
  $scope.usuario={};
  $scope.usuario.mail;
  $scope.usuario.mailVerificado;

  firebase.auth().onAuthStateChanged(function(user) {
     $timeout(function() {
      if (user) { 
        console.info(user);
        $scope.usuario.mailVerificado=user["emailVerified"];  
        $scope.usuario.mail=user["email"]; 
      }else{
        $state.go("app.login");
      }
    }, 0);

  });  

  $scope.RestPass=function(){
    console.log("entro");
    firebase.auth().sendPasswordResetEmail($scope.usuario.mail).then(function(respuesta){
      console.info(respuesta);
    }).catch(function(error){
      console.info(error);
    });
  };

  $scope.VerMail=function(){
    firebase.auth().currentUser.sendEmailVerification().catch(function(error){
      console.info(error);
     });   
  };

  $scope.Logout=function(){
  $ionicHistory.nextViewOptions({
      disableBack: true
  });
    firebase.auth().signOut();
  };

})



.controller('PianoCtrl', function($scope, $stateParams,$timeout,$ionicPlatform,$cordovaVibration,$cordovaNativeAudio,$cordovaDevice,$ionicSideMenuDelegate,UsuarioSecuencia,$interval,$ionicPopup,$cordovaFile) {
  $ionicSideMenuDelegate.canDragContent(false);

  $scope.UsuarioSecuencia = UsuarioSecuencia;

  $scope.TocarPiano=function(sonido){
    //alert("/android_asset/www/mp3/banda/"+sonido+".mp3");
    //var src = "";
      UsuarioSecuencia.setSequence(sonido);
    //if($ionicPlatform.isAndroid){
        $cordovaVibration.vibrate(500);
        $cordovaNativeAudio.play(sonido);
      //}
       // ssrc = "/android_asset/www/mp3/banda/"+sonido+".mp3";
       // var media = $cordovaMedia.newMedia(src);
       // media.setVolume(1);
       // media.play();

       // $timeout(function(){
       //   media.release();
       // },1000);

  };

  $scope.BorrarSecuencia=function(idx){
      UsuarioSecuencia.removeSequence(idx);
  };

  $scope.Reproducir=function(cargar){
      var idx = 0;
      UsuarioSecuencia.setPlaying(true);
      if(cargar){
        $cordovaFile.checkDir(cordova.file.externalApplicationStorageDirectory, "files/"+UsuarioSecuencia.getName())
          .then(function (success) {
            console.info("SUCCESS CHECK DIR",success);
            $cordovaFile.checkFile(cordova.file.externalApplicationStorageDirectory, "files/"+UsuarioSecuencia.getName()+"/Secuencia.txt")
              .then(function (success) {
                console.info("SUCCESS CHECK FILE",success);
                $cordovaFile.readAsText(cordova.file.externalApplicationStorageDirectory, "files/"+UsuarioSecuencia.getName()+"/Secuencia.txt")
                  .then(function (success) {
                      console.info("SUCCESS READ FILE",success);
                      var usuarioJson = JSON.parse(success);
                      var splitArray = usuarioJson.secuencia.split("-");
                      for (var i = 0; i < splitArray.length; i++) {
                        UsuarioSecuencia.setSequence(splitArray[i]);
                      };
                  }, function (error) {
                      console.info("ERROR READ FILE",error);
                  });
              }, function (error) {
                console.info("ERROR CHECK FILE",error);
              });
          }, function (error) {
            console.info("ERROR CHECK DIR",error);
          });
      }

      $interval(function(){
        $cordovaNativeAudio.play(UsuarioSecuencia.getSecuencia()[idx]);
        idx++;
        if(idx == 6){
          UsuarioSecuencia.setPlaying(false);
        }
      },1000,6);

  };

  $scope.Grabar=function(){
      console.log(UsuarioSecuencia.getSecuenciaString());
     // if($ionicPlatform.isAndroid){
          $cordovaFile.checkDir(cordova.file.externalApplicationStorageDirectory, "files/"+UsuarioSecuencia.getName())
          .then(function (success) {

            console.info("SUCCESS CHECK",success);
            $cordovaFile.writeFile(cordova.file.externalApplicationStorageDirectory, "files/"+UsuarioSecuencia.getName()+"/Secuencia.txt", UsuarioSecuencia.getSecuenciaString(), true)
              .then(function (success) {

                console.info("SUCCESS WRITE",success);
                $cordovaFile.readAsText(cordova.file.externalApplicationStorageDirectory, "files/"+UsuarioSecuencia.getName()+"/Secuencia.txt")
                  .then(function (success) {
                      console.info("SUCCESS READ FILE",success);
                     var alertPopup = $ionicPopup.alert({
                       title: 'Objeto JSON Guardado!',
                       template: success
                     });
                  }, function (error) {
                      console.info("ERROR READ FILE",error);
                      var alertPopup = $ionicPopup.alert({
                       title: 'Error al Guardar JSON',
                       template: error
                     });
                  });
              }, function (error) {

                console.info("ERROR WRITE",error);
                
              });

          }, function (error) {

            console.info("ERROR CHECK",error);
     
            $cordovaFile.createDir(cordova.file.externalApplicationStorageDirectory, "files/"+UsuarioSecuencia.getName(), false)
            .then(function (success) {

              console.info("SUCCESS CREATE",success);
              $cordovaFile.writeFile(cordova.file.externalApplicationStorageDirectory, "files/"+UsuarioSecuencia.getName()+"/Secuencia.txt", UsuarioSecuencia.getSecuenciaString(), true)
              .then(function (success) {

                console.info("SUCCESS WRITE",success);
                $cordovaFile.readAsText(cordova.file.externalApplicationStorageDirectory, "files/"+UsuarioSecuencia.getName()+"/Secuencia.txt")
                  .then(function (success) {
                      console.info("SUCCESS READ FILE",success);
                   
                     var alertPopup = $ionicPopup.alert({
                       title: 'Objeto JSON Guardado!',
                       template: success
                     });
                  }, function (error) {
                      console.info("ERROR READ FILE",error);                  
                      var alertPopup = $ionicPopup.alert({
                       title: 'Error de JSON',
                       template: error
                     });
                  });
              }, function (error) {

                console.info("ERROR WRITE",error);           

              });

            }, function (error) {

              console.info("ERROR CREATE",error);
            
            });

          });
};
});
