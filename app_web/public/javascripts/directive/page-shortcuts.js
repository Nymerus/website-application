/**
 * Created by Benoit on 01/11/2017.
 */

/**
 * Angular Directive : Nymerus Page Shortcuts
 *
 * This directive manage the 'shortcuts' (element) which can be found in the 'left-menu'.
 * This directive is updated by the 'Nymerus Page Manager' and will communicate with the Manager related to the current section (FileManager, ProfileManager, ...)
 */
Nymerus.directive('nymeruspageshortcuts', ['$compile', 'Parser', 'msgBus', 'HTMLProvider',
  function ($compile, Parser, msgBus, HTMLProvider) {
    return {
      restrict: 'E',
      link: function (scope, element, attr) {

        const elem = angular.element(element);
        let shortcuts = {};

        /**
         * Initialization function.
         * Currently do nothing.
         * Triggered when 'NymerusPageShortcuts' is fully defined.
         */
        scope.initShortcuts = function () {
          // Do something
        };

        /**
         * Event listener.
         * Will start communication with the manager related with the current section.
         */
        msgBus.onMsg('updateShortcuts', function (event, data) {
          if (data !== null) {
            shortcuts = data;
            updateShortcuts();
          } else
            shortcuts = {};
        }, scope);

        msgBus.onMsg('reloadUpdatedRepo', function (event, data) {
          scope.itemGetSelected(data);
        }, scope);

        /**
         * Building function.
         * Clean the previous 'shortcuts' and integrate 'shortcuts' related to the current 'section'.
         * Triggered by msgBus.onMsg('setSC[something]', function).
         */
        const updateShortcuts = function () {
          let html; let htmlB; let index; let len; let item; let button;

          html = htmlB = '';
          if (shortcuts.content !== null && shortcuts.content !== undefined
            && shortcuts.content.length > 0) {

            for (index = 0, len = shortcuts.content.length; index < len; ++index) {
              item = shortcuts.content[index];
              button = item.button;

              if (item.display) {
                if (button === true) htmlB += createButtonShortcuts(item, index, shortcuts);
                else html += createSingleItemShortcuts(item, index, shortcuts);
              }
            }
          }

          html += htmlB;

          elem.html('');
          elem.append(html);
          $compile(elem.contents())(scope);
        };

        /**
         * Building function.
         * Return HTML content of a shortcuts button.
         */
        const createButtonShortcuts = function (item, index, shortcuts) {
          let selected; let advanced;

          selected = advanced = false;
          return HTMLProvider.shortcutButtonItem(item.text, index, selected, advanced);
        };

        /**
         * Building function.
         * Return HTML content of a shortcuts single item.
         */
        const createSingleItemShortcuts = function (item, index, shortcuts) {
          let selected; let advanced;

          if (shortcuts.selected === index) selected = true;
          if (item.advanced) advanced = true;

          return HTMLProvider.shortcutSingleItem(item.text, index, selected, advanced);
        };

        /**
         * UI function.
         * Update the element ('singleItem') which is currently selected.
         *
         * @param index
         */
        scope.itemGetSelected = function (index) {
          let lastSelected; let newSelected; let bus;

          if (index >= 0 && shortcuts.selected !== index) {
            lastSelected = elem.find('.item-shortcuts-selected');
            newSelected = elem.find('.item-shortcuts-index-' + index);

            lastSelected.removeClass('item-shortcuts-selected');
            newSelected.addClass('item-shortcuts-selected');

            bus = 'updatedShortcuts.' + shortcuts.id;
            shortcuts.selected = index;
            shortcuts.selected_id = shortcuts.content[index].id;
            msgBus.emitMsg(bus, shortcuts);
          }
        };

        /**
         * UI function.
         * Update the element ('button') which is currently selected.
         *
         * @param index
         */
        scope.buttonGetActioned = function (index) {
          let bus = 'actionedShortcuts.' + shortcuts.id;
          shortcuts.actioned = index;
          shortcuts.actioned_id = shortcuts.content[index].id;
          msgBus.emitMsg(bus, shortcuts);
        };

        /**
         * UI function
         * Update the element as 'advanced' which is currently selected.
         *
         * @param index
         */
        scope.itemParameter = function (index) {
          let bus;

          bus = 'advancedShortcuts.' + shortcuts.id;
          shortcuts.selected = index;

          msgBus.emitMsg(bus, shortcuts);
        };

        scope.initShortcuts();
      },
    };
  },
]);
