/**
 * Created by Benoit on 01/11/2017.
 */

NymerusController.controller('NymerusFileManagerCtrl', ['$rootScope', '$scope', '$mdToast', 'BackFileManager',
  'msgBus', 'socket',
  function ($rootScope, $scope, $mdToast, BackFileManager, msgBus, socket) {
    $rootScope.currentRepoName = null;

    let pushQueue = [];
    let current = null;

    /**
     * ENTRYPOINT -> get all data for ONE repository
     */
    msgBus.onMsg('loadFolderIntoFM', function (event, data) {
      current = data;
      if (data !== null && data !== undefined) {
        $scope.injectRepository(data);
      } else
        console.log('loadFolderIntoFM should not catch data equal to "null" or "undefined".');
    }, $scope);

    msgBus.onMsg('repoIsUpdated', function(event, msg) {
      if (current.id === msg.post.id) {
        socket.emit('repo.content', { id: msg.post.id, });
      }
    }, $scope);


    /**
     * Inject data from one repository through backhandler.
     */
    $scope.injectRepository = function (msg) {
      if (msg !== null && msg !== undefined) {
        if (current !== null && msg.id === current.id) {
          if (BackFileManager.init(msg.content) === -1) {
            console.log('BackFileManager.init() execution failed.');
            BackFileManager.updateFolder();
            BackFileManager.updatePath();
          } else if (BackFileManager.update(msg.content) === -1) {
            console.log('BackFileManager.update() execution failed.');
          }
        }

      } else
        console.log('injectRepository cannot use null or undefined variable.');
    };

    /**
     * Temporary Methods (make a service) for upload/download management
     */
    const pushAllFile = $scope.pushAllFile = function () {
      const obj = pushQueue[pushQueue.length - 1];

      console.log('add ' + obj.file.name);
      socket.emit('data.add', {
        id: current.id,
        path: obj.path + obj.file.name,
        data: obj.file,
      });

      socket.emit('notification.toRepo', {
        repoId: current.id,
        code: '200',
        post: {
          id: current.id,
          name: $scope.login,
        },
      });
    };

    socket.on('data.get', function (msg) {
      if (msg.code === '200') {
        const arrb = new Uint8Array(msg.data).buffer;
        const blob = new Blob([arrb], { type: 'application/zip' });
        saveAs(blob, $rootScope.currentRepoName);
      } else
        $scope.actionResultToast('We were unable to get the content of this folder.', 'warning');
    });

    /**
     * Methods onMsg (Factory for internal communication Directives / Controllers)
     */
    msgBus.onMsg('moveNext', function (event, data) {
      if (BackFileManager.toChildren(data) === -1)
        console.log('BackFileManager.toChildren() execution failed.');
    }, $scope);

    msgBus.onMsg('moveBackTo', function (event, data) {
      if (BackFileManager.toParent(data) === -1)
        console.log('BackFileManager.toParent() execution failed.');
    }, $scope);

    msgBus.onMsg('newFileDropped', function (event, data) {
      if (current !== null && current !== undefined) {
        const obj = {
          file: data,
          repoId: current.repoId,
          path: BackFileManager.getPathIntoString(),
        };
        pushQueue.push(obj);
        pushAllFile();
      } else
        $scope.actionResultToast('You should select a folder before drag & drop your file.', 'warning');
    }, $scope);

    /**
     * Methods used to get current state information (Information from frontHandler)
     */
    $scope.getFolder = function () {
      return BackFileManager.getFolder();
    };

    $scope.getPath = function () {
      return BackFileManager.getPath();
    };

    /**
     * Methods used to modify current state (call to backHandler)
     */
    $scope.goParent = function () {
      const path = BackFileManager.getPath();
      BackFileManager.toParent([path[path.length - 2], path.length - 2]);
    };

    $scope.goRoot = function () {
      if (BackFileManager.toRoot() === -1)
        console.log('toRoot() failed');
    };

    /**
     * Methods communication (Emission to WebApp)
     */
    $scope.repositoryDownload = function () {
      if (current !== null && current !== undefined) {
        socket.emit('data.get', { id: current.id });
      }
      else
        $scope.actionResultToast('It\'s not possible to download without selecting a folder.', 'warning');
    };

    $scope.repositoryReload = function () {
      if (current !== null && current !== undefined)
        socket.emit('repo.get', { sessionId: $scope.socket_id, repoId: current.repoId });
      else
        $scope.actionResultToast('It\'s not possible to re/load without selecting a folder.', 'warning');
    };

    $scope.$on('$destroy', function (event) {
      socket.removeAllListeners();
    });

    $scope.actionResultToast = function (string, state) {
      $mdToast.show(
        $mdToast.simple().toastClass('md-toast-' + state)
          .textContent(string).position('fixed bottom right').hideDelay(3000)
      );
    };

  },
]);
