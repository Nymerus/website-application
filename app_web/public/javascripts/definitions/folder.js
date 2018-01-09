/**
 * Created by Benoit on 01/11/2017.
 */

/**
 *
 */
class Folder {
  /**
   *
   * @param name
   * @param path
   * @param rights
   */
  constructor(name, path, rights) {
    this.name = name;
    this.path = path;
    this.rights = rights;
    this.children = [];
  }

  /**
   *
   * @param children
   */
  pushChildren(children) {
    this.children.push(children);
  }

  /**
   *
   * @param index
   * @return {*}
   */
  getChildren(index) {
    if (index >= 0 && index < this.children.length) {
      return this.children[index];
    }
  }

  static isFolder() {
    return true;
  }
}
