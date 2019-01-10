import React, { Component } from 'react';
import {firebase, db} from '../firebase.js'; 
import MessageStore from '../store/MessageStore';
import {observer} from 'mobx-react'


const store = new MessageStore();

class ChatClient extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        const user = new User("Doug");
        user.signIn();
        
    }
    
    render(){
        return (
            <div>
                
                <MessageView store={store}/>
                <MessageForm user={this.user} store={store}/>
            </div>
        )
    }
}

class MessageView extends Component {
    constructor(props) {
        super(props);
        this.loadMessages = this.loadMessages.bind(this);
    }
    loadMessages() {
        // Load all docs
        db.collection('messages').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                console.log(doc.id, '=>', doc.data());
                this.props.store.add(doc.id, doc.data().message)
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
        //load change in docs
        db.collection('messsages')
        .onSnapshot(querySnapshot => {
            querySnapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
                console.log('New doc: ', change.doc.data());
            }
            if (change.type === 'modified') {
                console.log('Modified doc: ', change.doc.data());
            }
            if (change.type === 'removed') {
                console.log('Removed doc: ', change.doc.data());
            }
            });
        });
      }
    render() {
        var listItems = []
        if (this.props.store.messages) {
            console.log("dog up")
            console.log(this.props.store.messages[0])
            listItems = this.props.store.messages.map((message, index) =>
                <div>
                    <li key={message.id}>
                        <MessageV message={message.message}/>
                    </li>
                </div>
            );
        }
        console.log(this.props.store.messages)
        return (
            <div>
                <button onClick={this.loadMessages}>Show messages</button>
                <ul>
                    {listItems}
                </ul>
            </div>
            
        )
    }
}

MessageView = observer(MessageView);

class MessageV extends Component{
    render() {
        console.log(this.props.message)
        return (
            <div>
                {this.props.message}
            </div>
            
        )
    }
}


MessageV = observer(MessageV);

class User {
    constructor(name) {
        this.userName = name
    }
    // Returns the signed-in user's display name.
    getUserName() {
        return firebase.auth().currentUser.displayName;
    }
    isUserSignedIn() {
        return !!firebase.auth().currentUser;
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

              console.log("sign in")
              this.user = user
              // ...
            } else {
              console.log("sign out")
              // ...
            }
            // ...
          });
    }

    signOut() {
        firebase.auth().signOut();
    }
}

class MessageForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "charles",
            text: '',
          };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);   
    }
    
    componentWillReceiveProps(nextProps) {
        if(nextProps.user) {
          this.setState({'userName': nextProps.user.displayName});
        }
      }

    handleChange(event) {
        this.setState({
            text: event.target.value
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        var newItem = {
            message: this.state.text
        }
        console.log("username here")
        console.log(newItem)
        db.collection('messages').doc(this.state.userName).set(newItem)
        this.setState({
            text: ''
        });
    }
    //uses input and button instead of form
    //because form submit updates page
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input type='text' onChange={this.handleChange}/>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}
export default ChatClient