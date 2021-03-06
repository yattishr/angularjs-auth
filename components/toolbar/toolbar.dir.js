(function() {
  'use strict';

  angular
  .module('authApp')
  .directive('toolbar', toolbar);

  function toolbar() {
    return {
      templateUrl: 'components/toolbar/toolbar.tpl.html',
      controller: toolbarController,
      controllerAs: 'toolbar'
    }
  }

  function toolbarController(auth, store, $location){
    var vm = this;
    vm.login = login;
    vm.logout = logout;
    vm.auth = auth;


    function login() {
      auth.signin({}, function(profile, token) {
        store.set('profile', profile);
        store.set('id_token', token);
        $location.path('/welcome');
        console.log("Logging into application...");
      }, function(error){
        console.log(error);
      });
    }

    function logout() {
      store.remove('profile');
      store.remove('id_token');
      auth.signout();
      $location.path('/home');
      console.log("Logging out of application...");
    }

    function home() {
      $location.path('/home');
      console.log("Redirecting to Home page...");
    }


  }
})();
