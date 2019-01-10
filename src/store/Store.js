import {decorate, observable, action, computed} from 'mobx'

class Store {
    //@observable ...
    customers = [];
    selectedIndex = -1;
    //@action
    change(customers) {
      this.customers = customers;
      this.selectedIndex = -1;
    }
    select(selectedCustomer) {
        
        this.selectedIndex = selectedCustomer;
    }
    get selectedCustomer() {
        if (this.selectedIndex > -1 && this.count > 0) {
            return this.customers[this.selectedIndex];
        } else {
            return {}
        }
    }
    unselect() {
        this.selectedIndex = -1;
    }
    get count() {
        return this.customers.length
    }
  }

//TtL: Decorate replaces code injecting
//observable for immutable ui vars to track
//action for modifying those vars
//computed for derived values
decorate(Store, {
    customers: observable,
    selectedCustomer: computed,
    selectedIndex: observable,
    change: action,
    select: action,
    count: computed
})

export default Store;