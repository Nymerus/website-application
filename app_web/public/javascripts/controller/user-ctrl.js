/**
 * Created by Benoit on 01/11/2017.
 */

/**
 * Angular Controller : UserPage Controller
 *
 * This controller will provide all generics data need for the whole UserPage, and integrate multiple services for communications between entities and WebApp.
 */
NymerusController.controller('UserCtrl', ['$route', '$rootScope', '$scope',
  '$location', 'socket', 'msgBus', 'pageHandler',
  function ($route, $rootScope, $scope, $location, socket, msgBus, pageHandler) {

    /**
     * $Scope variable for user information.
     * Make it available for everything which is a children of this controller.
     */
    $scope.user_email = $scope.user.email;
    $scope.user_type = $scope.user.type;

    /**
     * Shortening logic for getting initials through parsing of user login.
     */
    const initials = $scope.login.match(/\b\w/g) || [];
    $scope.user_initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();

    /**
     * Initialize the 'lastPage' with the session variable if found, else initialized at '-1'.
     */
    $scope.lastPage = window.localStorage.last_page || -1;

    // console.log('Initializing UserCtrl : value of $scope.lastPage = ' + $scope.lastPage);

    /**
     * Repository lists
     */
    $scope.list_repo = [];
    $scope.user_repo = [];
    $scope.shared_repo = [];

    /**
     * User contacts
     */
    $scope.user_contact = null;

    /**
     * Initialization function
     */
    const init = function () {};

    /**
     * Internal communication event listener.
     * At each changing page (section like 'My Files', 'My Profile') will be triggered.
     * Update value and trigger factory related (pageHandler)
     * (Sender is Nymerus Page Manager)
     */
    msgBus.onMsg('loadingPages', function (event, data) {
      let ret;
      const type = $scope.user_type;

      if (type === 'admin' || type === 'superadmin')
        data.administrator = true;

      ret = pageHandler.initializer(data, $scope.lastPage);
      window.localStorage.last_page = $scope.lastPage = ret;
    });

    /**
     * Request list of repository headers if an internal update request as been detected.
     */
    msgBus.onMsg('updateRepo', function (event, msg) {
      if ($scope.isAuthenticated() && !$scope.reconnection)
        socket.emit('repo.get', { sessionId: $scope.socket_id });
    }, $scope);

    /**
     * Receive a list of repository headers and create a array [list_repo] which contains each of them.
     */
    socket.on('repo.get', function (data) {
      if (data.code === '200') {
        let list; let i; let len;
        $scope.list_repo.length = 0;
        $scope.user_repo.length = 0;
        $scope.shared_repo.length = 0;

        list = data.repos;
        console.log('User repo list received. Keys.length = ' + list.length);
        for (i = 0, len = list.length; i < len; ++i) {
          let repoHeader = list[i];
          $scope.list_repo.push(repoHeader);
        }

        requestReposDetails();
      } else
        console.log('User repo update failed. code = ' + data.code);
    });

    /**
     * For each repo into [list_repo], request detailed information.
     */
    const requestReposDetails = function () {
      let i; let len; let item;

      for (i = 0, len = $scope.list_repo.length; i < len; ++i) {
        item = $scope.list_repo[i];
        socket.emit('repo.data', { id: item.id, });
      }
    };

    /**
     * Receive detailed information which as been requested from f(requestReposDetail).
     * Then we check if element already exist or not and act accordingly.
     */
    socket.on('repo.data', function (data) {
      let updating = false;

      if (data.code === '200') {
        for (let i = 0, len = $scope.list_repo.length; i < len; ++i) {
          if (data.id === $scope.list_repo[i].id) {
            updating = true;
            $scope.list_repo[i] = data;
            break;
          }
        }

        if (!updating) {
          $scope.list_repo.push(data);
        }

        parseRepositoriesByType();
      } else
        console.log('repo.data failed. Error ' + data.code);
    });

    /**
     * Push each item into [user_repo] or [shared_repo] depending of the repo type.
     */
    const parseRepositoriesByType = function () {
      let i; let len; let item; let tRepo;

      for (i = 0, len = $scope.list_repo.length; i < len; ++i) {
        item = $scope.list_repo[i];
        if (item !== null && item !== undefined) {
          tRepo = getListFromItemType(item, false);
          if (!findAndUpdateInList(tRepo, item))
            tRepo.push(item);
          findAndDestroyInList(getListFromItemType(item, true), item);
        }
      }

      msgBus.emitMsg('repoUpdated', 'none');
    };

    /**
     * Get type from item, invert it if toggle is set to true and return corresponding list.
     *
     * @param item
     * @param toggle
     * @returns {*}
     */
    const getListFromItemType = function (item, toggle) {
      let tRepo; let type;

      type = item.isShared;
      if (toggle) type = !type;

      if (type) tRepo = $scope.shared_repo; else tRepo = $scope.user_repo;

      return tRepo;
    };

    /**
     * Search for item in list and update if already exist. Return result of search as boolean
     *
     * @param tRepo
     * @param item
     * @returns {boolean}
     */
    const findAndUpdateInList = function (tRepo, item) {
      let updated = false;

      for (let j = 0, size = tRepo.length; j < size; ++j) {
        if (item.id === tRepo[j].id) {
          tRepo[j] = item;
          updated = true;
        }
      }

      return updated;
    };

    /**
     * Search and destroy occurence of item in list.
     *
     * @param tRepo
     * @param item
     */
    const findAndDestroyInList = function (tRepo, item) {
      for (let j = 0, size = tRepo.length; j < size; ++j) {
        if (item.id === tRepo[j].id)
          tRepo.splice(j, 1);
      }
    };

    socket.on('repo.content', function (msg) {
      if (msg.code === '200') {
        msgBus.emitMsg('loadFolderIntoFM', msg);
      } else
        console.log('repo.content failed. Error ' + msg.code);
    });

    /**
     * External communication event listener.
     * Triggered when AppServer (previously called DataServer) respond to request of 'repo.create'.
     * Will dispatch data to all instances linked.
     */
    socket.on('repo.create', function (msg) {
      if (msg.code === '200') {
        console.log(JSON.stringify(msg, null, 2));
        msgBus.emitMsg('updateRepo', 'now');
      } else
        console.log('repo.create failed. Error ' + msg.code);
    }, $scope);

    /**
     * External communication event listener.
     * Triggered when AppServer (previously called DataServer) respond to request of 'repo.delete'.
     * Will dispatch data to all instances linked.
     */
    socket.on('repo.delete', function (msg) {
      if (msg.code === '200') {
        console.log(JSON.stringify(msg, null, 2));
        msgBus.emitMsg('updateRepo', 'now');
      } else
        console.log('repo.delete failed. Error ' + msg.code);
    }, $scope);

    socket.on('data.add', function (msg) {
      if (msg.code === '200') {
        socket.emit('repo.content', { id: msg.id, });
        msgBus.emitMsg('waitingForUpdatedRepo', msg.id);
      } else {
        console.log('data.addFile failed. Error ' + msg.code);
      }
    }, $scope);

    /***
     **
     ** CONTACTS RELATED LOGIC (MODULE AND PAGE ALIKE)
     **
     ***/

    /* User.[whatever] */

    /**
     * Internal communication event listener.
     * Triggered when module/page need update of user 'contacts'.
     * Will request corresponding information to AppServer (previously DataServer) through WebApp back-end.
     */
    msgBus.onMsg('updateContactsList', function (event, msg) {
      if ($scope.isAuthenticated() && !$scope.reconnection)
        socket.emit('contact.get', {});
    }, $scope);

    /**
     * External communication event listener.
     * Triggered when AppServer (previously DataServer) respond to request of user 'contact' list update.
     * Will dispatch data to all instances linked.
     */
    socket.on('contact.get', function (data) {
      if (data.code === '200') {
        console.log('User contacts has been successfully updated.');
        $scope.user_contact = data.contacts;
        msgBus.emitMsg('updatedContactsList', data.contacts);
      } else {
        console.log('User contacts update failed. code = ' + data.code);
      }
    });

    /* Contacts.[whatever] */

    /**
     * Internal communication event listener.
     * Triggered when module/page need update of user 'delete contact'.
     * Will request corresponding information to AppServer (previously DataServer) through WebApp back-end.
     */
    msgBus.onMsg('deleteContact', function (event, msg) {
      socket.emit('contact.delete', { login: msg, });
    }, $scope);

    /**
     * Internal communication event listener.
     * Triggered when module/page need update of user 'add contact'.
     * Will request corresponding information to AppServer (previously DataServer) through WebApp back-end.
     */
    msgBus.onMsg('addContact', function (event, msg) {
      socket.emit('contact.add', { login: msg, });
    }, $scope);

    /**
     * Internal communication event listener.
     * Triggered when module/page need update of user 'search'.
     * Will request corresponding information to AppServer (previously DataServer) through WebApp back-end.
     */
    msgBus.onMsg('updateUsersSearchList', function (event, msg) {
      if ($scope.isAuthenticated() && !$scope.reconnection)
        socket.emit('contact.search', {
          value: msg,
        });
    }, $scope);

    /**
     * External communication event listener.
     * Triggered when AppServer (previously called DataServer) respond to request of contact 'delete'.
     * Will dispatch data to all instances linked.
     */
    socket.on('contact.delete', function (msg) {
      socket.emit('contact.get', {});
    });

    /**
     * External communication event listener.
     * Triggered when AppServer (previously called DataServer) respond to request of contact 'add'.
     * Will dispatch data to all instances linked.
     */
    socket.on('contact.add', function (msg) {
      socket.emit('contact.get', {});
    });

    /**
     * External communication event listener.
     * Triggered when AppServer (previously called DataServer) respond to request of contact 'search'.
     * Will dispatch data to all instances linked.
     */
    socket.on('contact.search', function (msg) {
      if (msg.code === '200') {
        msgBus.emitMsg('updatedUsersSearchList', msg.contacts);
      } else
        console.log('Contacts.search failed. Error ' + msg.code);
    });

    init();
  },
]);
