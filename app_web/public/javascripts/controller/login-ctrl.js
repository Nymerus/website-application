/**
 * Created by Benoit on 01/11/2017.
 */

NymerusController.controller('LoginCtrl', ['$rootScope', '$route',
  '$scope', '$window', '$location', '$mdToast', 'socket',
  function ($rootScope, $route, $scope, $window, $location, $mdToast, socket) {

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

          if ($scope.connect(msg, true)) {
            function move() {
              setTimeout(() => {
                if ($rootScope.initialized) {
                  $location.path('/user').replace();
                  $scope.connect_toggle();
                  $rootScope.initialized = false;
                } else
                  move();
            },
              25
            )
            }

            move();
          }
        } else if (msg.code === '202') {
          $rootScope.initializingAccount = true;
          $location.path('/first-connection').replace();
          $scope.connect_toggle();
        } else {
          $scope.actionResultToast('Login failed ! Code : ' + msg.code, 'error');
          $scope.errorMessage = {};

          angular.forEach(msg.message, function (message, field) {
            $scope.loginForm[field].$setValidity('server', false);
            $scope.errorMessage[field] = msg.message[field];
          });

          socket.startConnection();
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
          .textContent(string).position('fixed bottom right').hideDelay(3000)
      );
    };

  },
]);
