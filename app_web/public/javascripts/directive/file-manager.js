/**
 * Created by Benoit on 01/11/2017.
 */

Nymerus.directive('nymerusfilemanager', ['$compile', 'Parser', 'msgBus', 'HTMLProvider',
  function ($compile, Parser, msgBus, HTMLProvider) {
    return {
      restrict: 'E',
      link: function (scope, element, attr) {

        let elem = angular.element(element);

        let id = attr.directiveid || 'Not defined';
        let awake = false;

        let currentFolder;

        /**
         *
         */
        scope.init = function () {
          let folder = scope.getFolder();

          currentFolder = folder;
          scope.branch(folder);
        };

        /**
         *
         * @param elem
         * @param html
         */
        scope.writeDOM = function (elem, html) {
          elem.html('');
          elem.append(html);
          $compile(elem.contents())(scope);
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
        msgBus.onMsg('newFolder', function (event, data) {
          if (awake)
            scope.branch(data);
        }, scope);

        /**
         *
         * @param folder
         */
        scope.branch = function (folder) {
          if (folder === null || folder === undefined)
            scope.noFolder();
          else if (folder.children === null || folder.children === undefined)
            scope.emptyFolder();
          else
            scope.injectFolder(folder);
        };

        /**
         *
         * @param folder
         */
        scope.injectFolder = function (folder) {
          let index; let len; let item;
          let html = '';

          for (index = 0, len = folder.children.length; index < len; ++index) {
            item = folder.getChildren(index);
            if (File.isFolder())
              html += HTMLProvider.folderHTML(item.name);
            else
              html += HTMLProvider.fileHTML(item.name, item.ext);
          }

          scope.writeDOM(elem, html);
        };

        /**
         *
         */
        scope.noFolder = function () {
          let html = HTMLProvider.errorNoFolder();
          scope.writeDOM(elem, html);
        };

        scope.emptyFolder = function () {
          let html = HTMLProvider.errorEmptyFolder();
          scope.writeDOM(elem, html);
        }

        scope.init();
      },
    };
  },
]);
