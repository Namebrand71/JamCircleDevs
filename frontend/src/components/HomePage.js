import React, {Component} from 'react';
import Home from './Home';

export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{paddingLeft: '250px'}}>
        <Home />
      </div>
    );
  }
}
