import React, { Component } from 'react';
import CustomerView from './components/CustomerView.js'
import ChatClient from './components/ChatClient.js'

import 'typeface-roboto';

class App extends Component {
//<CustomerView/>
//<ChatClient/>
  render() {
    return (
      <div className="App">
        <ChatClient/>
      </div>
    );
  }
}

export default App;
