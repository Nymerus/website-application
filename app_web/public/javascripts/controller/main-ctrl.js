/**
 * Created by Benoit on 01/11/2017.
 */

const NymerusController = angular.module('NymerusController', []);

// This controller is bind to the body. It can do everything in it.
NymerusController.controller('MainCtrl', ['$scope', '$rootScope', '$location',
  '$window', 'socket', 'msgBus',
  function ($scope, $rootScope, $location, $window, socket, msgBus) {
    $rootScope.initialized = false;

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
        console.log('isAuthenticated', $rootScope.isAuthenticated());
        if (firstSession)
          $window.localStorage.sessionId = socket.id;
        socket.emit('user.getData', {});
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
      } else {
        $window.localStorage.clear();
      }
    };

    /**
     * SocketIO generics call
     */
    // socket.on('connect', function () {
    //   console.log('socket connect received');
    //   $scope.updateSocketId();
    //   $scope.initializing();
    // });

    socket.on('disconnect', function () {
      console.log('socket disconnect received');
      socket.createConnection();
    });

    socket.on('user.connect', function (msg) {
      if (msg.code === '200') {
        console.log("user is connected");
        if ($scope.reconnection)
          setTimeout(() => {
            msgBus.emitMsg('loadingPages', {index: -1, initializing: true, administrator: false,});
            msgBus.emitMsg('updateContactsList', {});
          }, 250);
      } else {
        console.log('user couldn\'t be connected. Error : ' + msg.code);
      }
    });

    socket.on('user.getData', function (data) {
      console.log('user getData received');
      $rootScope.initialized = true;
      delete data.icon;
      $window.localStorage.currentUser = JSON.stringify(data);
      $scope.user = JSON.parse($window.localStorage.currentUser);
      $scope.login = $scope.user.login;
    });

    socket.on('user.disconnect', function (data) {
      console.log('user has been disconnected');
      if ($scope.isAuthenticated())
        $scope.disconnected();
      socket.destroyConnection();
    });

    msgBus.onMsg('socket.on.create', function() {
      $scope.updateSocketId();
      $scope.initializing();
    }, $scope);

  },
]);
