
/**
 * Created by Benoit on 05/01/2018.
 */

NymerusController.controller('InitCtrl', ['$scope', '$rootScope', '$location',
  '$window', '$mdToast', 'socket',
  function ($scope, $rootScope, $location, $window, $mdToast, socket) {
    console.log('test');

    $scope.updatePassword = function () {
      let obj = {
        password: $scope.password,
        newPassword: $scope.confirmPassword,
      };

      console.log(obj);

      if ($scope.password !== $scope.confirmPassword)
        socket.emit('user.updatePassword', obj);
      else
        return $scope.actionResultToast('Passwords should not match.', 'warning');

      socket.on('user.updatePassword', function (msg) {
        if (msg.code === '200') {
          $location.path('/').replace();
          $scope.connect_toggle();
        } else {
          $scope.actionResultToast('Login failed ! Code : ' + msg.code, 'error');
          $scope.errorMessage = {};

          // Should parse the errors messages on the page.
          angular.forEach(msg.message, function (message, field) {
              $scope.updateForm[field].$setValidity('server', false);
              $scope.errorMessage[field] = msg.message[field];
            }
          );
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
        $scope.updateForm[field].$setValidity('server', null);
        $scope.updateForm[field].$rollbackViewValue();
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
