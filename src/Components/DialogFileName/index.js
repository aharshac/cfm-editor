import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, FormControl, ControlLabel, Col, Alert } from 'react-bootstrap';

import DialogOkCancel from '../DialogOkCancel';

const invalids = /([^a-z0-9\-\_\s]+)/gi;

const hadInvalidChars = (str) => invalids.test(str);

const stripInvalidChars = (str) => str.replace(invalids, '-');

export default class DialogFileName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tempFileName: props.fileName,
      error: false
    };
  }

  static propTypes = {
    action: PropTypes.string.isRequired,
    maxLength: PropTypes.number.isRequired,
    fileName: PropTypes.string,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    hidden: PropTypes.bool,
  }

  static defaultProps = {
    hidden: true,
    maxLength: 32,
    fileName: 'Untitled'
  }

  handleFileNameChange = (e) => {
    this.setState({ tempFileName: e.target.value });
  }

  getFileNameValidationState = () => {
    const { maxLength } = this.props;
    const { tempFileName } = this.state;
    const length = tempFileName.length;
    const result = (maxLength > 0 && length > 1 && length <= maxLength && !hadInvalidChars(tempFileName));
    return result ? 'success' : 'error';
  }

  doOnOk = () => {
    const { onOk, maxLength, action } = this.props;
    const inputFileName = this.inputFileName.value;
    const strippedName = stripInvalidChars(inputFileName);

    if (maxLength > 0 && strippedName.length > 1 && strippedName.length <= maxLength) {
      this.setState({ error: false });
      if (onOk) onOk(action, inputFileName, inputFileName);
    } else {
      this.setState({ error: true });
    }
  }

  render() {
    const { onCancel, hidden, maxLength, fileName } = this.props;
    const { error } = this.state;

    return (
      <DialogOkCancel
        txtTitle="Prompt"
        onOk={this.doOnOk}
        onCancel={() => {if(onCancel) onCancel(); }}
        hidden={hidden}
      >
        <div>
          { error ?
            <Alert bsStyle="danger">
              <strong>Error!</strong> Please verify the input.
            </Alert>
            : null
          }

          <p>Enter file name without extension.</p> <br/>
          <Form horizontal>
            <FormGroup controlId="inputFileName" validationState={this.getFileNameValidationState()}>
              <Col componentClass={ControlLabel} sm={2}>
                {'File name'}
              </Col>
              <Col sm={4}>
                <FormControl
                  type="text" min="1"
                  max={maxLength}
                  defaultValue={fileName}
                  placeholder="File name"
                  inputRef={ref => { this.inputFileName = ref; }}
                  onChange={this.handleFileNameChange}
                />
              </Col>
              <Col componentClass={ControlLabel} sm={3}>
                Valid: 0-9, a-z, A-Z, - , _
              </Col>
            </FormGroup>
          </Form>
        </div>
      </DialogOkCancel>
    );
  }
}
