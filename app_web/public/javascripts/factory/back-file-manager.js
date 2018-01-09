/**
 * Created by Benoit on 01/11/2017.
 */

/**
 *
 */
Nymerus.factory('BackFileManager', ['Parser', 'Tree', 'msgBus',
  function (Parser, Tree, msgBus) {
    return {
      folder: null,

      /**
       *
       * @param rawData
       */
      init: function (rawData) {
        let folder = Parser.run(rawData);
        if (folder !== null && folder !== undefined) {
          this.folder = folder;
          if (Tree.init(folder) === 0)
            return this.updateInterface();
          return -1;
        }

        Tree.reset();
        return -1;
      },

      /**
       *
       * @param rawData
       * @return {number}
       */
      update: function (rawData) {
        if (this.folder === null && this.folder === undefined)
          return this.init(rawData);
        const folder = Parser.run(rawData);
        if (folder !== null && folder !== undefined) {
          this.folder = folder;
          return this.updateInterface();
        }

        return -1;
      },

      toChildren: function (name) {
        if (Tree.toChildren(name) === 0)
          return this.updateInterface();
        return -1;
      },

      toParent: function (data) {
        if (Tree.toParent(data) === 0)
          return this.updateInterface();
        return -1;
      },

      toRoot: function () {
        if (Tree.toRoot() === 0)
          return this.updateInterface();
        return -1;
      },

      updateInterface: function () {
        const folder = Tree.currentFolder;
        if (folder !== null && folder !== undefined) {
          this.updateFolder(folder);
          this.updatePath(Tree.currentPath);
          return 0;
        }

        return -1;
      },

      getFolder: function () {
        return Tree.currentFolder;
      },

      getPath: function () {
        return Tree.currentPath;
      },

      getPathIntoString: function () {
        let path = '';

        for (let i = 1, len = Tree.currentPath.length; i < len; ++i) {
          path += Tree.currentPath[i] + '/';
        }

        return path;
      },

      updateFolder: function () {
        msgBus.emitMsg('newFolder', Tree.currentFolder);
      },

      updatePath: function () {
        msgBus.emitMsg('newPath', Tree.currentPath);
      },
    };
  },
]);
