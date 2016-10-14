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


.controller('TriviaCtrl', function($scope,$interval, $stateParams,$timeout,$ionicPlatform,$state,$ionicHistory,$location) {
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
        $state.go("app.fin");
      }
      
    }
        
  }, 1000);

  $scope.respuesta=function(res){
    if ($scope.objecto.respOk==res)
    {
      console.info($scope.objecto);
      respCorrectas +=1;
      console.log(preg);
      if(cantPreg>preg){
         $scope.contador=8;
         preg+=1;
         CargoPregunta(preg); 
      }else{
        CargarEstadistica(user["email"],respCorrectas,respIncorrectas);
        $state.go("app.fin");
      }
     
    }else{
      respIncorrectas+=1;
    }
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

  }else{
          $state.go("app.login");
        }
      }, 0);
   });

})
.controller('ProgramadorCtrl', function($scope,$ionicHistory,$cordovaInAppBrowser) {
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
.controller('FinCtrl', function($scope,$ionicHistory) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
});


