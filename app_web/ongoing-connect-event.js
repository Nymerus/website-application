/**
 * Created by Benoit on 07/10/2016.
 */

class Tuple {

  constructor (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  toString() {
    return "[" + this.x.toString() + ", "
      + this.y.toString() + ", "
      + this.z.toString() + "]";
  }
}

class OngoingConnectEvent {

  constructor () {
    this.list = [];
  }

  push(x, y, z) {
    this.list.push(new Tuple(x, y, z));
  }

  getFromId(x) {
    for (let i = 0, len = this.list.length; i < len; ++i) {
      if (this.list[0].x === x)
        return this.list[0];
    }
    return null;
  }

  getFromIdForPos(x) {
    for (let i = 0, len = this.list.length; i < len; ++i) {
      if (this.list[0].x === x)
        return i;
    }
    return -1;
  }

  getFromPos(index) {
    if (this.list.length > index)
      return this.list[index];
    return null;
  }

  splice(start, len) {
    return this.list.splice(start, len);
  }

  spliceForEach(x) {
    while (this.getFromIdForPos(x) > 0) {
      this.splice(x, 1);
    }
  }
}

module.exports = OngoingConnectEvent;