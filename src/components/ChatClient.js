import React, { Component } from 'react';
import {db} from '../firebase.js'; 
import MessageStore from '../store/MessageStore';
import {observer} from 'mobx-react'
import User from '../models/User'
import ChatRoom from '../models/ChatRoom'
import Message from '../models/Message'


//Global state
const store = new MessageStore();


class ChatClient extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isLoggedIn: false,
            isRoomOpen: false,
            host: null,
            remote: null,
        }
        this.handleLogin = this.handleLogin.bind(this)
        this.handleRoom = this.handleRoom.bind(this)
    }

    handleLogin(userName) {
        const user = new User(userName);
        user.signIn();
        if (user.isUserSignedIn()) {
            this.setState({
                isLoggedIn: true,
                host: user
            });
        } else {
            console.log('Sign in failed, try again')
        }
    }

    handleRoom(remote) {
        /*
        if (user.isUserSignedIn()) {
            this.setState({
                isLoggedIn: true,
                host: user
            });
            console.log("Creating Chat room...")
            const chatRoom = new ChatRoom();
            chatRoom.listenForRecieving();
            chatRoom.listenForDelievered();
        } else {
            console.log('Sign in failed, try again')
        }
        */
       console.log("remote")
       console.log(remote)
        
        console.log("Creating Chat room...")
        const chatRoom = new ChatRoom(this.state.host,remote, store);
        chatRoom.getMessages();
        console.log("Recieved past convos")
        console.log("Starting listener for messages...")
        chatRoom.listenForRecieving();
        console.log("Starting listener for delivered...")
        chatRoom.listenForDelievered();
        this.setState({
            isRoomOpen: true,
            remote: remote
        });

    }
    
    render(){
        var content = null;
        if (!this.state.isLoggedIn) {
            content = (
                <LoginPrompt onLogin={this.handleLogin}/>
            )
        }
        else if (!this.state.isRoomOpen) {
            content = (
                <RoomForm onRoom={this.handleRoom}/>
            )
        } else {
            content = (
                <div>
                    <MessageBoard store={store}/>
                    <MessageForm host={this.state.host} remote={this.state.remote} store={store}/>
                </div>
            );
        }
        return (
            <div>
                {content}
            </div>
        )
    }
}

class LoginPrompt extends Component {
    constructor(props) {
        super(props)
        this.state = ({
            text: ''
        })
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleChange(e) {
        this.setState({
            text: e.target.value
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        this.props.onLogin(this.state.text)
    }
    render() {
        return (
            <div>
            <span>Login: Enter your name:</span>
            <form onSubmit={this.handleSubmit}>
                <input type='text' onChange={this.handleChange}/>
                <input type="submit" value="Submit"/>
            </form>
            </div>
        );
    }
}


class MessageBoard extends Component {
    //board that shows all messages    
    render() {
        var listItems = []
        if (this.props.store.messages) {
            listItems = this.props.store.messages.map((message, index) =>
                <div>
                    <li key={index}>
                        <MessageView userName={message.from} message={message.text}/>
                    </li>
                </div>
            );
        }
        return (
            <div>
                <span>MESSAGES: </span>
                <ul>
                    {listItems}
                </ul>
                <span>END OF MESSAGES</span>
            </div>
            
        )
    }
}

MessageBoard = observer(MessageBoard);

class MessageView extends Component{
    //Todo: add persons name in front

    render() {
        return (
            <div>
                {this.props.userName} says: {this.props.message}
            </div>
            
        )
    }
}


MessageView = observer(MessageView);

class RoomForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
          };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);   
    }
    handleChange(event) {
        this.setState({
            text: event.target.value
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        //validate recipeint exists
        const user = new User(this.state.text);
        user.setRemote();
        this.props.onRoom(user)
    }
    render() {
        return (
            <div>
            <span>Enter recipients name:</span>
            <form onSubmit={this.handleSubmit}>
                <input type='text' onChange={this.handleChange}/>
                <input type="submit" value="Submit"/>
            </form>
            </div>
        );
    }
}

class MessageForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
          };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);   
    }

    handleChange(event) {
        this.setState({
            text: event.target.value
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        console.log(this.props.host)
        console.log("Sending to")
        console.log(this.props.remote)
        
        var newItem = new Message(Date.now(), this.props.host.id, this.props.remote.id, this.state.text)
        var pushRef = db.ref('users/' + this.props.host.id + '/messages/' + this.props.remote.id).push();
        console.log(newItem)
        pushRef.set(newItem)
        e.target.reset()
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