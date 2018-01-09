/**
 * Created by Benoit on 01/11/2017.
 */

// Factory used as a service which will encapsulate
// io variable in AngularJS's Dependency injection system
Nymerus.factory('socket', ['$rootScope',
  function ($rootScope) {
  let obj = {
    id: undefined,
    socket: null,

    startConnection: function () {
      if (obj.socket) {
        obj.socket.destroy();
        delete obj.socket;
        obj.socket = null;
      }

      this.socket = io.connect('http://163.5.84.237:3000');
    },

    updateId: function () {
      this.id = this.socket.id;
    },

    init: function () {
      this.socket.removeAllListeners();
    },

    on: function (eventName, callback) {
      this.socket.on(eventName, function () {
        const args = arguments;
        $rootScope.$apply(function () {
          callback.apply(this.socket, args);
        });
      });
    },

    emit: function (eventName, data, callback) {
      this.socket.emit(eventName, data, function () {
        const args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(this.socket, args);
          }
        });
      });
    },

    removeAllListeners: function (eventName, callback) {
      this.socket.removeAllListeners(eventName, function () {
        const args = arguments;
        $rootScope.$apply(function () {
          callback.apply(this.socket, args);
        });
      });
    },

  };

  obj.startConnection();

  return obj;
},
]);
