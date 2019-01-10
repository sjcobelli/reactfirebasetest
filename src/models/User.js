import {firebase} from '../firebase.js'

class User {
    constructor(name) {
        this.userName = name;
        this.isRemote = null;
        this.id = null;

    }


    //returns the firebase userObject
    get fireUser() {
        if (this.isUserSignedIn()){
            return firebase.auth().currentUser
        } else {
            console.log('no user logged in!');
            return null
        }
    }
    
    // Returns the signed-in user's display name.
    getUserName() {
        if (!this.isRemote) {
            return firebase.auth().currentUser.displayName;
        }
        return this.userName
    }
    isUserSignedIn() {
        if (!this.isRemote) {
            return !!firebase.auth().currentUser;
        }
        return false
    } 

    setRemote() {
        this.isRemote = true;
        //TODO: hacked id
        this.id = this.userName
    }
    
    signIn() {
        firebase.auth().signInAnonymously().catch(function(error) {
            // Handle Errors here.
            console.log(error.code);
            console.log(error.message);

            return false;
            // ...
        });
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
              // User is signed in.
                //TODO: 6
                //this.id = firebase.auth().currentUser.id
                this.id = this.userName;
                this.isRemote = false;
              // ...
            } else {
              console.log("sign out")
              // ...
            }
            // ...
        });
        //TODO: check with users table
        //db.ref('users/')

    }

    signOut() {
        firebase.auth().signOut();
    }

}
export default User
