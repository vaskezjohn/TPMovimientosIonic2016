angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$state,$ionicHistory) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  $scope.button;
  firebase.auth().onAuthStateChanged(function(user) {  
       $timeout(function(){
        if (!user) { 
         $scope.button=true;
        }else{
          $scope.button=false;
        }
      })
  }); 

  $scope.Login=function(){
    firebase.auth().onAuthStateChanged(function(user) {
      $timeout(function() {
        if (user) { 
          $state.go("tab.accel");
        }else {
          $state.go("tab.login");
        }
      }, 0);
   }); 
  }
})

.controller('UserCtrl', function($scope, $ionicModal, $timeout,$state,$ionicHistory) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

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
        $state.go("tab.login");
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
  } 
})

.controller('LoginCtrl', function($scope, $ionicModal, $timeout,$state) {


  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $state.go("tab.accel");
    }
  });

  $scope.usuario={};
  $scope.usuario.mail="vaskezjohn@gmail.com";
  $scope.usuario.clave="159159";
  $scope.buttonOut=0;
  $scope.habilitarForm=false;
  $scope.habilitarButton=false;
  $scope.habilitarButton2=false;


  $scope.Loguear=function(){
   
    firebase.auth().signInWithEmailAndPassword($scope.usuario.mail,$scope.usuario.clave).catch(function(error){

      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password'){
        console.log(errorMessage);
      }else{
        console.log(errorCode);
      }
       console.log("Error: ", error);
       $scope.habilitarForm=true;
    }).then(function(user){
      console.log("Usuario: ", user);
      if(user){
        if(!user.emailVerified){
        console.log("el mail no esta verificado")
        $scope.habilitarButton=true;
        }
      }
      $state.go("tab.accel");
      //$state.go("app.trivia");
    })     
  }  

})


