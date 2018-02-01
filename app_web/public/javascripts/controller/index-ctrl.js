/**
 * Created by Benoit on 01/11/2017.
 */

NymerusController.controller('IndexCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {

  //// L/SU : login/sign up
  // ng-if which switch the L/SU form from login to signUp state
  $scope.goToSignUp = function () {
    $('.signup-form').delay(205).fadeIn('slow');
    $('.login-form').fadeOut('fast');
  };

  // ng-if which switch the L/SU form from signUp to login state
  $scope.goToLogin = function () {
    $('.login-form').delay(200).fadeIn('slow');
    $('.signup-form').fadeOut('fast');
  };

  // ng-if which allow to show the message for successful SU
  $scope.successfulSignUp = function () {
    $scope.isSignupSuccessful = true;
  };

  // reset var related to signup state
  $scope.clearSignUp = function () {
    $scope.isSignupSuccessful = false;
  };

  // ng-if which toggle the L/SU form
  $scope.connect_toggle = function () {
    $('.overlay').fadeToggle('fast');
    $('.wrapper-form').fadeToggle('slow');
  };
},
]);
