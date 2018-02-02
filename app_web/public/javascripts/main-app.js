/**
 * Created by Benoit on 30/04/2016.
 */

// Define the angular module and save it in Nymerus var
let Nymerus = angular.module('Nymerus', [
  'ngRoute',
  'ngMaterial',
  'NymerusController',
]);

// We configure the routing process for the front-end
Nymerus.config(['$routeProvider', '$locationProvider', '$mdThemingProvider',
  function ($routeProvider, $locationProvider, $mdThemingProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', {
        templateUrl: 'app/index',
        controller: 'IndexCtrl',
        title: 'Welcome into Nymerus',
      })
      .when('/user/', {
        templateUrl: 'app/user',
        controller: 'UserCtrl',
        privateAccess: true,
        title: 'Your Nymerus Account',
      })
      .when('/first-connection/', {
        templateUrl: 'app/init',
        controller: 'InitCtrl',
        initPageAccess: true,
        title: 'Account initialization',
      })
      .otherwise({ redirectTo: '/' });

    // ngMaterial theme provider -> Change secondary color to light-blue (pink by default)
    $mdThemingProvider.theme('default').accentPalette('light-blue');
  },
]);

Nymerus.run(function ($templateCache, $location, $rootScope) {
    $templateCache.removeAll();

  /**
   * We are checking if the user is trying to access pages which he doesn't have authorization to.
   *                // controller      : 'C-SCtrl',
   * Cf can help you to improve the code sample and/or resolving future issues
   * CF : http://stackoverflow.com/questions/19697004/angularjs-how-to-redirect-back-to-the-next-route-after-logging-in
   */
  $rootScope.$on('$routeChangeStart', function (event, nextRoute, currentRoute) {
    const privateAccess = nextRoute.privateAccess || false;
    const initPageAccess = nextRoute.initPageAccess || false;

    if (privateAccess && !$rootScope.isAuthenticated()) {
      $location.path('/').replace();
    }
  });


});
