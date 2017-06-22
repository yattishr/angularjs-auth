(function() {

  'use strict';
  angular
  .module('authApp')
  .controller('profileController', profileController);

  function profileController($http, store) {

    var vm = this;
    // vm.message = "Hello World.";

    vm.getMessage = getMessage;
    vm.getSecretMessage = getSecretMessage
    vm.message;

    vm.profile = store.get('profile');

    // get our Public message.
    function getMessage(){
      $http.get('http://localhost:3001/api/users/public', {
        skipAuthorization: true
      }).then(function(response) {
        vm.message = response.data.message;
      });
    }

    // get our Secret message.
    function getSecretMessage(){
      $http.get('http://localhost:3001/api/users/private').then(function(response) {
        vm.message = response.data.message;
      });
    }

  }
})();