.controller('AuthorCtrl', function($scope,$cordovaInAppBrowser,$ionicPopup) {

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

.controller('AccelCtrl', function($scope,$timeout,$state,$ionicPlatform,$cordovaDeviceMotion,$cordovaMedia,$cordovaFile,UsuarioMovimiento) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
 firebase.auth().onAuthStateChanged(function(user) {
  $timeout(function() {
  if (user) { 


  // if($ionicPlatform.isAndroid){ 
    $cordovaFile.checkDir(cordova.file.externalApplicationStorageDirectory, "files/"+UsuarioMovimiento.getName())
      .then(function (success) {
        // success
          console.log("YA EXISTE LA CARPETA DEL USUARIO");
      }, function (error) {
        // error
          console.log("No se encuentra la carpeta del usuario. Creando...");
          $cordovaFile.createDir(cordova.file.externalApplicationStorageDirectory, "files/"+UsuarioMovimiento.getName(), true)
            .then(function (success) {
              // success
                console.log("CARPETA CREADA CON EXITO");
            }, function (error) {
              // error
                console.info("ERROR CREANDO CARPETA" , error);
            });
      });

    var parSrc = cordova.file.externalApplicationStorageDirectory+"files/"+UsuarioMovimiento.getName()+"/parSound.wav";
    var babSrc = cordova.file.externalApplicationStorageDirectory+"files/"+UsuarioMovimiento.getName()+"/babSound.wav";
    var barSrc = cordova.file.externalApplicationStorageDirectory+"files/"+UsuarioMovimiento.getName()+"/barSound.wav";
    var derSrc = cordova.file.externalApplicationStorageDirectory+"files/"+UsuarioMovimiento.getName()+"/derSound.wav";
    var izqSrc = cordova.file.externalApplicationStorageDirectory+"files/"+UsuarioMovimiento.getName()+"/izqSound.wav";
  
    var parMedia = $cordovaMedia.newMedia(parSrc);
    var babMedia = $cordovaMedia.newMedia(babSrc);
    var barMedia = $cordovaMedia.newMedia(barSrc);
    var derMedia = $cordovaMedia.newMedia(derSrc);
    var izqMedia = $cordovaMedia.newMedia(izqSrc);

    $scope.options = { 
      frequency: 100, // Measure every 100ms
      deviation : 25  // We'll use deviation to determine the shake event, best values in the range between 25 and 30
    };

    $scope.measurements = {
      x : null,
      y : null,
      z : null,
      timestamp : null
    }

    // Watcher object
    $scope.DeviceState = "";
    $scope.recording = false;
    $scope.watch = null;

    $scope.derClass = "fhm_img";
    $scope.izqClass = "fhm_img";
    $scope.parClass = "fhm_img";
    $scope.barClass = "fhm_img";
    $scope.babClass = "fhm_img";

    $scope.$on('$ionicView.enter', function(e) {
      $scope.startWatching();
    });

    $scope.GrabarSonido = function(id){
      switch(id) {
          case "parado":
              //$timeout(function () {
                if(!$scope.recording){
                  $cordovaFile.checkFile(cordova.file.externalApplicationStorageDirectory,
                   "files/"+UsuarioMovimiento.getName()+"/parSound.wav")
                  .then(function (success) {
                    console.info("SUCCESS CHECK FILE",success);
                    parMedia.release();
                    $cordovaFile.removeFile(cordova.file.externalApplicationStorageDirectory,
                     "files/"+UsuarioMovimiento.getName()+"/parSound.wav")
                      .then(function (success) {
                          console.info("SUCCESS REMOVE FILE",success);
                          parMedia = $cordovaMedia.newMedia(parSrc);
                          $scope.recording = true;
                          $scope.stopWatching();
                          parMedia.startRecord();
                          $timeout(function(){
                              $scope.recording = false;
                              parMedia.stopRecord();
                              $scope.startWatching();
                          },1500);
                      }, function (error) {
                          console.info("ERROR REMOVE FILE",error);
                      });
                  }, function (error) {
                    console.info("ERROR CHECK FILE",error);
                    $scope.recording = true;
                    $scope.stopWatching();
                    parMedia.startRecord();
                    $timeout(function(){
                        parMedia.stopRecord();
                        $scope.recording = false;
                        $scope.startWatching();
                    },1500);
                  });
                }
              //}, 500);
              break;
          case "bocaarriba":
             //$timeout(function () {
                if(!$scope.recording){
                  $cordovaFile.checkFile(cordova.file.externalApplicationStorageDirectory,
                   "files/"+UsuarioMovimiento.getName()+"/barSound.wav")
                  .then(function (success) {
                    console.info("SUCCESS CHECK FILE",success);
                    barMedia.release();
                    $cordovaFile.removeFile(cordova.file.externalApplicationStorageDirectory,
                     "files/"+UsuarioMovimiento.getName()+"/barSound.wav")
                      .then(function (success) {
                          console.info("SUCCESS REMOVE FILE",success);
                          barMedia = $cordovaMedia.newMedia(barSrc);
                          $scope.recording = true;
                          $scope.stopWatching();
                          barMedia.startRecord();
                          $timeout(function(){
                              barMedia.stopRecord();
                              $scope.recording = false;
                              $scope.startWatching();
                          },1500);
                      }, function (error) {
                          console.info("ERROR REMOVE FILE",error);
                      });
                  }, function (error) {
                    console.info("ERROR CHECK FILE",error);
                    $scope.recording = true;
                    $scope.stopWatching();
                    barMedia.startRecord();
                    $timeout(function(){
                        barMedia.stopRecord();
                        $scope.recording = false;
                        $scope.startWatching();
                    },1500);
                  });
                }
              //}, 500);
              break;
          case "bocaabajo":
             // $timeout(function () {
                if(!$scope.recording){
                  $cordovaFile.checkFile(cordova.file.externalApplicationStorageDirectory,
                   "files/"+UsuarioMovimiento.getName()+"/babSound.wav")
                  .then(function (success) {
                    console.info("SUCCESS CHECK FILE",success);
                    babMedia.release();
                    $cordovaFile.removeFile(cordova.file.externalApplicationStorageDirectory,
                     "files/"+UsuarioMovimiento.getName()+"/babSound.wav")
                      .then(function (success) {
                          console.info("SUCCESS REMOVE FILE",success);
                          $scope.recording = true;
                          $scope.stopWatching();
                          babMedia.startRecord();
                          $timeout(function(){
                              babMedia.stopRecord();
                              $scope.recording = false;
                              $scope.startWatching();
                          },1500);
                      }, function (error) {
                          console.info("ERROR REMOVE FILE",error);
                      });
                  }, function (error) {
                    console.info("ERROR CHECK FILE",error);
                    $scope.recording = true;
                    $scope.stopWatching();
                    babMedia.startRecord();
                    $timeout(function(){
                        babMedia.stopRecord();
                        $scope.recording = false;
                        $scope.startWatching();
                    },1500);
                  });
                }
              //}, 500);

              break;
          case "derecha":
              //$timeout(function () {
                if(!$scope.recording){
                  $cordovaFile.checkFile(cordova.file.externalApplicationStorageDirectory,
                   "files/"+UsuarioMovimiento.getName()+"/derSound.wav")
                  .then(function (success) {
                    console.info("SUCCESS CHECK FILE",success);
                    derMedia.release();
                    $cordovaFile.removeFile(cordova.file.externalApplicationStorageDirectory,
                     "files/"+UsuarioMovimiento.getName()+"/derSound.wav")
                      .then(function (success) {
                          console.info("SUCCESS REMOVE FILE",success);
                          derMedia = $cordovaMedia.newMedia(derSrc);
                          $scope.recording = true;
                          $scope.stopWatching();
                          derMedia.startRecord();
                          $timeout(function(){
                              derMedia.stopRecord();
                              $scope.recording = false;
                              $scope.startWatching();
                          },1500);
                      }, function (error) {
                          console.info("ERROR REMOVE FILE",error);
                      });
                  }, function (error) {
                    console.info("ERROR CHECK FILE",error);
                    $scope.recording = true;
                    $scope.stopWatching();
                    derMedia.startRecord();
                    $timeout(function(){
                        derMedia.stopRecord();
                        $scope.recording = false;
                        $scope.startWatching();
                    },1500);
                  });
                }
             // }, 500);
              break;
          case "izquierda":
              //$timeout(function () {
                if(!$scope.recording){
                  $cordovaFile.checkFile(cordova.file.externalApplicationStorageDirectory,
                   "files/"+UsuarioMovimiento.getName()+"/izqSound.wav")
                  .then(function (success) {
                    console.info("SUCCESS CHECK FILE",success);
                    izqMedia.release();
                    $cordovaFile.removeFile(cordova.file.externalApplicationStorageDirectory,
                     "files/"+UsuarioMovimiento.getName()+"/izqSound.wav")
                      .then(function (success) {
                          console.info("SUCCESS REMOVE FILE",success);
                          izqMedia = $cordovaMedia.newMedia(izqSrc);
                          $scope.recording = true;
                          $scope.stopWatching();
                          izqMedia.startRecord();
                          $timeout(function(){
                              izqMedia.stopRecord();
                              $scope.recording = false;
                              $scope.startWatching();
                          },1500);
                      }, function (error) {
                          console.info("ERROR REMOVE FILE",error);
                      });
                  }, function (error) {
                    console.info("ERROR CHECK FILE",error);
                    $scope.recording = true;
                    $scope.stopWatching();
                    izqMedia.startRecord();
                    $timeout(function(){
                        izqMedia.stopRecord();
                        $scope.recording = false;
                        $scope.startWatching();
                    },1500);
                  });

                  
                }
              //}, 500);
              break;
      }
    }

    $scope.startWatching = function() {
        // Device motion configuration
        $scope.watch = $cordovaDeviceMotion.watchAcceleration($scope.options);
     
        // Device motion initilaization
        $scope.watch.then(null, function(error) {
            console.log('Error: ' + error);
        },function(result) {
     
            // Set current data  
            // $scope.measurements.x = result.x;
            // $scope.measurements.y = result.y;
            // $scope.measurements.z = result.z;


            if(result.z > 5){
              //BOCA ARRIBA (DEPENDE DE OTRA INCLINACION)
              $scope.measurements.z = 1;
            }else if(result.z < -5){
              //BOCA ABAJO
              $scope.derClass = "fhm_img";
              $scope.izqClass = "fhm_img";
              $scope.parClass = "fhm_img";
              $scope.barClass = "fhm_img";
              $scope.babClass = "fhm_imgOn";
              if($scope.DeviceState != "BocaAbajo"){
                $cordovaFile.checkFile(cordova.file.externalApplicationStorageDirectory, "files/"+UsuarioMovimiento.getName()+"/babSound.wav")
                  .then(function (success) {
                    console.info("SUCCESS CHECK FILE",success);
                    babMedia.play();
                  }, function (error) {
                    console.info("ERROR CHECK FILE",error);
                  });
              }
              $scope.DeviceState = "BocaAbajo";
              $scope.measurements.z = -1;
            }else{
              //PARADO
              $scope.derClass = "fhm_img";
              $scope.izqClass = "fhm_img";
              $scope.parClass = "fhm_imgOn";
              $scope.barClass = "fhm_img";
              $scope.babClass = "fhm_img";
              if($scope.DeviceState != "Parado"){
                $cordovaFile.checkFile(cordova.file.externalApplicationStorageDirectory, "files/"+UsuarioMovimiento.getName()+"/parSound.wav")
                  .then(function (success) {
                    console.info("SUCCESS CHECK FILE",success);
                    parMedia.play();
                  }, function (error) {
                    console.info("ERROR CHECK FILE",error);
                  });
              }
              $scope.DeviceState = "Parado";
              $scope.measurements.z = 0;
            }

            if(result.x > 4){
              if($scope.measurements.z == 1){
                $scope.derClass = "fhm_img";
                $scope.izqClass = "fhm_imgOn";
                $scope.parClass = "fhm_img";
                $scope.barClass = "fhm_img";
                $scope.babClass = "fhm_img";
                if($scope.DeviceState != "Izquierda"){
                  $cordovaFile.checkFile(cordova.file.externalApplicationStorageDirectory, "files/"+UsuarioMovimiento.getName()+"/izqSound.wav")
                  .then(function (success) {
                    console.info("SUCCESS CHECK FILE",success);
                    izqMedia.play();
                  }, function (error) {
                    console.info("ERROR CHECK FILE",error);
                  });
                  
                }
                $scope.DeviceState = "Izquierda";
              }
              $scope.measurements.x = 1;
            }else if(result.x < -4){
              if($scope.measurements.z == 1){
                $scope.derClass = "fhm_imgOn";
                $scope.izqClass = "fhm_img";
                $scope.parClass = "fhm_img";
                $scope.barClass = "fhm_img";
                $scope.babClass = "fhm_img";
                if($scope.DeviceState != "Derecha"){
                  $cordovaFile.checkFile(cordova.file.externalApplicationStorageDirectory, "files/"+UsuarioMovimiento.getName()+"/derSound.wav")
                  .then(function (success) {
                    console.info("SUCCESS CHECK FILE",success);
                    derMedia.play();
                  }, function (error) {
                    console.info("ERROR CHECK FILE",error);
                  });
                }
                $scope.DeviceState = "Derecha";
              }
              $scope.measurements.x = -1;
            }else{
              if($scope.measurements.z == 1){
                $scope.derClass = "fhm_img";
                $scope.izqClass = "fhm_img";
                $scope.parClass = "fhm_img";
                $scope.barClass = "fhm_imgOn";
                $scope.babClass = "fhm_img";
                if($scope.DeviceState != "BocaArriba"){
                  $cordovaFile.checkFile(cordova.file.externalApplicationStorageDirectory, "files/"+UsuarioMovimiento.getName()+"/barSound.wav")
                  .then(function (success) {
                    console.info("SUCCESS CHECK FILE",success);
                    barMedia.play();
                  }, function (error) {
                    console.info("ERROR CHECK FILE",error);
                  });
                }
                $scope.DeviceState = "BocaArriba";
              }
              $scope.measurements.x = 0;
            }

            if(result.y > 4){
              $scope.measurements.y = 1;
            }else if(result.y < -4){
              $scope.measurements.y = -1;
            }else{
              $scope.measurements.y = 0;
            }

            //PARADO

            $scope.measurements.timestamp = result.timestamp; 
     
        });     
    };  

    $scope.stopWatching = function() {  
        $scope.watch.clearWatch();
    }  

    $scope.$on('$ionicView.beforeLeave', function(){
        $scope.watch.clearWatch(); // Turn off motion detection watcher
    }); 
//}

  }else{
          $state.go("tab.login");
        }
      }, 0);
   });
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
