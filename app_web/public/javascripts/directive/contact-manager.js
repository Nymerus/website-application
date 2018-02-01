/**
 * Created by Benoit on 01/11/2017.
 */

/**
 * Angular Directive : Nymerus Contact Manager
 *
 * This directive allow use to modify the content of the current 'My Contact' section.
 * It display, update, clear block related to the active, selected by user click.
 */
Nymerus.directive('nymeruscontactmanager', ['$compile', 'msgBus', 'HTMLProvider',
  function ($compile, msgBus, HTMLProvider) {
    return {
      restrict: 'E',
      link: function (scope, element, attr) {

        const elem = angular.element(element);
        const container = elem.find('.container-contact-table');
        /*
         const select = elem.find('.user-list');
         */

        let list = {};
        let shortcuts = {};

        scope.users = {};
        scope.user = {};

        /**
         * Initialization function.
         * Triggered when 'NymerusContactManager' is defined.
         */
        scope.init = function () {
          shortcuts = {
            id: 'C-M',
            selected: 0,
            selected_id: 'userlist',
            actioned: -1,
            actioned_id: '',
            content: [
              {
                text: 'Current contact list',
                id: 'userlist',
                display: true,
                advanced: false,
                button: false,
              },
              {
                text: 'Create new user',
                id: 'adminsettings',
                display: false,
                advanced: false,
                button: false,
              },
            ],
          };
        };

        /**
         * Internal communication event listener.
         * When receiving an 'updated Contacts List', will trigger related UI function.
         */
        msgBus.onMsg('updatedContactsList', function (event, data) {
          if (data !== null) {
            // console.log('Directive received : \n' + JSON.stringify(data, null, 2));
            list = data;
            tableUpdate();
          } else
            noTable();
        }, scope);

        /**
         * Internal communication event listener.
         * When receiving an 'updated Users List', will trigger related UI function.
         */
        msgBus.onMsg('updatedUsersSearchList', function (event, data) {
          if (data !== null) {
            scope.users = data;
            scope.user = data[Object.keys(data)[0]];
          } else
            scope.users = {};
        }, scope);

        /**
         * Internal communication event listener.
         * When receiving an 'updated Shortcuts', will trigger related UI function.
         */
        msgBus.onMsg('updatedShortcuts.C-M', function (event, data) {
          if (data !== null) {
            shortcuts = data;

            // Do something ...
          }
        }, scope);

        /**
         * Internal communication event listener.
         * When receiving an 'awake Contacts', will load/reload all sleeping elements.
         */
        msgBus.onMsg('awakeContacts', function (event, data) {
          setTimeout(function () {
            msgBus.emitMsg('updateShortcuts', shortcuts);
          }, 1);

        }, scope);

        /**
         * UI function
         * Print all 'contacts' available into the current obj 'list'.
         */
        const tableUpdate = function () {
          let html; let keys; let index; let len;

          html = '';
          keys = list;
          for (index = 0, len = keys.length; index < len; ++index) {
            const login = keys[index].login;
            const icon = keys[index].icon;
            const connected = keys[index].connected;
            const isContact = (keys[index].connected !== null && keys[index].connected !== undefined);

            const tempInitials = login.match(/\b\w/g) || [];
            const initials = ((tempInitials.shift() || '')
              + (tempInitials.pop() || '')).toUpperCase();

            html += HTMLProvider.itemContactList(login, index, icon,
              isContact, connected, initials);
          }

          container.html('');
          container.append(html);
          $compile(container.contents())(scope);
        };

        /**
         * UI function.
         * When nothing is available, print a message.
         */
        const noTable = function () {};

        /**
         * Event function.
         * When user click on a 'contact' item, it will be triggered.
         *
         * @param index
         */
        scope.selectContact = function (index) {
          // Do something ...
        };

        /**
         * Event function.
         * When user click on a 'delete contact' button, it will be triggered.
         * Will send a message to the UserPage controller.
         *
         * @param index
         */
        scope.deleteContact = function (index) {
          const keys = Object.keys(list);
          msgBus.emitMsg('deleteContact', list[keys[index]].login);
        };

        /**
         * Event function. DEBUG
         * When user click on the 'addContact' bind button, it will be triggered.
         * Will send a message to the UserPage controller.
         */
        scope.addContact = function () {
          // Do something ...
          console.log('ADD AS CONTACT : ' + scope.user);
          msgBus.emitMsg('addContact', scope.user);
        };

        /**
         * Event function. DEBUG
         * When user click on a 'blacklist' bind button, it will be triggered.
         * Will send a message to the UserPage controller.
         */
        scope.blacklistContact = function () {
          // Do something ...
          console.log('BLACKLIST : ' + scope.user);
          msgBus.emitMsg('blacklistContact', scope.user);
        };

        scope.init();
      },
    };
  },
]);
