import {decorate, observable, action, computed} from 'mobx'
//import Message from '../models/Message'
class MessageStore {
    //@observable ...
    messages = [];

    add(newId, newMessage) {
        var newItem = {
            id: newId,
            message: newMessage
        }
        this.messages.push(newItem);
        console.log("in storeTotal Messages")
        console.log(newItem)
    }
    updateAll(messages) {
      this.messages = messages;
    }
    get count() {
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