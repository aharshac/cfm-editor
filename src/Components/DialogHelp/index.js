import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Glyphicon } from 'react-bootstrap';

import ExtLink from '../ExtLink';

export default class DialogHelp extends Component {
  static propTypes = {
    onOk: PropTypes.func.isRequired,
    hidden: PropTypes.bool,
  }

  static defaultProps = {
    hidden: true,
  }

  render() {
    const { onOk, hidden } = this.props;

    return (
      <Modal show={!hidden} onHide={() => {if(onOk) onOk(); }} bsSize="large">
        <Modal.Header closeButton>
          <Modal.Title>Help</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="help-intro">
            <h4>Introduction</h4>
            <p>This React app is made for <ExtLink href="https://www.Collaborizm.com/">Collaborizm</ExtLink>.</p>
            <p>A big shout-out to <ExtLink href="https://www.collaborizm.com/profile/21339">Robert Lancer</ExtLink>, the CTO, and <ExtLink href="https://www.collaborizm.com/profile/4kvzVlj5e">Robert Lancer</ExtLink> the Design Lead of Collaborizm for inspiring this project.</p>
            <p>
              App by <ExtLink href="https://www.collaborizm.com/profile/Hyt3y6XK">Harsha Alva</ExtLink>.
              Made for <ExtLink href="https://www.collaborizm.com/">Collaborizm</ExtLink> with <Glyphicon glyph="heart" /> and <ExtLink href="https://facebook.github.io/react/">React</ExtLink>.
            </p>

            <br />

            <h4>Features</h4>
            <ul>
              <li>
                <b>Syntax Highlighting</b>
                <p>The markdown is syntax highlighted.</p>
              </li>

              <li>
                <b>Markdown Exporter</b>
                <p>Save the markdown to disc.</p>
              </li>

              <li>
                <b>HTML Exporter</b>
                <p>Export the parsed HTML to disc.</p>
              </li>

              <li>
                <b>State Persistence</b>
                <p>Saves the input markdown in the browser's LocalStorage.</p>
              </li>

              <li>
                <b>Synchronized scrolling</b>
                <p>Output corresponds to input and vice-versa when scrolled.</p>
              </li>

              <li>
                <b>Easy layout</b>
                <p>Simple and easy to use layout.</p>
              </li>

            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={() => {if(onOk) onOk(); }}>Ok</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
