/**
 * Created by Benoit on 01/11/2017.
 */

// Factory used as a service which will encapsulate
// io variable in AngularJS's Dependency injection system
Nymerus.factory('socket', ['$rootScope', 'msgBus',
  function ($rootScope, msgBus) {
  let socket;

  function setSocket () {
    socket = io('http://163.5.84.237:3000', { forceNew: true, });
  }

  function destroySocket () {
    socket.emit('disconnect', {});
  }

  function onConnected() {
    if (socket && socket.id)
      return new Promise(res => res(true));
    return new Promise(res => socket.on('connect', res));
  }

  let obj = {
    id: undefined,

    createConnection: async function() {
      setSocket();
      await onConnected();
      msgBus.emitMsg('socket.on.create', null);
    },

    destroyConnection: function() {
      destroySocket();
    },

    updateId: function () {
      this.id = socket.id;
    },

    init: function () {
      socket.removeAllListeners();
    },

    on: function (eventName, callback) {
      socket.on(eventName, function () {
        const args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },

    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        const args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    },

    removeAllListeners: function (eventName, callback) {
      socket.removeAllListeners(eventName, function () {
        const args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },

  };

  obj.createConnection();

  return obj;
},
]);
