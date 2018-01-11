/**
 * Created by Benoit on 01/11/2017.
 */

/**
 *
 */
Nymerus.factory('Tree', [
  function () {
    return {
      root: null,
      currentPath: [],
      currentFolder: null,
      history: [],

      /**
       *
       * @param root
       * @return {number}
       */
      init: function (root) {
        this.reset();
        if (root !== null && root !== undefined) {
          this.root = root;
          this.currentFolder = root;
          this.currentPath.push(root.name);
          this.history.push(root);
          return 0;
        }

        return -1;
      },

      /**
       *
       * @return {number}
       */
      toRoot: function () {
        if (this.root !== null && this.root !== undefined) {
          this.currentFolder = this.root;
          this.currentFolder.length = 1;
          this.currentPath.length = 1;
          this.history.length = 1;
          return 0;
        }

        return -1;
      },

      /**
       *
       * @param name
       * @return {number}
       */
      toChildren: function (name) {
        if (name !== null && name !== undefined && name !== '') {
          let i; let len; let item; let children;

          children = this.currentFolder.children;
          for (i = 0, len = children.length; i < len; ++i) {
            item = children[i];
            if (File.isFolder && item.name === name) {
              this.currentFolder = item;
              this.currentPath.push(this.currentFolder.name);
              this.history.push(this.currentFolder);
              return 0;
            }
          }

          return -1;
        }

        return -1;
      },

      /**
       *
       * @param data
       * @return {number}
       */
      toParent: function (data) {
        const name = data[0];
        const pos = parseInt(data[1]);

        if (name !== null && name !== undefined && name !== '') {
          let i; let len; let item;

          for (i = 0, len = this.history.length; i < len; ++i) {
            item = this.history[i];

            if (item.name === name && i === pos) {
              this.currentFolder = item;
              this.history.length = (i + 1);
              this.currentPath.length = (i + 1);
              return 0;
            }
          }

          return -1;
        }

        return -1;
      },

      /**
       *
       */
      reset: function () {
        this.root = null;
        this.currentPath = [];
        this.currentFolder = null;
        this.history = [];
      },

    };
  },
]);
