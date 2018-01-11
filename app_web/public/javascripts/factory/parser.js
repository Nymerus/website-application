/**
 * Created by Benoit on 01/11/2017.
 */

/**
 *
 */
Nymerus.factory('Parser', [
  function () {
    return {
      /**
       *
       * @param rawData
       * @return {*}
       */
      run: function (rawData) {
        if (rawData !== null && rawData !== undefined && rawData !== '')
          return this.parser(rawData);
        return null;
      },

      /**
       *
       * @param data
       */
      parser: function (data) {
        const root = new Folder('root', '/', 777);
        let index; let tabSection; let spaceSection;
        let path; let rights; let fileType; let fileId; let size;
        let lines = data.split('\n');
        let len = lines.length;

        if (lines[len - 1] === '') lines.pop();
        for (index = 0, len = lines.length; index < len; ++index) {
          tabSection = lines[index].split('\t');
          spaceSection = tabSection[0].split(' ');

          path = tabSection[1];
          rights = spaceSection[0];
          fileType = spaceSection[1];
          fileId = spaceSection[2];
          size = null;

          this.insertFile(root, path, rights, fileType, fileId, size);
        }

        return root;
      },

      /**
       *
       * @param root
       * @param path
       * @param rights
       * @param fileType
       * @param fileId
       * @param size
       * @return {*}
       */
      insertFile: function (root, path, rights, fileType, fileId, size) {
        let file; let name; let tmp; let i; let len;
        let cFolder; let nFolder; let item; let found; let cPath;

        cPath = '';
        tmp = path.split('/');
        name = tmp[tmp.length - 1];
        file = new File(name, path, fileType, rights, size, fileId);
        cFolder = root;
        for (i = 0, len = tmp.length; i < len; ++i) {
          found = false;
          cPath += tmp[i] + '/';
          if (i === len - 1)
            return cFolder.pushChildren(file);
          for (let j = 0, wid = cFolder.children.length; j < wid; ++j) {
            item = cFolder.children[j];
            if (tmp[i] === item.name) {
              cFolder = item;
              found = true;
              break;
            }
          }

          if (!found) {
            nFolder = new Folder(tmp[i], cPath, 777);
            cFolder.pushChildren(nFolder);
            cFolder = nFolder;
          }
        }
      },
    };
  },
]);
