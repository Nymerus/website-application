/**
 * Created by Benoit on 01/11/2017.
 */

/**
 *
 */
Nymerus.directive('nymeruspathmanager', ['$compile', 'msgBus', 'HTMLProvider',
  function ($compile, msgBus, HTMLProvider) {
    return {
      restrict: 'E',
      link: function (scope, element, attr) {

        let elem = angular.element(element);

        let id = attr.directiveid || 'Not defined';
        let awake = false;

        /**
         *
         */
        scope.initPath = function () {
          scope.injectPath(scope.getPath());
        };

        /**
         *
         */
        msgBus.onMsg('awakeUserFile', function (event, data) {
          awake = id === 'user';
        }, scope);

        /**
         *
         */
        msgBus.onMsg('awakeSharedFile', function (event, data) {
          awake = id === 'shared';
        }, scope);

        /**
         *
         */
        msgBus.onMsg('newPath', function (event, data) {
          if (awake)
            scope.injectPath(data);
        }, scope);

        /**
         *
         * @param path
         */
        scope.injectPath = function (path) {
          let index; let len;
          let html = '';

          for (index = 0, len = path.length; index < len; ++index) {
            if (index > 0) {
              html += HTMLProvider.arrowPath();
            }

            html += HTMLProvider.itemPath(path[index], index);
          }

          elem.html('');
          elem.append(html);
          $compile(elem.contents())(scope);
        };

        scope.initPath();
      },
    };
  },
]);
