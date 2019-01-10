import {decorate, observable, action} from 'mobx'
class CountStore {
    //@observable count;
    count = 0;
    //@action
    increment() {
      this.count += 1;
    }

    //@action
    clear() {
        this.count = 0;
    }
  }

decorate(CountStore, {
    count: observable,
    increment: action,
    clear: action
})

export default CountStore;