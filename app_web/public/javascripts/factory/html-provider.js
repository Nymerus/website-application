/**
 * Created by Benoit on 01/11/2017.
 */

Nymerus.factory('HTMLProvider', [
  function () {
    return {
      /** File Manager Html related **/

      itemFMWrapper: function (itemIcon, itemData, classD) {
        let html;
        html =  '<div class=\'item-box ' + classD + '\'>' +
          '<div class=\'item-wrapper\'>' +
          '<div class=\'body-item-wrapper\'>' +
          itemIcon +
          '</div>' +
          '<div class=\'info-item-wrapper\'>' +
          itemData +
          '</div>' +
          '</div>' +
          '</div>';
        return html;
      },

      folderHTML: function (data) {
        let body;
        body = '<span class=\'glyphicon glyphicon-folder-open body-item\' />';
        return this.itemFMWrapper(body, data, 'isFolder');
      },

      fileHTML: function (data, ext) {
        let body;
        body =  '<span class=\'glyphicon glyphicon-file body-item\'>' +
          '<span class=\'item-extension\'>' + ext.toUpperCase() + '</span>' +
          '</span>';
        return this.itemFMWrapper(body, data, 'isFile');
      },

      itemPMWrapper: function (item, classD) {
        let html;
        html =  '<div class=\'path-item-wrapper' + classD + '\'>' + item + '</div>';
        return html;
      },

      itemPath: function (data, num) {
        let item;
        item =  '<div class=\'path-item\'  id=\'pos-' + num + '\'>' + data + '</div>';
        return this.itemPMWrapper(item, ' pathItem');
      },

      arrowPath: function () {
        let item;
        item = '<div class=\'separator-path-item\'>'
          + '<span class=\'glyphicon glyphicon-menu-right\'/>' + '</div>';
        return this.itemPMWrapper(item, '');
      },

      errorNoFolder: function () {
        let html;
        html = '<div autoheight="autoheight" substractvalue="100" ' +
          'class=\'no-folder-error centerVerticallyParent\' parentwindow=\'false\' >' +
          '<div class=\'no-folder-error-message\' ">' +
          'Mmmmh... :(' +
          '<br />' +
          'Sorry but I have nothing to show you if you don\'t select one of your folders.' +
          '</div>' +
          '</div>';
        return html;
      },

      errorEmptyFolder: function () {
        let html;
        html = '<div autoheight="autoheight" substractvalue="100" ' +
          'class=\'empty-folder-error centerVerticallyParent\' parentwindow=\'false\' >' +
          '<div class=\'empty-folder-error-message\' ">' +
          'Mmmmh... :(' +
          '<br />' +
          'Your current folder seems to be empty.' +
          '<br />' +
          'Drag&drop files onto me to add file in this repository :)' +
          '</div>' +
          '</div>';
        return html;
      },

      /** Page Manager Html related **/

      dropDownItem: function (index, string, checked) {
        let html; let select;

        checked ? select = ' item-selected' : select = '';
        html =  '<div class=\'drop-down-menu-item menu-item-' + index + select + ' nofocus\' ' +
          'ng-click=\'selectPage(' + index + ')\'>' +
          string +
          '</div>';
        return html;
      },

      /** Page Shortcuts Html related **/

      shortcutButtonItem: function (string, index, selected, advanced) {
        let html; let isSelected; let allowAdvanced;

        selected ? isSelected = 'item-shortcuts-selected' : isSelected = '';
        if (advanced)
          allowAdvanced = '<span class=\'item-shortcuts-gear-icon ' +
            'glyphicon glyphicon-cog nofocus\' ' +
            'ng-click=\'itemParameter(' + index + ')\' />';
        else allowAdvanced = '';

        html =  '<div class=\'button-shortcuts item-shortcuts-index-' +
          index + ' ' + isSelected + ' nofocus\' ' +
          'ng-click=\'buttonGetActioned(' + index + ')\'>' +
          '<div class=\'button-shortcuts-box\'>' +
          '<div class=\'button-shortcuts-title ellipsis-container\'>' +
          string +
          '<span class=\'button-plus-icon glyphicon glyphicon-plus\' />' +
          '</div>' +
          allowAdvanced +
          '</div>' +
          '</div>';
        return html;
      },

      shortcutSingleItem: function (string, index, selected, advanced) {
        let html; let isSelected; let allowAdvanced;

        selected ? isSelected = 'item-shortcuts-selected' : isSelected = '';
        if (advanced)
          allowAdvanced = '<span class=\'item-shortcuts-gear-icon ' +
            'glyphicon glyphicon-cog nofocus\' ' +
            'ng-click=\'itemParameter(' + index + ')\' />';
        else allowAdvanced = '';

        html =  '<div class=\'item-shortcuts item-shortcuts-index-' +
          index + ' ' + isSelected + ' nofocus\' ' +
          'ng-click=\'itemGetSelected(' + index + ')\'>' +
          '<div class=\'item-shortcuts-box\'>' +
          '<div class=\'item-shortcuts-title ellipsis-container\'>' +
          string +
          '</div>' +
          allowAdvanced +
          '</div>' +
          '<span class=\'arrow-left\'/>' +
          '</div>';
        return html;
      },

      /** Section/Module Contacts Html related **/

      itemContactList: function (login, index, icon, isContact, connected, initials) {
        let html; let button;

        if (isContact)
          button = '<button type=\'button\' class=\'btn btn-danger delete-contact-button\' ' +
            'ng-click=\'deleteContact(' + index + ')\'>Delete contact</button>';
        else
          button = '<button type=\'button\' class=\'btn btn-success add-contact-button\' ' +
            'ng-click=\'addContact(' + index + ')\'>Add contact</button>';

        html =  '<div class=\'item-contact state-contact-' + isContact + '\' ' +
          'ng-click=\'selectContact(' + index + ')\'>' +
          '<div class=\'column-icon-initials\'>' + '<span class=\'circle-container\'>' +
          initials + '</span></div>' +
          '<div class=\'column-login\'>' + login + '</div>' +
          button +
          '</div>';

        return html;
      },

      noItemContactList: function (status) {
        let html; let type;

        if (status === 'contact') type = 'contact list';
        else if (status === 'blacklist') type = 'blacklist list';
        else type = 'add list';

        html = '<div class=\'no-item-contact no-state-' + status + '\' >' +
          '<span class=\'no-item-contact-block-message\' >' +
          'We have no result for your ' + type + '.' +
          '</span>' +
          '</div>';
        return html;
      },

      noItemSearchList: function () {
        let html;
        html =  '<div class=\'no-item-contact no-state-search\' >' +
          '<span class=\'no-item-contact-block-message\' >' +
          'We have no result for your user list.' +
          '</span>' +
          '</div>';
        return html;
      },

      /** Page Administration Html related **/

      itemAdminList: function (login, index, icon, initials, state) {
        let html; let backgroundColor;

        if (state === -1) backgroundColor = 'gray';
        else if (state === 0) backgroundColor = 'red';
        else backgroundColor = 'green';

        html =  '<div class=\'item-user state-' + status + '\' ' +
          'ng-click=\'selectUser(' + index + ')\'>' +
          '<div class=\'column-icon-initials connection-state-' + backgroundColor + '\'>' +
          '<span class=\'circle-container\'>' + initials + '</span>' +
          '</div>' +
          '<div class=\'column-login\'>' + login + '</div>' +
          '</div>';
        return html;
      },

      /** Page User Files Html related **/

      configRepo: function (name, host, rpId) {
        let html;
        html = '<md-dialog aria-label="Folder configuration">' +
          '<form ng-cloak>' +
          '<md-toolbar>' +
          '<div class="md-toolbar-tools" style="color: white !important">' +
          '<h2 style="color:white">Folder configuration [' + name + ']</h2>' +
          '<span flex></span>' +
          '<md-button class="md-icon-button" ng-click="cancel()">' +
          '<md-icon class="glyphicon glyphicon-remove" aria-label="Close dialog" ' +
          'style="font-size: 20px"></md-icon>' +
          '</md-button>' +
          '</div>' +
          '</md-toolbar>' +
          '<md-dialog-content>' +
          '<md-tabs md-dynamic-height md-border-bottom>' +
          '<md-tab label="Information">' +
          '<div class="md-dialog-content">' +
          '<h3>Folder information</h3>' +
          '<p>' + 'Name of the folder : ' + name + '</p>' +
          '<p>' + 'Owner of the folder : ' + host + '</p>' +
          '<p>' + 'Folder Id : ' + rpId + '</p>' +
          '</div>' +
          '</md-tab>' +
          '<md-tab label="Management">' +
          '<div class="md-dialog-content">' +
          '<span ng-if="owner">' +
          '<h3>Rights management</h3><br />' +
          '<md-toolbar layout="row" class="md-hue-7">' +
          '<div class="md-toolbar-tools">' +
          '<span>Add member</span>' +
          '</div>' +
          '</md-toolbar><br />' +
          '<md-input-container style="margin-right: 15px;">' +
          '<label>Contacts</label>' +
          '<md-select ng-model="contact">' +
          '<md-option ng-repeat="contact in contacts" ng-value="contact" ' +
          'ng-click="update(contact)">{{contact.login}}</md-option>' +
          '</md-select>' +
          '</md-input-container>' +
          '<md-button ng-click="addMember()">Add as member</md-button>' +
          '<md-divider></md-divider>' +
          '</span>' +
          '<md-toolbar layout="row" class="md-hue-7">' +
          '<div class="md-toolbar-tools">' +
          '<span>Member List</span>' +
          '</div>' +
          '</md-toolbar>' +
          '<md-list flex>' +
          '<md-list-item class="md-2-line" ng-repeat="member in members" ng-click="null">' +
          '<div class="md-list-item-text">' +
          '<h3>{{member.login}}</h3>' +
          '<p>{{member.status}}</p>' +
          '</div>' +
          '<span ng-if="owner">' +
          '<md-button class="sm-secondary" ng-click="deleteMember(member.login)" ' +
          'ng-if="member.status !== \'host\'">' +
          '<label></label>' +
          '<span class="fa fa-times" style="color:red; font-size:25px; padding-top: 13px"/>' +
          '</md-button>' +
          '</span>' +
          '</md-list-item>' +
          '</md-list>' +
          '</div>' +
          '</md-tab>' +
          '</md-tabs>' +
          '</md-dialog-content>' +
          '<md-dialog-actions layout="row">' +
          '<span ng-if="owner">' +
          '<md-button class="md-warn" ng-click="repoDelete(\'' + rpId + '\')">Delete</md-button>' +
          '</span>' +
          '<span flex></span>' +
          '<md-button ng-click="hide()">Close</md-button>' +
          '</md-dialog-actions>' +
          '</form>' +
          '</md-dialog>';

        return html;
      },
    };
  },
]);
