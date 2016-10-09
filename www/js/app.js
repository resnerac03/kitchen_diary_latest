// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var dbKitchen = null;
var obj = null;

var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCordova'])

app.run(function($ionicPlatform,$state,$cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    dbKitchen = window.openDatabase("sqlite","1.0","sqlitedemo",2000);
    // dbKitchen = $cordovaSQLite.openDB({name:"kitchen.db",location:"default"});
    $cordovaSQLite.execute(dbKitchen,"CREATE TABLE IF NOT EXISTS category(id integer primary key, categoryName text)");
    $cordovaSQLite.execute(dbKitchen,"CREATE TABLE IF NOT EXISTS recipe3(id integer primary key,categoryName text,recipeName text, notes text, imagePath text)");
    $cordovaSQLite.execute(dbKitchen,"CREATE TABLE IF NOT EXISTS ingredients2(id integer primary key, recipeID integer, ingredientsName text, household text, weighted text)");
    $cordovaSQLite.execute(dbKitchen,"CREATE TABLE IF NOT EXISTS procedure(id integer primary key, recipeID integer, procedureDetail text)");
    
    
 
  });
})

app.controller("appCtrl",function($scope,$state, $ionicModal,$cordovaSQLite,$ionicPlatform,$cordovaImagePicker, $cordovaSocialSharing,$cordovaFile){
  //====================dbfunctions
  // $scope.$on('$ionicView.loaded', function(event) {
  //   $scope.loadCategory();
  // });
  
  $ionicPlatform.ready(function(){

                // ----SHARE------ //


  // Facebook
  $scope.shareAnySocial = function (recipeName,image) {
    var tempMessage = null;
    $cordovaFile.createFile(cordova.file.externalDataDirectory, recipeName+".txt", true).then(function(result){
      tempMessage = "     "+recipeName +"\n \n Ingredients: \n";
        var tempNotes = null;
        var query = "select * from recipe3 where recipeName = ?";
        $cordovaSQLite.execute(dbKitchen,query,[recipeName]).then(function(result){
          if(result.rows.length){
            var tempID = result.rows.item(0).id;
            tempNotes = result.rows.item(0).notes;
            var queryIngredients = "select * from ingredients2 where recipeID = ?";
            $cordovaSQLite.execute(dbKitchen,queryIngredients,[tempID]).then(function(resultIngredients){
              if(resultIngredients.rows.length){
                for(var i = 0; i<resultIngredients.rows.length;i++){
                  tempMessage = tempMessage +" * "+resultIngredients.rows.item(i).ingredientsName+ " - "+resultIngredients.rows.item(i).household+" - "+resultIngredients.rows.item(i).weighted+" \n";
                }
              }
            });

            var queryProcedure = "select * from procedure where recipeID = ?"
            $cordovaSQLite.execute(dbKitchen,queryProcedure,[tempID]).then(function(resultProcedure){
              if(resultProcedure.rows.length){
                tempMessage = tempMessage + "\n Procedure: \n";
                for(var i = 0; i<resultProcedure.rows.length; i++){
                  tempMessage = tempMessage+ "- "+resultProcedure.rows.item(i).procedureDetail+ " \n";
                }
              }
            })
          }
        })
        window.setTimeout(function(){
          tempMessage = tempMessage + "\n Notes: "+tempNotes;
          $cordovaFile.writeFile(cordova.file.externalDataDirectory, recipeName+".txt", tempMessage, true)
        },900);

    })

    window.setTimeout(function(){
      var tempfilePath = cordova.file.externalDataDirectory+""+recipeName+".txt";
     $cordovaSocialSharing.share(tempMessage, recipeName +"'s recipe",[tempfilePath], null).then(function(result) {
      
    }, function(err) {
      console.log(err);
    });
   },1000);
  }

  // // Twitter
  // $scope.shareTwitter = function (recipeName,image) {
    
  //   var tempMessage = "     "+recipeName +"\n \n Ingredients: \n";
  //   var tempNotes = null;
  //   var query = "select * from recipe3 where recipeName = ?";
  //   $cordovaSQLite.execute(dbKitchen,query,[recipeName]).then(function(result){
  //     if(result.rows.length){
  //       var tempID = result.rows.item(0).id;
  //       tempNotes = result.rows.item(0).notes;
  //       var queryIngredients = "select * from ingredients2 where recipeID = ?";
  //       $cordovaSQLite.execute(dbKitchen,queryIngredients,[tempID]).then(function(resultIngredients){
  //         if(resultIngredients.rows.length){
  //           for(var i = 0; i<resultIngredients.rows.length;i++){
  //             tempMessage = tempMessage +" - "+resultIngredients.rows.item(i).ingredientsName+ " "+resultIngredients.rows.item(i).household+" "+resultIngredients.rows.item(i).weighted+" \n";
  //           }
  //         }
  //       });

  //       var queryProcedure = "select * from procedure where recipeID = ?"
  //       $cordovaSQLite.execute(dbKitchen,queryProcedure,[tempID]).then(function(resultProcedure){
  //         if(resultProcedure.rows.length){
  //           tempMessage = tempMessage + "\n Procedure: \n";
  //           for(var i = 0; i<resultProcedure.rows.length; i++){
  //             tempMessage = tempMessage+ "- "+resultProcedure.rows.item(i).procedureDetail+ " \n";
  //           }
  //         }
  //       })
  //     }
  //   })

  //   window.setTimeout(function(){
  //     tempMessage = tempMessage + "\n Notes: "+tempNotes;
  //    $cordovaSocialSharing.shareViaTwitter(tempMessage, image,null).then(function(result) {
  //     console.log('Share Via Twitter');
  //   }, function(err) {
  //     console.log(err);
  //   });
  //  },1000);
  // }
  // // Instagram
  // document.addEventListener("deviceready", function () { 
  // // your plugin call here 



  // $scope.shareInstagram = function (image,message) {
  //    $cordovaInstagram.share(image, message).then(function(result) {
  //     console.log('Share Via Instagram');
  //   }, function(err) {
  //     console.log(err);
  //   });
  // }
  // });


//======================================== Image Picker =================
    $scope.imagePathtemp = null;
    $scope.addImage = function(){
        var options = {
         maximumImagesCount: 1,
         width: 200,
         height: 200,
         quality: 80
        };

  $cordovaImagePicker.getPictures(options)
    .then(function (results, messsage) {
      for (var i = 0; i < results.length; i++) {
        $scope.imagePathtemp = results[i];
        var message = "Message Added!"
      }
    }, function(error) {
      console.log(error);
    });
    }


  $scope.addCategory = function(category){
    dbKitchen.transaction(function(transaction){
      var query = "INSERT INTO category(categoryName) VALUES(?)";
      $cordovaSQLite.execute(dbKitchen,query,[$("#categoryInputName").val()]);
      $("#categoryInputName").val("");
      $scope.modal.hide();
      $scope.loadCategory();
    })
    
  }
  $scope.categoryData = [];
  $scope.loadCategory = function(){
    $scope.categoryData = [];
     dbKitchen.transaction(function(transaction){
    
    $cordovaSQLite.execute(dbKitchen,"SELECT * from category").then(function(result){

      if(result.rows.length){

        for(var i=0;i<result.rows.length;i++){
          $scope.categoryData.push(result.rows.item(i));

        }
      }else{
        console.log("No data found!");
      }
    },function(error){
      console.log("Error: "+error);
    }
    )
  });
  };

    $scope.loadRecipe = function(){
      dbKitchen.transaction(function(transaction){
        $scope.orderName = null;
    $scope.recipeData = [];
    $cordovaSQLite.execute(dbKitchen,"SELECT * from recipe3").then(function(result){
      if(result.rows.length){

        for(var i=0;i<result.rows.length;i++){
          $scope.recipeData.push(result.rows.item(i));

        }
      }else{
        console.log("No data found!");
      }
    },function(error){
      console.log("Error: "+error);
    }
    )
  });
  }

  var checkRecipe = false;
  $scope.sortbyName = function(){
    if(!checkRecipe){
      $scope.orderName = "recipeName";
      checkRecipe = true;
    }else{
      $scope.orderName = null;
      checkRecipe = false;
    }
    
  }
  var checkifSort = false;
   $scope.sortbyName1 = function(){
    if(!checkifSort){
      $scope.orderName = "categoryName";
      checkifSort = true;
    }else{
      $scope.orderName = null;
      checkifSort = false;
    }
  }

  

    $scope.deleteCategory = function(catID,spliceID){
      dbKitchen.transaction(function(transaction){
        var check = 0;
        var querycategory = "SELECT * from category where id = ?";
        $cordovaSQLite.execute(dbKitchen,querycategory,[catID]).then(function(result){
          for(var i = 0; i<$scope.recipeData.length; i++){
            if($scope.recipeData[i].categoryName == result.rows.item(0).categoryName){
              check++;
            }
          }
        }).then(function(){
          if(check<1){
            var query = "DELETE FROM category WHERE id = ?";
            $cordovaSQLite.execute(dbKitchen,query,[catID]).then(function(success){
              $scope.categoryData.splice(spliceID, 1);
            });
          }else{
            alert("Could not delete, because there's a recipe that is assign to this category.");
          }
        })
      });
    }

    $scope.deleteRecipe = function(recID,spliceID){
      dbKitchen.transaction(function(transaction){
        var query = "DELETE FROM recipe3 WHERE id = ?";
        $cordovaSQLite.execute(dbKitchen,query,[recID]).then(function(success){
          console.log(recID);
          $scope.recipeData.splice(spliceID, 1);
        });
        var queryDeleteIngredients = "DELETE FROM ingredients2 where recipeID = ?";
        $cordovaSQLite.execute(dbKitchen,queryDeleteIngredients,[recID]); 
        var queryDeleteProcedure = "DELETE FROM procedure where recipeID = ?"
        $cordovaSQLite.execute(dbKitchen,queryDeleteProcedure,[recID]);
      });
    }

    $scope.loadCategory();
    $scope.loadRecipe();



    // ============================= UI functions =======================================


  $scope.addRecipe = function(){
    $state.go('tab.addRecipeForm',{redirect: true})
  }
  // Load the modal from the given template URL
  $ionicModal.fromTemplateUrl('templates/modal_category.html', function(modal) {
    $scope.modal = modal;
  }, {
    // Use our scope for the scope of the modal to keep it simple
    scope: $scope,
    // The animation we want to use for the modal entrance
    animation: 'slide-in-up'
  });
  $scope.openModal = function() {
    // alert("in modal");
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  //Be sure to cleanup the modal
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });  
  
  });  

//======================== Add/Remove Field Ingredient
$scope.fields = [{id:'1'}];
$scope.addFields = function(){
  var newItemNo = $scope.fields.length+1;
  $scope.fields.push({'id':newItemNo});
}

$scope.removeFields = function() {
    var lastItem = $scope.fields.length-1;
    $scope.fields.splice(lastItem);
  };

//======================= Add/Remove Field Procedure
$scope.procFields = [{id:'1'}];
$scope.addProcFields = function(){
  var newItemNo =  $scope.procFields.length+1;
  $scope.procFields.push({'id':newItemNo});
}
$scope.removeProcFields = function(){
  var lastItem = $scope.procFields.length-1;
  $scope.procFields.splice(lastItem);
} 

//===================================== Finish Recipe Saved! =============================
$scope.saveRecipe = function(){
  dbKitchen.transaction(function(transaction){
    var currentID = null;
    var query = "INSERT INTO recipe3(categoryName,recipeName,notes,imagePath) VALUES(?,?,?,?)";
    $cordovaSQLite.execute(dbKitchen,query,[$("#rCategoryInput2").val(),$("#rNameInput").val(),$("#notes").val(),$scope.imagePathtemp])
    .then(function(success){
      $cordovaSQLite.execute(dbKitchen,"Select * from recipe3 where recipeName = ?",[$("#rNameInput").val()]).then(function(result){
        if(result.rows.length){
          currentID = result.rows.item(0).id;
          for(var i=0; i<$scope.fields.length; i++){
            if(!$scope.fields[i].name){
              $scope.fields[i].name ="";
            }
            if(!$scope.fields[i].houseHold){
                $scope.fields[i].houseHold = "";
            }
            if(!$scope.fields[i].weighted){
              $scope.fields[i].weighted = "";
            }
            var queryIngredients = "INSERT INTO ingredients2(recipeID,ingredientsName,household,weighted) VALUES(?,?,?,?)";
            $cordovaSQLite.execute(dbKitchen,queryIngredients,[currentID,$scope.fields[i].name,$scope.fields[i].houseHold,$scope.fields[i].weighted])

          }

          for(var i= 0;i<$scope.procFields.length; i++){
             console.log("procedure");
            var queryProcedure = "INSERT INTO procedure(recipeID,procedureDetail) VALUES(?,?)"
            $cordovaSQLite.execute(dbKitchen,queryProcedure,[currentID,$scope.procFields[i].name]);
          }

        }
        else{
          console.log(error);
        }
      })
    })
    .then(function(success){
      $scope.loadRecipe();
      $state.go('tab.chats',{redirect: true}).then(function(){
         window.setTimeout(function(){
            $scope.imagePathtemp = null;
            $scope.procFields = [{id:'1'}];
            $scope.fields = [{id:'1'}];
            // console.log("wew");
         },1000);
      })
    })
    ;
    });
}

//=======================Edit Recipe functions=================


})



