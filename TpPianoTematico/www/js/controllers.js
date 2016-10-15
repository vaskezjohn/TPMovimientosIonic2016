angular.module('starter.controllers', [])


.controller('LoginCtrl', function($scope, $ionicModal,$ionicPopup,$cordovaNativeAudio,$ionicPlatform,$ionicHistory, $timeout,$state, UsuarioSecuencia) {
 firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $state.go("app.banda");
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
    $ionicHistory.nextViewOptions({
      disableBack: true
  });

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
      $state.go("app.trivia");
      //$state.go("app.trivia");
    })     
  }  
})
.controller('AppCtrl', function($scope,$state, $ionicModal,$ionicPopup,$cordovaNativeAudio,$ionicPlatform, $timeout, UsuarioSecuencia) {

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
          $state.go("app.banda");
        }else {
          $state.go("app.login");
        }
      }, 0);
   }); 
  }

$scope.UsuarioSecuencia = UsuarioSecuencia;

$ionicPlatform.registerBackButtonAction(function (event) {
    $cordovaNativeAudio.unload('chewbacca');
    $cordovaNativeAudio.unload('Lightsaber');
    $cordovaNativeAudio.unload('r2d2');
    $cordovaNativeAudio.unload('blaster');
    navigator.app.exitApp(); //<-- remove this line to disable the exit
  }, 100);


  // $scope.doRegister = function(){
  //     firebase.auth().createUserWithEmailAndPassword($scope.registerData.username, $scope.registerData.password)
  //     .then(function(respuesta) {
  //       console.info("Success Register",respuesta);
  //       console.log(firebase.auth().currentUser);
  //       if(!respuesta.emailVerified){
  //         firebase.auth().currentUser.sendEmailVerification().then(function(){
  //              var alertPopup = $ionicPopup.alert({
  //                title: 'Verificacion de Email',
  //                template: 'Se ha enviado un mail para verificar la direccion del usuario'
  //              });

  //              alertPopup.then(function(res) {
  //                console.log('Alert de Verificacion cerrado');
  //              });
  //           },function(error){
  //             console.info("Verification error",error);
  //           });
  //       }
  //     }, function(error) {
  //       console.info("Error Register",error);
  //       var alertPopup = $ionicPopup.alert({
  //          title: 'Register Error',
  //          template: error.message
  //        });
  //     });
  // }
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
   var ref = new Firebase('https://piano-bec4f.firebaseio.com/');


  $scope.UsuarioSecuencia = UsuarioSecuencia;

  firebase.auth().onAuthStateChanged(function(user){
  $timeout(function(){
  if (user) { 

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
                      firebase.database().ref('secuencias/').set({
                        secuencia: JSON.parse(success)
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
                      firebase.database().ref('secuencias/').set({
                        secuencia: JSON.parse(success)
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
 }else{
           $state.go("app.login");
         }
       }, 0);
  });
});
