/**
 * Created by Benoit on 01/11/2017.
 */

NymerusController.controller('LoginCtrl', ['$rootScope', '$route',
  '$scope', '$window', '$location', '$mdToast', 'socket',
  function ($rootScope, $route, $scope, $window, $location, $mdToast, socket) {

    function init () {
      let message = $window.sessionStorage.error || undefined;

      if (message !== null && message !== undefined) {
        $window.sessionStorage.removeItem('error');
        $scope.actionResultToast(message, 'error');
      }
    }

    $scope.emailLogin = function () {
      let user = {
        email: $scope.email,
        password: $scope.password,
        token: false,
        sessionId: $scope.socket_id,
        sessionName: 'undefined',
        sessionType: 'web',
      };

      if ($scope.browser_name !== null && $scope.browser_name !== undefined)
        user.sessionName = $scope.browser_name;
      socket.emit('user.connect', user);

      socket.on('user.connect', function (msg) {
        if (msg.code === '200') {
          $scope.connect_toggle();
        } else if (msg.code === '202') {
          $location.path('/first-connection').replace();
          $scope.connect_toggle();
        } else {
          $window.sessionStorage.setItem('error', 'Login failed ! Code : ' + msg.code);
          $scope.errorMessage = {};

          angular.forEach(msg.message, function (message, field) {
            $scope.loginForm[field].$setValidity('server', false);
            $scope.errorMessage[field] = msg.message[field];
          });

          // console.log($window.sessionStorage.error);
          // $window.location.reload();
        }
      });

    };

    /**
     * UI function
     * Reset invalidity state of form input when updated afterward.
     *
     * @param field
     * @param keyEvent
     */
    $scope.resetInvalidity = function (field, keyEvent) {
      if (keyEvent.which !== 13 && $scope.errorMessage !== null) {
        $scope.loginForm[field].$setValidity('server', null);
        $scope.loginForm[field].$rollbackViewValue();
      }
    };

    $scope.actionResultToast = function (string, state) {
      $mdToast.show(
        $mdToast.simple().toastClass('md-toast-' + state)
          .textContent(string).position('fixed bottom right').hideDelay(5000)
      );
    };

    init();

  },
]);
