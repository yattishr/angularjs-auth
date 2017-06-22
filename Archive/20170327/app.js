'use strict';
var app = angular.module('authApp', []);


angular
  .module('authApp', ['auth0', 'angular-storage', 'angular-jwt', 'ngMaterial', 'ui.router'])
  .config(function($provide, authProvider, $urlRouterProvider, $stateProvider, $httpProvider, jwtInterceptorProvider, jwtOptionsProvider) {

    authProvider.init({
      domain: 'yattishr.auth0.com',
      clientID: 'oGZLamMemWRBX9Kt8FaIOrLuIyZdzMV4'
    });

    $urlRouterProvider.otherwise('/home');    

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'components/home/home.tpl.html'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'components/profile/profile.tpl.html',
        controller: 'profileController as user'
      });

    jwtInterceptorProvider.tokenGetter = function(store) {
      return store.get('id_token');
      console.log('Inside jwtInterceptor. Storing id_token.');
    }      

    // handle expired tokens. redirect the user to the home page to login again.
    // register http interceptor to look for 401 requests.
    function redirect($q, $injector, $timeout, store, $location) {

      var auth;
      $timeout(function() {
        auth = $injector.get('auth');
      });

      return {
        responseError: function(rejection) {
          if(rejection.status === 401) {
            // sign the user out.
            auth.signout();
            // remove the profile and the id_token and then redirect the user to home page.
            store.remove('profile');
            store.remove('id_token');
            $location.path('/home');
          }          
          // return a rejection from the que.
          return $q.reject(rejection);                          
        }
      }
    }

    // factory for our 'redirect' service. 
    $provide.factory('redirect', redirect);

    // Configuring JWT.
    // We assign to tokenGetter a function that returns the token stored. In our
    // case, this function is called authSvc.getToken();
    // We also configure the route to redirect a user when a 401 is produced.
    // We finally add localhost to the list of whiteListedDomains because
    // otherwise our request will be blocked.
    jwtOptionsProvider.config({
      tokenGetter: ['authSvc', function(authSvc) {
        return authSvc.getToken();
      }],
      unauthenticatedRedirectPath: '/',
      whiteListedDomains: ['localhost']
    });

    // let Angular know about our 'redirect' factory.
    $httpProvider.interceptors.push('redirect')
    // let Angular know about our 'jwtInterceptor' factory.
    $httpProvider.interceptors.push('jwtInterceptor');
  })
  .run(function($rootScope, auth, store, jwtHelper, $location) {
    $rootScope.$on('$locationChangeStart', function(){
      // look for token called 'id_token' in our local storage.
      var token = store.get('id_token');
      if(token) {
         // check whether or not the token is expired. 
        if(!jwtHelper.isTokenExpired(token)) {
          // if the token is not expired and the user is NOT authenticated
          if(!auth.isAuthenticated) {   
            // authenticate the user.         
            auth.authenticate(store.get('profile', token));
          }
        }
      } else {
        // redirect the user back to the home page to be authenticated once again.
        $location.path('/home');
      }
    })
  });
