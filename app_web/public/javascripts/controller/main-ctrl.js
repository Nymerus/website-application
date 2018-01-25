/**
 * Created by Benoit on 01/11/2017.
 */

const NymerusController = angular.module('NymerusController', []);

// This controller is bind to the body. It can do everything in it.
NymerusController.controller('MainCtrl', ['$scope', '$rootScope', '$location',
  '$window', '$mdToast', 'socket', 'msgBus',
  function ($scope, $rootScope, $location, $window, $mdToast, socket, msgBus) {

    $scope.socket_id = undefined;
    $scope.user = undefined;
    $scope.login = undefined;

    $scope.isSignupSuccessful = false;
    $scope.reconnection = false;

    $scope.browser_name = 'undefined';
    $scope.socket_id = 'undefined';
    $scope.version = 'undefined';

    $scope.initializing = function () {
      $scope.reconnect();
    };

    $scope.ongoingAuthentication = function () {
      return ($scope.socket_id !== undefined
        && socket.id === $scope.socket_id);
    };

    $rootScope.isAuthenticated = function () {
      return ($window.localStorage.token !== null
        && $window.localStorage.token !== undefined);
    };

    /**
     * Angular - HTML content binding, which trigger background actions
     */
    $scope.connect = function (data, firstSession) {
      if ($scope.ongoingAuthentication()) {
        $window.localStorage.token = data.token;
        if (firstSession)
          $window.localStorage.sessionId = socket.id;
        socket.emit('notification.toAll', { post: "connect", code: "200", });
        return true;
      } return false;
    };

    $scope.updateSocketId = function () {
      socket.updateId();
      $scope.socket_id = socket.id;
      console.log('socket.id = ' + socket.id);
      console.log('client_id = ' + $scope.socket_id);
    };

    $scope.disconnect = function () {
      socket.emit('user.disconnect', {});
    };

    $scope.disconnected = function () {
      $window.localStorage.clear();
      $window.location.reload();
    };

    $scope.reconnect = function () {
      let user;
      let token = $window.localStorage.token || undefined;
      let currentUser = $window.localStorage.currentUser || undefined;
      let sessionId = $window.localStorage.sessionId || undefined;

      if (currentUser !== null && currentUser !== undefined
        && token !== null && token !== undefined) {
        $scope.user = JSON.parse(currentUser);
        $scope.login = $scope.user.login;
        user = {
          email: $scope.user.email,
          password: token,
          token: true,
          sessionId: sessionId,
          sessionName: 'undefined',
          sessionType: 'web',
        };
        socket.emit('user.connect', user);
        $scope.reconnection = true;
      } else
        $window.localStorage.clear();
    };

    $scope.redirectToUser = function () {
      $location.path('/user').replace();
    }
    /**
     * SocketIO generics call
     */
    // socket.on('connect', function () {
    //   console.log('socket connect received');
    //   $scope.updateSocketId();
    //   $scope.initializing();
    // });

    socket.on('disconnect', function () {
      socket.createConnection();
    });

    socket.on('user.connect', function (msg) {
      if (msg.code === '200') {
        console.log('get user.connect');
        if ($scope.reconnection) {
          setTimeout(() => {
            msgBus.emitMsg('loadingPages', {index: -1, initializing: true, administrator: false,});
            msgBus.emitMsg('updateContactsList', {});
          }, 250);
          $scope.reconnection = false;
        } else {
          if ($scope.connect(msg, true))
            socket.emit('user.getData', {});
        }
      } else
        console.log('user couldn\'t be connected. Error : ' + msg.code);
    });

    socket.on('user.getData', function (msg) {
      if (msg.code == '200') {
        console.log('get user.getData');
        delete msg.icon;
        $window.localStorage.currentUser = JSON.stringify(msg);
        $scope.user = JSON.parse($window.localStorage.currentUser);
        $scope.login = $scope.user.login;
        $scope.redirectToUser();
      }
    });

    socket.on('user.disconnect', function (msg) {
      if ($scope.isAuthenticated())
        $scope.disconnected();
      socket.destroyConnection();
    });

    socket.on('notification.toAll', function(msg) {
      if ($scope.isAuthenticated()) {
        if (msg.code === '200') {
          $scope.actionResultToast('A user is connected.', 'success');
        } else if (msg.code === '400') {
          $scope.actionResultToast('A user is now disconnected.', 'success');
        }
      }
    })

    socket.on('notification.toRepo', function(msg) {
      if ($scope.isAuthenticated()) {
        if (msg.code === '200') {
          msgBus.emitMsg('repoIsUpdated', msg);
          $scope.actionResultToast('A repository has been updated.');
        }
      }
    })
    
    msgBus.onMsg('socket.on.create', function() {
      $scope.updateSocketId();
      $scope.initializing();
    }, $scope);

    $scope.actionResultToast = function (string, state) {
      $mdToast.show(
        $mdToast.simple().toastClass('md-toast-' + state)
          .textContent(string).position('fixed bottom right').hideDelay(3000)
      );
    };

  },
]);
