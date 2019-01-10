import {decorate, observable, action, computed} from 'mobx'
//import Message from '../models/Message'

class MessageStore {
    //@observable ...
    messages = [];

    add(message) {
        this.messages.push(message);
    }
    updateAll(messages) {
        if (messages!== undefined){
            this.messages = Object.values(messages).sort((a,b) => {
                return a.time - b.time
            });
         }
      
    }
    get count() {
        console.log(this.messages)
        return this.messages.length
    }
  }

//TtL: Decorate replaces code injecting
//observable for immutable ui vars to track
//action for modifying those vars
//computed for derived values
decorate(MessageStore, {
    messages: observable,
    add: action,
    updateAll: action,
    count: computed
})

export default MessageStore;