/**
 * Created by Benoit on 01/11/2017.
 */

/**
 * Angular Controller : Administration (section) Controller
 *
 * This controller will provide all generics data need for the section Administration,
 * and integrate multiple services for communications between entities and WebApp.
 */
NymerusController.controller('NymerusAdministrationCtrl', ['$scope', '$mdToast', 'msgBus', 'socket',
  function ($scope, $mdToast, msgBus, socket) {

    let type = $scope.user_type;

    /**
     * Internal communication event listener.
     * Triggered when page need update of 'user connected list'.
     * Will request corresponding information to AppServer (previously DataServer) through WebApp back-end.
     */
    msgBus.onMsg('updateConnectedUsersList', function (event, msg) {
      if ($scope.socket_id !== null && $scope.socket_id !== undefined && type !== 'basic') {
        socket.emit('admin.connected', {});
        socket.emit('admin.getPasswords', {});
      }
    }, $scope);

    /**
     * Internal communication event listener.
     * Triggered when 'user delete' is actioned.
     * Will request corresponding information to AppServer (previously DataServer) through WebApp back-end.
     */
    msgBus.onMsg('adminDeleteAccount', function (event, msg) {
      if ($scope.socket_id !== null && $scope.socket_id !== undefined && type !== 'basic') {
        socket.emit('user.delete', { login: msg.login });
      }
    }, $scope);

    msgBus.onMsg('adminResetPassword', function (event, msg) {
      if ($scope.socket_id !== null && $scope.socket_id !== undefined && type !== 'basic') {
        socket.emit('admin.resetPassword', { login: msg.login });
      }
    }, $scope);

    /**
     * Internal communication event listener.
     * Triggered when 'user update' is actioned.
     * Will request corresponding information to AppServer (previously DataServer) through WebApp back-end.
     */
    msgBus.onMsg('adminUpdateAccount', function (event, msg) {
      let keys; let index; let len;

      if ($scope.socket_id !== null && $scope.socket_id !== undefined && type !== 'basic') {
        keys = Object.keys(msg.user);
        for (index = 0, len = keys.length; index < len; ++index) {
          if (msg.user[keys[index]] !== undefined) {
            switch (keys[index]) {
              case 'email':
                socket.emit('user.updateEmail', { login: msg.target, data: msg.user.email });
                break;
              case 'login':
                if (msg.target !== msg.user.login)
                  socket.emit('user.updateLogin', { login: msg.target, data: msg.user.login });
                else
                  $scope.actionResultToast('Current and new login should not be the same.',
                    'error');
                break;
              default:
                console.log('default');
                break;
            }
          }
        }
      }
    }, $scope);

    /**
     * Internal communication event listener.
     * Triggered when 'user create' is actioned.
     * Will request corresponding information to AppServer (previously DataServer) through WebApp back-end.
     */
    msgBus.onMsg('adminCreateAccount', function (event, msg) {
      if ($scope.socket_id !== null && $scope.socket_id !== undefined && type !== 'basic') {
        msg.icon = 'undefined';
        socket.emit('user.create', msg);
      }
    }, $scope);

    /**
     * UI function
     * Reset invalidity state of form input when updated afterward.
     *
     * @param field
     * @param keyEvent
     */
    $scope.resetInvalidity = function (field, keyEvent) {
      if (keyEvent.which !== 13 && $scope.errorMessage !== null) {
        $scope.errorMessage[field] = null;
        $scope.adminForm[field].$setValidity('server', null);
        $scope.adminForm[field].$rollbackViewValue();
      }
    };

    /**
     * External communication event listener.
     * Triggered when AppServer (previously called DataServer) respond to request of 'admin.getConnectedUsers'.
     * Will dispatch data to all instances linked.
     */
    socket.on('admin.connected', function (msg) {
      if (msg.code === '200') {
        msgBus.emitMsg('updatedConnectedUsersList', msg);
      } else {
        console.log('admin.getConnectedUsers failed. Error ' + msg.code);
      }
    }, $scope);

    /**
     * External communication event listener.
     * Triggered when AppServer (previously called DataServer) respond to request of 'admin.user.delete'.
     * Will dispatch data to all instances linked.
     */
    socket.on('user.delete', function (msg) {
      if (msg.code === '200') {
        msgBus.emitMsg('adminDeletedAccount', msg);
        $scope.actionResultToast('Deleting user succeed ! User has been deleted.', 'success');
      } else
        $scope.actionResultToast('Deleting user failed ! Code : ' + msg.code, 'error');
    }, $scope);

    /**
     * External communication event listener.
     * Triggered when AppServer (previously called DataServer) respond to request of 'admin.user.update'.
     * Will dispatch data to all instances linked.
     */
    socket.on('user.updateEmail', function (msg) {
      if (msg.code === '200') {
        msgBus.emitMsg('adminUpdatedAccount', msg);
        $scope.actionResultToast('Updating user email succeed ! User email has been updated.',
          'success');
      } else
        $scope.actionResultToast('Updating user email failed ! Code : ' + msg.code, 'error');
    }, $scope);

    /**
     * External communication event listener.
     * Triggered when AppServer (previously called DataServer) respond to request of 'admin.user.update'.
     * Will dispatch data to all instances linked.
     */
    socket.on('user.updateLogin', function (msg) {
      if (msg.code === '200') {
        msgBus.emitMsg('adminUpdatedAccount', msg);
        $scope.actionResultToast('Updating user login succeed ! User login has been updated.',
          'success');
      } else
        $scope.actionResultToast('Updating user login failed ! Code : ' + msg.code, 'error');
    }, $scope);

    /**
     * External communication event listener.
     * Triggered when AppServer (previously called DataServer) respond to request of 'admin.user.create'.
     * Will dispatch data to all instances linked.
     */
    socket.on('user.create', function (msg) {
      if (msg.code === '200') {
        msgBus.emitMsg('adminCreatedAccount', msg);
        $scope.actionResultToast('Creating user succeed ! User has been created.', 'success');
      } else
        $scope.actionResultToast('Creating user failed ! Code : ' + msg.code, 'error');
    }, $scope);


    socket.on('admin.getPasswords', function (msg) {
      if (msg.code === '200') {
        console.log(msg);
      } else
        console.log(msg);
    }, $scope);


    socket.on('admin.resetPassword', function (msg) {
      if (msg.code === '200') {
        msgBus.emitMsg('adminResetedPassword', msg);
      } else
        console.log(msg);
    })

    $scope.actionResultToast = function (string, state) {
      $mdToast.show(
        $mdToast.simple().toastClass('md-toast-' + state)
          .textContent(string).position('fixed bottom right').hideDelay(3000)
      );
    };

  },
]);
