/**
 * Created by Benoit on 01/11/2017.
 */

/**
 * Angular Controller : Group (section) Controller
 *
 * This controller will provide all generics data need for the section Group, and integrate multiple services for communications between entities and WebApp.
 */
NymerusController.controller('NymerusUserGroupCtrl', ['$scope', '$mdDialog', 'msgBus',
  'socket', 'HTMLProvider',
  function ($scope, $mdDialog, msgBus, socket, HTMLProvider) {
    $scope.repo = $scope.shared_repo;

    let shortcuts = {};
    let awake = false;
    let awaitedRepoId = 'undefined';

    const init = function () {};

    const defaultShortcuts = function () {
      shortcuts = {
        id: 'U-G-C',
        selected: 0,
        selected_id: '',
        actioned: -1,
        actioned_id: '',
        content: [
          {
            text: 'Phantom Folder',
            id: 'selectfolder-0',
            display: false,
            advanced: false,
            button: false,
          },
        ],
      };
    };

    /**
     * Internal communication event listener.
     * When receiving an 'updated Shortcuts', will trigger related UI function.
     */
    msgBus.onMsg('updatedShortcuts.U-G-C', function (event, data) {
      if (data !== null) {
        shortcuts = data;
        execSelected(shortcuts.selected_id.split('-'));
      }
    }, $scope);

    /**
     * Internal communication event listener.
     * When receiving an 'advanced Shortcuts', will trigger related UI function.
     */
    msgBus.onMsg('advancedShortcuts.U-G-C', function (event, data) {
      if (data !== null) {
        shortcuts = data;
        execAdvanced(shortcuts.selected_id.split('-'));
      }
    }, $scope);

    /**
     * Internal communication event listener.
     * When receiving an 'actioned Shortcuts', will trigger related UI function.
     */
    msgBus.onMsg('actionedShortcuts.U-G-C', function (event, data) {
      if (data !== null) {
        shortcuts = data;
        execAction();
      }
    }, $scope);

    /**
     * Internal communication event listener.
     * When receiving an 'awake Contacts', will load/reload all sleeping elements.
     */
    msgBus.onMsg('awakeSharedFile', function (event, data) {
      awake = true;
      buildShortcuts(awake);
      if ($scope.repo.length <= 0)
        msgBus.emitMsg('updateRepo', 'now');
    }, $scope);

    /**
     * Internal communication event listener.
     * When receiving an 'sleep all', will load/reload all sleeping elements.
     */
    msgBus.onMsg('sleepAll', function (event, data) {
      awake = false;
    }, $scope);

    /**
     * Internal communication event listener.
     * When receiving an 'awake Contacts', will load/reload all sleeping elements.
     */
    msgBus.onMsg('repoUpdated', function (event, data) {
      if (awake)
        buildShortcuts(awake);
    }, $scope);

    msgBus.onMsg('waitingForUpdatedRepo', function (event, data) {
      if (data !== null) {
        awaitedRepoId = data;
      }
    });

    /**
     *
     */
    const buildShortcuts = function (awake) {
      let isUpdating = false;
      let index = -1;

      if ($scope.repo !== null || $scope.repo !== undefined || $scope.repo.length <= 0) {
        defaultShortcuts();
        for (let i = 0, len = $scope.repo.length; i < len; ++i) {
          let tmp = {
            text: $scope.repo[i].name,
            id: 'selectfolder-' + i,
            display: true,
            advanced: true,
            button: false,
          };
          shortcuts.content.push(tmp);
          if ($scope.repo[i].id === awaitedRepoId) {
            isUpdating = true;
            index = i;
          }
        }

        if (awake) {
          msgBus.emitMsg('updateShortcuts', shortcuts);
          if (isUpdating)
            msgBus.emitMsg('reloadUpdatedRepo', ++index);
        }
      }
    };

    /**
     * Branch function
     * Trigger function depending of actioned shortcut
     */
    const execAction = function () {
      switch (shortcuts.actioned_id) {
        case 'addfolder':
          $scope.createRepo();
          break;
        default :
          console.log('case default');
          break;
      }
    };

    /**
     * Branch function
     * Trigger function depending of actioned shortcut
     */
    const execSelected = function (params) {
      switch (params[0]) {
        case 'selectfolder':
          socket.emit('repo.content', {
            id: $scope.repo[parseInt(params[1])].id,
          });
          break;
        default :
          console.log('case default');
          break;
      }
    };

    const execAdvanced = function (params) {
      switch (params[0]) {
        case 'selectfolder':
          $scope.configRepo(null, $scope.repo[parseInt(params[1])], $scope.user_contact);
          break;
        default :
          console.log('case default');
          break;
      }
    };

    /**
     * UI Function
     * Generate a modal with a prompt for user to enter a name for the new folder
     *
     * @param ev
     */
    $scope.createRepo = function (ev) {

      const currentDate = new Date(Date.now());
      const readableDate = currentDate.toString();

      // Appending dialog to document.body to cover sidenav in docs app
      const confirm = $mdDialog.prompt()
        .title('What would you name your folder?')
        .textContent('Please enter a name.')
        .placeholder('Folder name')
        .ariaLabel('Folder name')
        .initialValue($scope.login + ' repository [' + readableDate + ']')
        .targetEvent(ev)
        .ok('Submit')
        .cancel('Abort');

      $mdDialog.show(confirm).then(function (result) {
        console.log('User confirmed the folder creation.');
        socket.emit('repo.create', {
          sessionId: $scope.socket_id,
          repoName: result,
          path: '/',
        });
      },

        function () {
        console.log('User aborted the folder creation.');
      });
    };

    /**
     * UI Function
     * Generate a n alert to consult user and continue previous action if wanted
     *
     * @param ev
     * @param callback
     */
    const showConfirm = function (ev, callback) {
      let confirm = $mdDialog.confirm()
        .title('This action is irremediable.')
        .textContent('Do you still want to continue ?')
        .ariaLabel('Irremediable action prevention alert')
        .targetEvent(ev)
        .ok('Yes, I want.')
        .cancel('No, I don\'t.');

      $mdDialog.show(confirm).then(function () {
        callback();
      },

        function () {
        console.log('Finally, you did not continue.');
      });
    };

    /**
     * UI Function
     * Generate a modal with a form to consult and update repo configuration
     *
     * @param ev
     * @param item
     * @param contacts
     */
    $scope.configRepo = function (ev, item, contacts) {
      console.log(item);
      const name = item.name;
      const host = item.host;
      const rpId = item.id;
      const isHost = $scope.user.login === host;

      const html = HTMLProvider.configRepo(name, host, rpId);

      $mdDialog.show({
        controller: DialogController,
        template: html,
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        locals: { item, contacts, isHost },
      });
    };

    function DialogController($scope, $mdDialog, item, contacts, isHost) {
      $scope.init = function () {
        console.log(item);
        $scope.members = [];
        $scope.owner = isHost;
        loadMembers(item);
        if (contacts !== null && contacts !== undefined) {
          $scope.contacts = reconstruct(contacts);
          $scope.contact = $scope.contacts[0];
        } else
          $scope.contacts = null;
      };

      const loadMembers = function (item) {
        $scope.members.length = 0;
        extractMembers(item.members);
      };

      const reconstruct = function (contacts) {
        let i; let l; let o; let t;

        t = [];
        for (i = 0, l = contacts.length; i < l; ++i) {
          o = {
            login: contacts[i].login,
            connected: contacts[i].connected,
          };
          t.push(o);
        }

        return t;
      };

      const extractMembers = function (members) {
        let obj; let i; let l;

        for (i = 0, l = members.length; i < l; ++i) {
          obj = {
            login: members[i].login,
            role: 'user',
          };
          $scope.members.push(obj);
        }
      };

      $scope.update = function (contact) {
        $scope.contact = contact;
      };

      $scope.repoDelete = function (id) {
        showConfirm(null, function () {
          socket.emit('repo.delete', { repoId: id, });
        });
      };

      $scope.deleteMember = function (name) {
        console.log(name);
        if (name !== null && name !== undefined && name !== '') {
          socket.emit('repo.deleteMember', {
            name: item.name,
            login: name,
          });
        }
      };

      $scope.addMember = function () {
        if ($scope.contact !== null && $scope.contact !== undefined && $scope.contact !== '') {
          console.log('addMember', $scope.contact);
          console.log($scope.contacts);
          socket.emit('repo.addMember', {
            name: item.name,
            login: $scope.contact.login,
          });
        }
      };

      socket.on('repo.deleteMember', function (msg) {
        if (msg.code === '200') {
          console.log('repo.deleteMember succeed.');
          socket.emit('repo.data', { id: item.id, });
        } else
          console.log('repo.deleteMember failed. Error ' + msg.code);
      });

      socket.on('repo.addMember', function (msg) {
        if (msg.code === '200') {
          console.log('repo.addMember succeed.');
          socket.emit('repo.data', { id: item.id, });
        } else
          console.log('repo.addMember failed. Error ' + msg.code);
      });

      socket.on('repo.data', function (msg) {
        if (msg.code === '200' && msg.id === item.id) {
          console.log('repo.get succeed.');
          loadMembers(msg);
        }
      });

      $scope.hide = function () {
        $mdDialog.hide();
      };

      $scope.cancel = function () {
        $mdDialog.cancel();
      };

      $scope.answer = function (answer) {
        $mdDialog.hide(answer);
      };

      $scope.init();
    }

    init();
  },
]);
