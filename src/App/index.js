import React, { Component } from 'react';
// import { Grid, Row, Col } from 'react-bootstrap';
import { Header, Footer, MdInput } from '../Components';

import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/gfm/gfm';
import './index.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mdInput: ''
    };
  }

  onInputChange = (newValue) => {
    this.setState({ mdInput: newValue });
  }

  render() {
    const { mdInput } = this.state;

    return (
      <div className="app">
        <Header />
        {/*
          <Grid>
          <Row>
          <Col xs={12} md={6}>

          </Col>
          </Row>
          </Grid>
        */}
        <MdInput code={mdInput} onInputChange={this.onInputChange} />
        <Footer />
      </div>
    );
  }
}

export default App;
