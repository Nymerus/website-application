/**
 * Created by Benoit on 01/11/2017.
 */

/**
 * Angular Directive : Nymerus Page Manager
 *
 * This directive allow us to fake the sensation of using multiples pages (called 'section').
 * It's the most important part of the User Page, loaded first, it will initialized everything for all remaining logic.
 * It play mostly the role of configurator and trigger.
 */
Nymerus.directive('nymeruspagemanager', ['$compile', 'Parser', 'msgBus', 'HTMLProvider',
  function ($compile, Parser, msgBus, HTMLProvider) {
    return {
      restrict: 'E',
      link: function (scope, element, attr) {

        const elem = angular.element(element);
        const arrow = elem.find('.arrow-toward-bottom');
        const titlePage = elem.find('.current-page');
        const dropdown = elem.find('.drop-down-menu');
        const pages = ['My Privates Files', 'My Contacts', 'My Shared Files', 'My Profile', 'Administration Panel'];
        let display;
        let manager = {};

        /**
         * Function of initialization.
         * Triggered when 'User page' is loaded and 'Nymeruspagemanager' is fully defined.
         */
        scope.initManager = function () {
          display = false;
          manager.index = -1;
          manager.initializing = true;
          manager.administrator = false;

          msgBus.emitMsg('loadingPages', manager);
        };

        /**
         * Communication event Listener.
         * Update related UI element.
         * Waiting the message back when user change of 'section'.
         */
        msgBus.onMsg('updateCurrentPage', function (event, data) {
          // console.log('Directive PM : Event updateCurrentPage received. Data = ' + data.index);
          if (data.initializing) {
            data.initializing = false;
            buildDropDownMenuContent();
          }

          updateCheckedElement();
          updateMenuTitle();
        }, scope);

        /**
         * User event listener.
         * Trigger the toggle of the dropdown menu
         * Triggered when user click on the 'Title page' (or section name).
         */
        titlePage.bind('click', function () {
          if (!manager.initializing)
            toggleDropDownMenu();
        });

        /**
         * User event listener.
         * Do the same as titlePage.bind() when user click on the 'down' arrow next to the 'Title page'.
         */
        arrow.bind('click', function () {
          if (!manager.initializing)
            toggleDropDownMenu();
        });

        /**
         * Event function.
         * Used to know which element form the dropdown menu has been clicked and triggered the loading of the related 'section'.
         * Called form template (ng-click='selectPage()')
         *
         * @param index
         */
        scope.selectPage = function (index) {
          if (index !== manager.index) {
            manager.index = index;

            // console.log('Directive PM : Event loadingPages emitted.');
            msgBus.emitMsg('loadingPages', manager);
          }
        };

        /**
         * Building function.
         * Used to integrate element into the dropdown menu.
         * Triggered by msgBus.onMsg('updateCurrentPage', function)
         */
        const buildDropDownMenuContent = function () {
          let html = '';
          let index; let len; let checked;

          manager.administrator ? len = pages.length : len = pages.length - 1;

          for (index = 0; index < len; ++index) {
            checked = index === manager.index;

            html += HTMLProvider.dropDownItem(index, pages[index], checked);
          }

          dropdown.html('');
          dropdown.append(html);
          $compile(dropdown.contents())(scope);

        };

        /**
         * UI function.
         * Toggle state of display of the dropdown menu.
         * Called by titlePage.bind() and arrow.bind()
         */
        const toggleDropDownMenu = function () {
          let state;
          display = !display;

          if (display) {
            arrow.removeClass('glyphicon glyphicon-menu-down');
            arrow.addClass('glyphicon glyphicon-menu-up');
            state = 'block';
          } else {
            arrow.removeClass('glyphicon glyphicon-menu-up');
            arrow.addClass('glyphicon glyphicon-menu-down');
            state = 'none';
          }

          dropdown.css('display', state);
        };

        /**
         * UI function.
         * Update the item which is selected (current section).
         * Triggered by msgBus.onMsg('updateCurrentPage', function)
         */
        const updateCheckedElement = function () {
          let lastSelected = dropdown.find('.item-selected');
          let newSelected = dropdown.find('.menu-item-' + manager.index);

          lastSelected.removeClass('item-selected');
          newSelected.addClass('item-selected');
        };

        /**
         * UI function.
         * Update the title which is selected (current section).
         * Triggered by msgBus.onMsg('updateCurrentPage', function)
         */
        const updateMenuTitle = function () {
          titlePage.html(pages[manager.index]);
        };

        scope.initManager();
      },
    };
  },
]);
