/**
 * Created by Benoit on 01/11/2017.
 */

Nymerus.factory('msgBus', ['$rootScope', function ($rootScope) {
  let msgBus = {};
  msgBus.emitMsg = function (msg, data) {
    data = data || {};
    $rootScope.$emit(msg, data);
  };

  msgBus.onMsg = function (msg, func, scope) {
    const unbind = $rootScope.$on(msg, func);
    if (scope) {
      scope.$on('$destroy', unbind);
    }
  };

  return msgBus;
},
]);
