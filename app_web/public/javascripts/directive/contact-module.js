/**
 * Created by Benoit on 01/11/2017.
 */

/**
 * Angular Directive : Nymerus Contact Module
 *
 * This directive control every UI interaction between the user and our controller.
 * Will allow use to control the state of display of the drop-down, search, select from all users or related contacts, add or delete contact...
 */
Nymerus.directive('nymeruscontactmodule', ['$compile', 'msgBus', 'HTMLProvider',
  function ($compile, msgBus, HTMLProvider) {
    return {
      restrict: 'E',
      link: function (scope, element, attr) {

        const elem = angular.element(element);
        const arrow = elem.find('.arrow-toward-bottom');
        const icon = elem.find('.contacts-icon');
        const dropdown = elem.find('.drop-down-contact');
        const ul = element.find('.module-contact-contacts-navbar');
        const blockAll = elem.find('.module-contact-all');
        const blockContacts = element.find('.module-contact-contacts');
        const blockContactsContacts = element.find('.module-contact-contacts-contacts');
        const blockContactsBlacklist = element.find('.module-contact-contacts-blacklist');

        let branch = {
          contact: { block: blockContactsContacts, html: '', },
          blacklist: { block: blockContactsBlacklist, html: '', },
          add: { block: null, html: '', },
        };

        let contactsList = {}; // brut
        let contactsSearchList = {}; // processed with search value

        let userSearchRes = {}; // brut
        let userSearchList = {}; // processed with contactsList

        let stateDisplay = false;
        scope.searchAll = false;
        scope.criteria = '';

        /**
         * Initialization function.
         * Triggered when 'Nymerus Contact Module' is completely defined.
         */
        scope.init = function () {
          setTimeout(function () {
            msgBus.emitMsg('updateContactsList', 'now');

            // Waiting ...
          },

            10);
          setTimeout(function () {
            msgBus.emitMsg('updateUsersSearchList', '*');

            // Waiting ...
          }, 60);
        };

        /**
         * Events functions.
         * Triggered when user click on the top-bar element.
         * Trigger toggleDropDown function.
         *
         * Can't use elem because click on drop-down would hide it (dropdown is a children of element).
         */
        arrow.bind('click', function () { toggleDropDown(); }
        );
        icon.bind('click', function () { toggleDropDown(); });

        /**
         * Event function.
         * Triggered when user click on the switch (search).
         */
        scope.searchSwitch = function () {
          if (scope.searchAll) {
            blockAll.css('display', 'block');
            blockContacts.css('display', 'none');
            sendSearchRequest();
          } else {
            blockAll.css('display', 'none');
            blockContacts.css('display', 'block');
          }
        };

        /**
         * Event function.
         * Triggered at each key event on the search bar.
         * Depending of case (search on 'all' or not), we will use different logic.
         *
         * @param keyEvent
         */
        scope.searchKeyDown = function (keyEvent) {
          if (scope.searchAll) sendSearchRequest();
          else runInternalSearch();
        };

        /**
         * Event function.
         * Triggered by click on the search button.
         * Depending of case (search on 'all' or not), we will use different logic.
         */
        scope.runSearch = function () {
          if (scope.searchAll) sendSearchRequest();
          else runInternalSearch();
        };

        /**
         * Event function.
         * When user click on a 'delete contact' button, it will be triggered.
         * Will send a message to the UserPage controller.
         *
         * @param index
         */
        scope.deleteContact = function (index) {
          let keys;

          if (scope.searchAll) {
            keys = Object.keys(userSearchRes);
            msgBus.emitMsg('deleteContact', userSearchRes[keys[index]].login);
          } else {
            keys = Object.keys(contactsList);
            msgBus.emitMsg('deleteContact', contactsList[keys[index]].login);
          }
        };

        /**
         * Event function.
         * When user click on a 'add contact' button, it will be triggered.
         * Will send a message to the UserPage controller.
         *
         * @param index
         */
        scope.addContact = function (index) {
          let keys;

          if (scope.searchAll) {
            keys = Object.keys(userSearchRes);
            msgBus.emitMsg('addContact', userSearchRes[keys[index]].login);
          } else {
            keys = Object.keys(contactsList);
            msgBus.emitMsg('addContact', contactsList[keys[index]].login);
          }
        };

        /**
         * Internal communication event listener.
         * When receiving an 'updated Contacts List', will trigger related UI function.
         */
        msgBus.onMsg('updatedContactsList', function (event, data) {
          if (data !== null) {
            for (let i = 0, len = data.length; i < len; ++i) {
              data[i].contact = true;
            }

            contactsList = data;
            crossingContactsData(contactsList);
            processContactsSearchList();
            crossingListsData(userSearchRes);
            processSearchList();
          }// else {
          // processContactsSearchList();
          // Do something with contact list empty
          //}
        }, scope);

        /**
         * Internal communication event listener.
         * When receiving an 'updated Contacts List', will trigger related UI function.
         */
        msgBus.onMsg('updatedUsersSearchList', function (event, data) {
          if (data !== null) {
            userSearchRes = data;
            crossingListsData(data);
            processSearchList();
          }
        }, scope);

        /**
         * UI function.
         * Toggle state of display of the drop-down
         * Triggered by (icon/arrow).bind('click', function())
         */
        const toggleDropDown = function () {
          let state;
          stateDisplay = !stateDisplay;

          if (stateDisplay) {
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
         * Toggle state of display of section [contacts, blacklist] depending of state of the corresponding tab element (navbar)
         *
         * @param itemClass
         */
        scope.navTo = function (itemClass) {
          const lastSelected = ul.find('.active');
          const newSelected = ul.find('.' + itemClass + '-nav-tab');

          lastSelected.removeClass('active');
          newSelected.addClass('active');

          if (itemClass === 'contacts') {
            blockContactsContacts.css('display', 'block');
            blockContactsBlacklist.css('display', 'none');
          } else {
            blockContactsContacts.css('display', 'none');
            blockContactsBlacklist.css('display', 'block');
          }
        };

        /**
         * DOM manipulation function
         * Process the current 'contacts search list', generate 'contact' element and put it into the relevant block.
         */
        const processContactsSearchList = function () {
          let keys; let index; let len;

          keys = Object.keys(contactsSearchList);
          for (index = 0, len = keys.length; index < len; ++index) {
            const login = keys[index];
            const icon = contactsSearchList[keys[index]].icon;
            const isContact = contactsSearchList[keys[index]].isContact;
            const connected = contactsSearchList[keys[index]].connected;
            const tempInitials = login.match(/\b\w/g) || [];
            const initials = ((tempInitials.shift() || '') +
              (tempInitials.pop() || '')).toUpperCase();
            branch.contact.html += HTMLProvider
              .itemContactList(login, index, icon, isContact, connected, initials);
          }

          keys = Object.keys(branch);
          for (index = 0, len = keys.length; index < len; ++index) {
            if (branch[keys[index]].block !== null) {
              if (branch[keys[index]].html === '') {
                branch[keys[index]].html = HTMLProvider.noItemContactList(keys[index]);
              }

              branch[keys[index]].block.html('');
              branch[keys[index]].block.append(branch[keys[index]].html);
              $compile(branch[keys[index]].block.contents())(scope);
            }

            branch[keys[index]].html = '';
          }
        };

        /**
         * DOM manipulation function.
         * Process the current 'search list', generate 'users' element and put it into the relevant block.
         */
        const processSearchList = function () {
          let html; let keys; let index; let len;

          html = '';
          keys = Object.keys(userSearchList);
          for (index = 0, len = keys.length; index < len; ++index) {
            const login = keys[index];
            const icon = userSearchList[keys[index]].icon;
            const isContact = userSearchList[keys[index]].isContact;
            const connected = userSearchList[keys[index]].connected;

            const tempInitials = login.match(/\b\w/g) || [];
            const initials = ((tempInitials.shift() || '') +
              (tempInitials.pop() || '')).toUpperCase();

            html += HTMLProvider.itemContactList(login, index, icon,
              isContact, connected, initials);
          }

          if (html === '') {html = HTMLProvider.noItemSearchList(); }

          blockAll.html('');
          blockAll.append(html);
          $compile(blockAll.contents())(scope);
        };

        /**
         * Advanced logic function.
         * Processing 'data' and crossing information from 'criteria' to build our 'contact search list'
         *
         * @param data
         */
        const crossingContactsData = function (data) {
          let index; let len;
          let buildingList = {};
          const filter = scope.criteria.toUpperCase();
          const keys = data;

          for (index = 0, len = keys.length; index < len; ++index) {
            if (keys[index].login.toUpperCase().indexOf(filter) > -1) {
              buildingList[keys[index].login] = {
                id: keys[index].id,
                icon: keys[index].icon,
                connected: keys[index].connected,
                isContact: keys[index].contact,
              };
            }
          }

          contactsSearchList = buildingList;
        };

        /**
         * Advanced logic function.
         * Processing 'data' and crossing information from 'contact list' to build our 'search list'
         *
         * @param data
         */
        const crossingListsData = function (data) {
          let keysD; let keysC; let indexD; let indexC; let lenD; let lenC;
          let buildingList = {};

          keysC = contactsList;
          keysD = data;

          for (indexD = 0, lenD = keysD.length; indexD < lenD; ++indexD) {
            buildingList[keysD[indexD].login] = {
              id: keysD[indexD].id,
              connected: keysD[indexD].connected,
              icon: keysD[indexD].icon,
              isContact: keysD[indexD].contact,
            };

            for (indexC = 0, lenC = keysC.length; indexC < lenC; ++indexC) {
              if (keysD[indexD].login === keysC[indexC].login) {
                buildingList[keysD[indexD].login].icon = keysC[indexC].icon;
                buildingList[keysD[indexD].login].connected = keysC[indexC].connected;
                buildingList[keysD[indexD].login].isContact = keysC[indexC].contact;
                break;
              }
            }
          }

          userSearchList = buildingList;
        };

        /**
         * logic functions
         */
        const sendSearchRequest = function () {
          setTimeout(function () {
            let reqBody = '*';
            if (scope.criteria !== '') {
              reqBody = scope.criteria;
            }

            msgBus.emitMsg('updateUsersSearchList', reqBody);
          }, 10);
        };

        const runInternalSearch = function () {
          setTimeout(function () {
            crossingContactsData(contactsList);
            processContactsSearchList();
          }, 10);
        };

        scope.init();
      },
    };
  },
]);
