/**
 * Created by Benoit on 01/11/2017.
 */

/**
 * Angular Directive : Nymerus Administration Manager
 *
 * This directive allow us to modify the content of the current 'Administration' section.
 * It will display, update, clear block related to the active tab, selected by user click.
 */
Nymerus.directive('nymerusadministrationmanager', ['$compile', 'msgBus', 'HTMLProvider',
  function ($compile, msgBus, HTMLProvider) {
    return {
      restrict: 'E',
      link: function (scope, element, attr) {

        const elem = angular.element(element);
        const content = elem.find('.container-administration-table');
        const form = elem.find('.container-administration-form');
        const panel = elem.find('.admin-on-user-panel');
        const createUserSuccess = elem.find('.create-user-success');

        let userList = {};
        let connectedUserList = {};
        let selectedUser = {};

        let shortcuts = {};

        scope.tPassword = '';
        scope.button_text = 'Create account';

        /**
         * Initialization function.
         * Triggered when 'Nymerus Administration Manager' is completely defined.
         */
        scope.init = function () {
          shortcuts = {
            id: 'A-M',
            selected: 0,
            selected_id: 'userlist',
            actioned: -1,
            actioned_id: '',
            content: [
              {
                text: 'Current user list',
                id: 'userlist',
                display: true,
                advanced: false,
                button: false,
              },
              {
                text: 'Update ' + selectedUser.login,
                id: 'userupdate',
                display: false,
                advanced: false,
                button: false,
              },
              {
                text: 'Create new user',
                id: 'adminsettings',
                display: true,
                advanced: false,
                button: false,
              },
            ],
          };
          selectedUser = {
            state: false,
            login: '',
            email: '',
            icon: '',
            id: '',
          };
        };

        /**
         * Internal communication event listener.
         * When receiving an 'updated Users List', will trigger related UI function.
         */
        msgBus.onMsg('updatedUsersSearchList', function (event, data) {
          if (data !== null) {
            processUserList(data);
          } else
            userList = {};
          msgBus.emitMsg('updateConnectedUsersList', 'now');
        }, scope);

        /**
         * Internal communication event listener.
         * When receiving an 'updated Connected Users List', will trigger related UI function.
         */
        msgBus.onMsg('updatedConnectedUsersList', function (event, data) {
          if (data !== null) {
            connectedUserList = data.connectedUsers;
            crossingUserLists();
            processUserList(null);
          } else
            connectedUserList = {};
        }, scope);

        /**
         * Internal communication event listener.
         * When receiving an 'updated Shortcuts', will trigger related UI function.
         */
        msgBus.onMsg('updatedShortcuts.A-M', function (event, data) {
          if (data !== null) {
            shortcuts = data;
            updateState();
          }
        }, scope);

        /**
         * Internal communication event listener.
         * When receiving an 'deleted account', will trigger related UI function.
         */
        msgBus.onMsg('adminDeletedAccount', function (event, data) {
          msgBus.emitMsg('updateUsersSearchList', '*');

          selectedUser = {
            state: false,
            login: '',
            email: '',
            icon: '',
            id: '',
          };

          shortcuts.selected = 0;
          shortcuts.content[1].display = false;
          shortcuts.content[1].text = selectedUser.login;

          msgBus.emitMsg('updateShortcuts', shortcuts);

          switchBlock(true);
        }, scope);

        /**
         * Internal communication event listener.
         * When receiving an 'updated account', will trigger related UI function.
         */
        msgBus.onMsg('adminUpdatedAccount', function (event, data) {
          msgBus.emitMsg('updateUsersSearchList', '*');
          scope.initLogin = scope.login;
        }, scope);

        /**
         * Internal communication event listener.
         * When receiving an 'created account', will trigger related UI function.
         */
        msgBus.onMsg('adminCreatedAccount', function (event, data) {
          msgBus.emitMsg('updateUsersSearchList', '*');
          scope.tPassword = data.password;
          if (data.password !== null && data.password !== undefined)
            toggleCreateUserSuccess(true);
        }, scope);

        msgBus.onMsg('adminResetedPassword', function(event, data) {
          scope.tPassword = data.password;
          if (data.password !== null && data.password !== undefined)
            toggleCreateUserSuccess(true);
        }, scope);

        /**
         * Internal communication event listener.
         * When receiving an 'awake Administration', will load/reload all sleeping elements.
         */
        msgBus.onMsg('awakeAdministration', function (event, data) {
          setTimeout(function () {
            msgBus.emitMsg('updateShortcuts', shortcuts);
          }, 1);
          setTimeout(function () {
            msgBus.emitMsg('updateUsersSearchList', '*');
          }, 100);
        }, scope);

        /**
         * Branch function
         * Trigger function depending of selected shortcut
         */
        const updateState = function () {
          toggleCreateUserSuccess(false);
          switch (shortcuts.selected) {
            case 0:
              processUserList(null);
              switchBlock(true);
              break;
            case 1:
              selectedUser.state = true;
              scope.button_text = 'Update account';
              switchBlock(false);
              processAdminForm();
              break;
            case 2:
              selectedUser.state = false;
              scope.button_text = 'Create account';
              switchBlock(false);
              processAdminForm();
              break;
            default:
              console.log('case default');
              break;
          }
        };

        /**
         * UI function
         * Toggle display state of content and form
         * default [true] : display 'content'
         *
         * @param state
         */
        const switchBlock = function (state) {
          if (state) {
            content.css('display', 'block');
            form.css('display', 'none');
          } else {
            content.css('display', 'none');
            form.css('display', 'block');
          }
        };

        /**
         * DOM manipulation function
         * Hide current 'content' and display the administrator form using selectedUser if its state != false.
         */
        const processAdminForm = function () {
          if (selectedUser.state) {
            scope.initLogin = selectedUser.login;
            scope.login = selectedUser.login;
            scope.email = selectedUser.email;
            panel.css('display', 'block');
          } else {
            scope.login = '';
            scope.email = '';
            panel.css('display', 'none');
          }

          switchBlock(false);
        };

        const toggleCreateUserSuccess = function (state) {
          if (state) {
            createUserSuccess.css('display', 'block');
          } else {
            createUserSuccess.css('display', 'none');
          }
        };

        /**
         * DOM manipulation function.
         * Process the current 'search list', build a list if necessary, generate 'users' element and put it into a cleared 'content'.
         */
        const processUserList = function (data) {
          let keys; let index; let len;
          let html = '';
          let list = {};
          let buildingList = {};

          if (data !== null && data !== undefined) list = data; else list = userList;

          keys = Object.keys(list);
          for (index = 0, len = keys.length; index < len; ++index) {
            let login; let icon; let state;

            if (data !== null) {
              login = list[index].login; icon = 'undefined'; state = -1;
              buildingList[login] = { login: login, icon: icon, state: state, };
            } else {
              login = list[keys[index]].login;
              icon = list[keys[index]].icon;
              state = list[keys[index]].state;
            }

            const tempInitials = login.match(/\b\w/g) || [];
            const initials = ((tempInitials.shift() || '')
              + (tempInitials.pop() || '')).toUpperCase();

            html += HTMLProvider.itemAdminList(login, index, icon, initials, state);
          }

          if (html === '') html = HTMLProvider.noItemSearchList();
          if (data !== null) userList = buildingList;

          content.html('');
          content.append(html);
          $compile(content.contents())(scope);
        };

        /**
         * Advanced logic function.
         * Crossing information from 'connected user list' to our 'user list'
         * Redefine state value (0 [disconnected] / 1 [connected])
         */
        const crossingUserLists = function () {
          let index; let len; let keys; let login; let id;

          for (index = 0, len = connectedUserList.length; index < len; ++index) {
            login = connectedUserList[index].login;
            id = connectedUserList[index].id;

            if (userList[login] !== undefined) {
              userList[login].state = 1;
            } else
              userList[login] = { id: id, login: login, icon: 'undefined', state: 1, };
          }

          keys = Object.keys(userList);
          for (index = 0, len = keys.length; index < len; ++index)
            if (userList[keys[index]].state < 1)
              userList[keys[index]].state = 0;
        };

        /**
         * Event function
         * When triggered, update currentUser, update shortcuts and redirect to the user administration form.
         *
         * @param index
         * @return {*}
         */
        scope.selectUser = function (index) {
          const keys = Object.keys(userList);
          if (index < 0 || index >= keys.length)
            return console.log('Index cannot be inferior to 0 and superior to keys.length');
          const ptr = userList[keys[index]];
          selectedUser = {
            state: true, login: ptr.login, email: ptr.email, icon: ptr.icon, id: ptr.id, };

          scope.button_text = 'Update account';
          shortcuts.selected = 1;
          shortcuts.content[1].display = true;
          shortcuts.content[1].text = 'Update ' + selectedUser.login;

          msgBus.emitMsg('updateShortcuts', shortcuts);

          processAdminForm();
        };

        /**
         * Event function
         * When triggered, will send information of currentUser to controller (to be send to AppServer).
         */
        scope.deleteAccount = function () {
          msgBus.emitMsg('adminDeleteAccount', selectedUser);
        };

        scope.resetPassword = function () {
          msgBus.emitMsg('adminResetPassword', selectedUser);
        }

        /**
         * Event function
         * When triggered, will send information gathered into form to controller.
         * Depending of shortcuts.selected, will update or create account.
         */
        scope.update = function () {
          const user = {
            email: scope.email || undefined,
            login: scope.login || undefined,
          };

          if (shortcuts.selected === 1)
            msgBus.emitMsg('adminUpdateAccount', { target: scope.initLogin, user: user, });
          else
            msgBus.emitMsg('adminCreateAccount', user);
        };

        scope.init();

      },
    };
  },
]);
