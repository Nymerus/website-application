/**
 * Created by Benoit on 01/11/2017.
 */

/**
 * Angular Controller : User Profile (section) Controller
 *
 * This controller will provide all generics data need for the section User Profile, and integrate multiple services for communications between entities and WebApp.
 */
NymerusController.controller('NymerusUserProfileCtrl', ['$scope', '$mdToast', 'socket',
  function ($scope, $mdToast, socket) {

    $scope.email = $scope.user.email || '';

    /**
     * Logic and communication event emitter
     * Gather information into related form and emit thus informations to AppServer
     */
    $scope.update = function () {
      let keys; let index; let len;
      const user = {
        email: $scope.email || 'undefined',
        login: $scope.login || 'undefined',
        newPassword: $scope.newPassword || 'undefined',
        password: $scope.password || 'undefined',
      };

      if (user.password === user.newPassword)
        return $scope.actionResultToast(
          'Current and new password should not be the same.', 'warning');

      keys = Object.keys(user);
      for (index = 0, len = keys.length; index < len; ++index) {
        if (user[keys[index]] !== 'undefined') {
          if (keys[index] === 'newPassword' && user.password !== 'undefined')
            socket.emit('user.updatePassword', {
              password: user.password,
              newPassword: user.newPassword,
            });
        }
      }
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
        $scope.profileForm[field].$setValidity('server', null);
        $scope.profileForm[field].$rollbackViewValue();
      }
    };

    socket.on('user.updatePassword', function (msg) {
      if (msg.code === '200')
        $scope.actionResultToast('Profile update succeed ! Your password has be updated.',
          'success');
      else
        $scope.actionResultToast('Profile update failed ! Code : ' + msg.code, 'error');
    });

    $scope.actionResultToast = function (string, state) {
      $mdToast.show(
        $mdToast.simple().toastClass('md-toast-' + state)
          .textContent(string).position('fixed bottom right').hideDelay(3000)
      );
    };

  },
]);
