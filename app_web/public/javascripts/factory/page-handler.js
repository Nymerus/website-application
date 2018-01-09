/**
 * Created by Benoit on 01/11/2017.
 */

Nymerus.factory('pageHandler', ['msgBus',
  function (msgBus) {
    let pageHandler = {};

    pageHandler.initializer = function (data, lastPage) {
      if (data.initializing && lastPage === -1)       data.index = 0;
      else if (data.initializing && lastPage >= 0)    data.index = parseInt(lastPage);
      setTimeout(function () { pageHandler.retransmission(data); }, 1);
      setTimeout(function () { pageHandler.stateManager(data); }, 1);
      return data.index;
    };

    pageHandler.retransmission = function (data) {
      // console.log('Factory pH : Event updateContents emitted.');
      msgBus.emitMsg('updateContents', data);

      // console.log('Factory pH : Event updateShortcuts emitted.');
      msgBus.emitMsg('updateShortcuts', data);

      // console.log('Factory pH : Event updateCurrentPage emitted.');
      msgBus.emitMsg('updateCurrentPage', data);
    };

    pageHandler.stateManager = function (data) {
      msgBus.emitMsg('sleepAll', 'now');
      if (data.index === 0) {
        msgBus.emitMsg('awakeUserFile', 'now');
      } else if (data.index === 1) {
        msgBus.emitMsg('awakeContacts', 'now');
      } else if (data.index === 2) {
        msgBus.emitMsg('awakeSharedFile', 'now');
      } else if (data.index === 3) {
        msgBus.emitMsg('awakeUserProfile', 'now');
      } else if (data.administrator && data.index === 4) {
        msgBus.emitMsg('awakeAdministration', 'now');
      }
    };

    return pageHandler;
  },
]);
