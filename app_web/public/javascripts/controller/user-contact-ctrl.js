/**
 * Created by Benoit on 01/11/2017.
 */

/**
 * Angular Controller : User Contact (section) Controller
 *
 * This controller will provide all generics data need for the section Contact, and integrate multiple services for communications between entities and WebApp.
 */
NymerusController.controller('NymerusUserContactCtrl', ['$scope', 'msgBus', 'socket',
  function ($scope, msgBus, socket) {
    $scope.contacts = null;

    $scope.initializing = function () {};

    // msgBus.onMsg('deleteContact', function (event, msg) {
    //     socket.emit('contacts.delete', {sessionId: $scope.socket_id, contactId: msg});
    // }, $scope);
    //
    // msgBus.onMsg('addContact', function (event, msg) {
    //     console.log(msg);
    //     socket.emit('contacts.add', {sessionId: $scope.socket_id, contactId: msg});
    // }, $scope);

    msgBus.onMsg('blacklistContact', function (event, msg) {
      socket.emit('contacts.updateStatus', {
        sessionId: $scope.socket_id,
        contactId: msg, contactStatus: 'blacklist',
      });
    }, $scope);

    // socket.on('contacts.add', function (msg) {
    //     // console.log('contacts.add : <<<' + msg + '>>>');
    //     socket.emit('user.contacts', {sessionId: $scope.socket_id});
    // });
    //
    // socket.on('contacts.delete', function (msg) {
    //     // console.log('contacts.delete : <<<' + msg + '>>>');
    //     socket.emit('user.contacts', {sessionId: $scope.socket_id});
    // });

    socket.on('contacts.updateStatus', function (msg) {
      // console.log('contacts.updateStatus : <<<' + msg + '>>>');
      socket.emit('user.contacts', { sessionId: $scope.socket_id });
    });

    // $scope.initializing();
  },
]);
