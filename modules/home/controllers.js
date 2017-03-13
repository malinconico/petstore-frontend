'use strict';

angular.module('Home', ['ngResource'])

.controller('HomeController',
    ['$scope','$resource', '$rootScope',
    function ($scope, $resource, $rootScope) {

      $scope.listStatus = [
        {title: "Available" , text: 'Available' },
        {title: "Pending" , text: 'Pending' },
        {title: "Sold" , text: 'Sold' },
     ];

      var Pets = $resource('http://86.67.125.4:83/pets');
      $scope.listPets = Pets.query();

      if($rootScope.globals.currentUser.username == 'user')
      {
        $("#addButton").hide();
        $("#deleteButton").hide();
      }

      $scope.ButtonShow = function (id = $scope.findId)
      {
        if(typeof id == "undefined")
        {
          console.log(typeof id);
          alert('please fill the pet id');
          return;
        }


        $scope.findId = id;
        $scope.Message = '';

        var Pet = $resource('http://86.67.125.4:83/pets/:petId', {petId:'@id'});

        $scope.pet = Pet.get({petId:$scope.findId},
        function(pet) {
          if(typeof pet.id === "number")
          {
            $scope.petId = pet.id;
            $scope.petName = pet.name;
            $scope.petStatus = pet.status;
            formShow();
          //  $("#listPets").hide();
          }
          else {
            $scope.Message = 'Pet not found with this id ' + $scope.findId;
            $("#formShow").hide();
            $("#listPets").show();
          }
        });
      }

      $scope.ButtonDelete = function ()
      {
        $scope.Message = '';
        var Pet = $resource('http://86.67.125.4:83/pets/:petId', {petId:'@id'});

        $scope.pet = Pet.get({petId:$scope.findId},
        function(pet) {
          if(typeof pet.id === "number")
          {
            pet.$delete();
            $scope.Message = 'Pet deleted ' + $scope.findId + ' !';
            $("#formShow").hide();
          }
          else
          {
            $scope.Message = 'Pet not found with this id ' + $scope.findId;
            $("#formShow").hide();
          }


          $scope.listPets = pet.query();
          $("#listPets").show();

        });
      }

      $scope.ButtonAdd = function () {

         var Pet = $resource('http://86.67.125.4:83/pets');

         if(typeof $scope.name == "undefined")
         {
           alert('please fill the pet name');
           return;
         }

         if(typeof $scope.opt == "undefined")
         {
           alert('please fill the pet status');
           return;
         }

         var pet = new Pet();
         pet.name = $scope.name;
         pet.status = $scope.opt.title;




         pet.$save(function(user, putResponseHeaders) {
           $scope.Message = 'Pet ' + pet.name + ' created with id ' + pet.id;
           $("#formAdd").hide();
           $scope.name   = '';
           $scope.status = '';


           var Pets = $resource('http://86.67.125.4:83/pets');
           $scope.listPets = Pets.query();
           $("#listPets").show();
  });



      }



    }]);