.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'ChatsCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:recipeName',
      views: {
        'tab-chats': {
          templateUrl: 'templates/recipeView.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

    .state('tab.chat-detail2', {
      url: '/dash/viewRecipe/:recipeName',
      views: {
        'tab-dash': {
          templateUrl: 'templates/recipeViewCategory.html',
          controller: 'viewRecipeCategoryCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('tab.addRecipeForm',{
    url: '/chats/addRecipeForm',
    views:{
      'tab-chats':{
        templateUrl: 'templates/addRecipeForm.html',
      }
    }
  })

  .state('tab.loadRecipeInCategory',{
    url: '/dash/:categoryName',
    views:{
      'tab-dash':{
        templateUrl: 'templates/loadRecipeInCategory.html',
        controller: 'CategoryRecipeCtrl'
      }
    }
  })

  .state('tab.editRecipe',{
    url: '/chats/:obj',
    views:{
      'tab-chats':{
        templateUrl: 'templates/editRecipe.html',
        controller: 'EditRecipeCtrl'
      }
    }
  })

  .state('tab.editRecipeCategory',{
    url: '/dash/:obj',
    views:{
      'tab-dash':{
        templateUrl: 'templates/editRecipeCategory.html',
        controller: 'editRecipeCategoryCtrl'
      }
    }
  })
  // .state('tab.recipeView',{
  //   url: '/chat/:recipeid',
  //   views:{
  //     'tab-chats':{
  //       templateUrl: 'templates/recipeView.html',
  //       controller: 'RecipeViewCtrl'
  //     }
  //   }
  // })
  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/chats');

});
