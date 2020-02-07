import React, { Component } from 'react';
import './_App.scss';
import Bowling from './containers/Bowling/Bowling';
class App extends Component {
  render(){
    return (
      <div data-test="component-app" className="App">
        <Bowling/>
      </div>
    );
  }
}
export default App;
