/**
 * Created by Benoit on 01/11/2017.
 */

NymerusController.controller('NymerusFileManagerCtrl', ['$scope', 'BackFileManager',
  'msgBus', 'socket',
  function ($scope, BackFileManager, msgBus, socket) {
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
      if (current.id === msg.post.id)
        socket.emit('repo.content', { id: msg.post.id, });
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
      const reader = new FileReader();
      let buffer;

      reader.onload = (function (file) {
        return function (e) {
          if (current === null)
            return;
          buffer = e.target.result;
          socket.emit('data.add', {
            id: current.id,
            path: obj.path + file.name,
            data: '\'' + buffer + '\'',
          });
          pushQueue.pop();
          if (pushQueue.length > 0)
            pushAllFile();
        };
      })(obj.file);
      reader.readAsText(obj.file);
      socket.emit('notification.toRepo', {
        repoId: current.id,
        code: '200',
        post: { id: current.id, },
      });
    };

    socket.on('data.get', function (msg) {
      if (msg.code === '200') {
        console.log(msg);
        const arrb = new Uint8Array(msg.data).buffer;
        const blob = new Blob([arrb], { type: 'application/zip' });
        saveAs(blob, 'Test_download');
      }
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
        console.log('newFileDropped cannot be used when "current" repo isn\'t defined.');
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
        socket.emit('data.get', {id: current.id});
      }
      else
        console.log('repositoryDownloads cannot work when "current" is either null or undefined.');
    };

    $scope.repositoryReload = function () {
      if (current !== null && current !== undefined)
        socket.emit('repo.get', { sessionId: $scope.socket_id, repoId: current.repoId });
      else
        console.log('repositoryReload cannot work when "current" is either null or undefined.');
    };

    $scope.$on('$destroy', function (event) {
      socket.removeAllListeners();
    });
  },
]);
