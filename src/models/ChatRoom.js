import {db} from '../firebase.js'
class ChatRoom {
    constructor(host, remote, store) {
        this.host = host;
        this.remote = remote;
        this.store = store
    }

    getAll(callback){

        //FROM host TO remote
        db.ref("users/" + this.host.id + '/messages/' + this.remote.id).on("value", 
            (snapshot1) => {
                //FROM remote TO HOST
                db.ref("users/" + this.remote.id + '/messages/' + this.host.id).on("value", 
                    (snapshot2) => {
                        const hostMes = snapshot1.val();
                        const remoteMes = snapshot2.val();
                        console.log(hostMes);
                        console.log(remoteMes);
                        //TODO: hacky
                        if (!(hostMes === null)){
                            console.log("recieved messages, concated")
                            callback({...hostMes,...remoteMes});
                        } else {
                            console.log("AHHH")
                            callback(remoteMes)
                        }
                        
                    }, (err) => {
                        console.log('Error getting messages from remote', err);
                    }
                );
            }, (err) => {
                console.log('Error getting messages from host', err);
            }
        );
    }

    listen(id1, id2, callback) {
        db.ref("users/" + id1 + '/messages/' + id2).on("child_added", callback);
    }

    listenForRecieving() {
        //FROM remote TO host
        this.listen(this.remote.id, this.host.id, (snapshot, prevChildKey)=> {
            var message = snapshot.val();
            this.store.add(message);
        });
        console.log("listening: rec")

        
    }

    listenForDelievered() {
        
        //FROM host TO remote
        this.listen(this.host.id, this.remote.id,() =>{
            console.log("message delivered")
        })
        console.log("listening: del")
    }

    getMessages() {
        this.getAll((messages) => {

            if (messages != null) {
                this.store.updateAll(messages);
            }
            else {
                console.log("no previous messages")
            }
        });
      }
}
export default ChatRoom