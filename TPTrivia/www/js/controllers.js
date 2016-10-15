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
          $state.go("app.trivia");
        }else {
          $state.go("app.login");
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
  } 
})



.controller('LoginCtrl', function($scope, $ionicModal, $timeout,$state,$ionicHistory) {
  $ionicHistory.nextViewOptions({
      disableBack: true
  });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $state.go("app.trivia");
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

.controller('EstadisticasCtrl', function($scope,$ionicHistory,$timeout) {
$ionicHistory.nextViewOptions({
      disableBack: true
});
 $scope.estadistica;
 firebase.auth().onAuthStateChanged(function(user) {

 $timeout(function() {
 if (user) { 
 
  var ref = new Firebase('https://trivia-86f1c.firebaseio.com');
   
      ref.orderByChild("mail").equalTo(user["email"])
          .on("child_added", function(snapshot) {
                $timeout(function() {
                  console.info(snapshot.val());
                   $scope.estadistica = snapshot.val();
                    console.info($scope.estadistica.pregCorrectas);
                }, 0);
          });
  }
  });
 });
})


.controller('TriviaCtrl', function($scope,$ionicPopup,$interval, $stateParams,$timeout,$ionicPlatform,$state,$ionicHistory,$location,$cordovaFile) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

 firebase.auth().onAuthStateChanged(function(user) {
  $timeout(function() {
  if (user) { 
          
        
  $scope.contador=8;
  $scope.objecto;
  var cantPreg=0;
  var preg=1;
  var respString="";
  var respCorrectas=0;
  var respIncorrectas=0;
  var ref = new Firebase('https://trivia-86f1c.firebaseio.com/preguntas');

  console.info($scope.objecto);
  $ionicPlatform.ready(function() {
    ionic.Platform.fullScreen();
  });

  ref.once("value", function(snapshot) {
  cantPreg = snapshot.numChildren();
  });

  CargoPregunta(preg);

  var stop = $interval(function() {
    if($scope.contador>0){
      $scope.contador -= 1;
    }else{
      $scope.contador=8;
      respIncorrectas+=1;
      preg+=1;
      CargoPregunta(preg);
      if(cantPreg<preg){
        $interval.cancel(stop);
        CargarEstadistica(user["email"],respCorrectas,respIncorrectas);
        CrearStringRespuesta($scope.objecto.preg,"Paso el Tiempo");
        //$state.go("app.fin");
      }
      
    }
        
  }, 1000);

  $scope.respuesta=function(res,valRes){
    if ($scope.objecto.respOk==res)
    {
      respCorrectas +=1;
      CrearStringRespuesta($scope.objecto.preg,valRes);

      if(cantPreg>preg){
         $scope.contador=8;
         preg+=1;
         CargoPregunta(preg); 
      }else{
        CargarEstadistica(user["email"],respCorrectas,respIncorrectas);
        Guardar(CrearJsonRespuesta(respString));
        
        $state.go("app.fin");
      }
     
    }else{
      respIncorrectas+=1;
      CrearStringRespuesta($scope.objecto.preg,valRes);

      if(cantPreg>preg){
         $scope.contador=8;
         preg+=1;
         var alertPopup = $ionicPopup.alert({
          title: 'INCORRECTO',
          template: "La respuesta CORRECTA es: " + $scope.objecto.respOk
         });

         alertPopup.then(function(res) {
           CargoPregunta(preg); 
         });
         $timeout(function() {
             alertPopup.close(); //close the popup after 3 seconds for some reason
             CargoPregunta(preg); 
         }, 3000);
      }else{
        CargarEstadistica(user["email"],respCorrectas,respIncorrectas);
        Guardar(CrearJsonRespuesta(respString));
      
        $state.go("app.fin");
      }     
    }
  }

  function CrearStringRespuesta(preg,resp){

   if (respString==""){
       respString+="Pregunta: " + preg +" Repuesta: " + resp;
    }else{
       respString+="-" + "Pregunta: " + preg + " Repuesta: " + resp;
    }
  }


  function CrearJsonRespuesta(resp){
    var objRespuestas={};
    objRespuestas.usuario=user["email"];
    objRespuestas.respuesta=resp;
    return  JSON.stringify(objRespuestas);
  }

  function CargarEstadistica(user,correctas,incorrectas){
    firebase.database().ref('usuarios/').set({
      mail: user,
      pregCorrectas: correctas,
      pregIncorrectas: incorrectas
    });
  }


  function CargoPregunta(nroPreg){
     ref.orderByChild("idPreg").equalTo("00"+nroPreg)
          .on("child_added", function(snapshot) {
                $timeout(function() {
                  
                   $scope.objecto = snapshot.val();
                }, 0);
          });
  }

  function Guardar(objJsonRespuestas){
     // console.log(UsuarioSecuencia.getSecuenciaString());

     // if($ionicPlatform.isAndroid){
          $cordovaFile.checkDir(cordova.file.externalApplicationStorageDirectory, "files")
          .then(function (success) {

            console.info("SUCCESS CHECK",success);
            $cordovaFile.writeFile(cordova.file.externalApplicationStorageDirectory, "files/repuestas.txt",objJsonRespuestas, true)
              .then(function (success) {

                console.info("SUCCESS WRITE",success);
                $cordovaFile.readAsText(cordova.file.externalApplicationStorageDirectory, "files/repuestas.txt")
                  .then(function (success) {
                      console.info("SUCCESS READ FILE",success);
                     var alertPopup = $ionicPopup.alert({
                       title: 'Objeto JSON Guardado!',
                       template: "Se creo el archivo correctamente"
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
     
            $cordovaFile.createDir(cordova.file.externalApplicationStorageDirectory, "files", false)
            .then(function (success) {

              console.info("SUCCESS CREATE",success);
              $cordovaFile.writeFile(cordova.file.externalApplicationStorageDirectory, "files/repuestas.txt", objJsonRespuestas, true)
              .then(function (success) {

                console.info("SUCCESS WRITE",success);
                $cordovaFile.readAsText(cordova.file.externalApplicationStorageDirectory, "files/repuestas.txt")
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

  }else{
          $state.go("app.login");
        }
      }, 0);
   });

})
.controller('ProgramadorCtrl', function($scope,$ionicHistory,$cordovaInAppBrowser,$ionicPopup) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
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


.controller('ArchivoCtrl', function($scope,$ionicHistory,$cordovaFile, $ionicPopup) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
  $scope.respuestas;
  $cordovaFile.checkDir(cordova.file.externalApplicationStorageDirectory, "files")
    .then(function (success) {
      console.info("SUCCESS CHECK DIR",success);
      $cordovaFile.checkFile(cordova.file.externalApplicationStorageDirectory, "files/repuestas.txt")
        .then(function (success) {
          console.info("SUCCESS CHECK FILE",success);
          $cordovaFile.readAsText(cordova.file.externalApplicationStorageDirectory, "files/repuestas.txt")
            .then(function (success) {
                console.info("SUCCESS READ FILE",success);
                try {
                var repuestaJson = JSON.parse(success);
                var splitArray = repuestaJson.respuesta.split("-");
                $scope.respuestas=splitArray;
                }catch(error){
                  $ionicPopup.alert({
                       title: 'Error de JSON',
                       template: error
                     });
                }
                //for (var i = 0; i < splitArray.length; i++) {
                 // splitArray[i];
                //};
            }, function (error) {
                console.info("ERROR READ FILE",error);
            });
        }, function (error) {
          console.info("ERROR CHECK FILE",error);
        });
    }, function (error) {
      console.info("ERROR CHECK DIR",error);
    });
})


.controller('FinCtrl', function($scope,$ionicHistory) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
});


