/**
 * Created by Benoit on 01/11/2017.
 */

/**
 *
 */
class File {

  /**
   *
   * @param name
   * @param path
   * @param fileType
   * @param rights
   * @param size
   * @param fileId
   */
  constructor(name, path, fileType, rights, size, fileId) {
    this.name = name;
    this.trueName = name.split('.')[0];
    this.ext = name.substr((~-name.lastIndexOf('.') >>> 0) + 2);
    this.path = path;
    this.type = fileType;
    this.rights = rights % 1000;
    this.size = size;
    this.id = fileId;
  };

  static isFolder() {
    return false;
  };

  getName() { return this.name; };

  getTrueName() { return this.trueName; };

  getExt() { return this.ext; };

  getPath() { return this.path; };

  getType() { return this.type; };

  getRights() { return this.rights; };

  getSize() { return this.size; };

  getId() { return this.id; };
}