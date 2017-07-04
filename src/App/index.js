import React, { Component } from 'react';
import { ButtonToolbar, Button, Glyphicon } from 'react-bootstrap';
import { cfmToHtml } from 'cfm-parser';

import { Header, Footer, MdInput, HtmlOutput, DialogAlert, DialogHelp, DialogOkCancel, DialogFileName } from '../Components';
import { saveIoState, loadIoState} from './Storage';
import { isSaveSupported, saveAsMarkdown, saveAsHtml } from './Export';

import 'prismjs/themes/prism-okaidia.css';
import 'cfm-parser/css/style.css';
import styles from './index.css';

import sample from './Sample.json';

class App extends Component {
  static SAVE_ACTION = {
    markdown: 'markdown',
    html: 'html'
  }

  constructor(props) {
    super(props);
    this.state = {
      mdInput: sample.sample,
      htmlOutput: cfmToHtml(sample.sample),
      refCmInput: null,
      refElOutput: null,
      scrollingInput: false,
      scrollingOutput: false,
      alert: '',
      saveAction: '',
      fileName: 'Untitled',
      sampleLoadDialogHidden: true,
      clearDialogHidden: true,
      helpDialogHidden: true,
      alertDialogHidden: true,
      fileNameDialogHidden: true,
    };
  }

  componentDidMount() {
    const ioState = loadIoState();
    if (ioState) {
      const mdInput = (ioState.mdInput ? ioState.mdInput : sample.sample);
      this.setState({ mdInput, htmlOutput: cfmToHtml(mdInput) });
    }
  }

  componentDidUpdate() {
    const { mdInput } = this.state;
    saveIoState({ mdInput });
  }

  loadSample = () => {
    this.setState({ mdInput: sample.sample, htmlOutput: cfmToHtml(sample.sample) });
    this.setSampleLoadDialogHidden(true);
    this.setAlertDialogHidden(false, 'Sample loaded!');
  };

  resetValue = () => this.setState({ mdInput: '', htmlOutput: '' });

  handleSampleLoad = () => {
    const { mdInput } = this.state;
    if (mdInput === '') {
      this.loadSample();
    } else if (mdInput !== sample.sample){
      this.setSampleLoadDialogHidden(false);
    }
  }

  handleClear = () => {
    const { mdInput } = this.state;
    if (mdInput !== '') {
      this.setClearDialogHidden(false);
    }
  }

  onFileNameSet = (action, fileName) => {
    const { mdInput, htmlOutput } = this.state;
    if (action === App.SAVE_ACTION.markdown) {
      saveAsMarkdown(mdInput, fileName);
    } else if (action === App.SAVE_ACTION.html) {
      saveAsHtml(htmlOutput, fileName);
    }
    this.setFileNameDialogHidden(true);
    this.setAlertDialogHidden(false, 'File generated!');
  }

  showNoSaveDialog = () => this.setAlertDialogHidden(false, 'Browser does not support saving!');

  handleSaveAsMarkdown = () => {
    if (!isSaveSupported()) {
      this.showNoSaveDialog();
      return;
    }
    this.setFileNameDialogHidden(false, App.SAVE_ACTION.markdown);
  }

  handleSaveAsHtml = () => {
    if (!isSaveSupported()) {
      this.showNoSaveDialog();
      return;
    }
    this.setFileNameDialogHidden(false, App.SAVE_ACTION.html);
  }

  setSampleLoadDialogHidden = (sampleLoadDialogHidden = true) => this.setState({ sampleLoadDialogHidden });

  setClearDialogHidden = (clearDialogHidden = true) => this.setState({ clearDialogHidden });

  setAlertDialogHidden = (alertDialogHidden = true, alert = '') => this.setState({ alertDialogHidden, alert });

  setHelpDialogHidden = (helpDialogHidden = true) => this.setState({ helpDialogHidden });

  setFileNameDialogHidden = (fileNameDialogHidden = true, saveAction = '') => this.setState({ fileNameDialogHidden, saveAction });

  onInputChange = (newValue) => {
    this.setState({ mdInput: newValue, htmlOutput: cfmToHtml(newValue) });
  }

  onInputScroll = (scrollInfo) => {
    const { refElOutput, scrollingOutput } = this.state;
    if (!refElOutput) return;

    if (scrollingOutput) {
      this.setState({ scrollingOutput: false });
      return;
    }

    this.setState({ scrollingInput: true });
    const { top, height, clientHeight } = scrollInfo;
    // const topmostLine = refCmInput.lineAtHeight(top, 'local');
    // const rate = refCmInput.heightAtLine(topmostLine, "local", false) / (height - clientHeight);

    const rate = top / (height - clientHeight);
    const scrollPos = Math.round(rate * (refElOutput.scrollHeight - refElOutput.clientHeight));
    if (Math.round(refElOutput.scrollTop - scrollPos)){
      refElOutput.scrollTop = scrollPos;
    }
  }

  onOutputScroll = () => {
    const { refElOutput, refCmInput, scrollingInput } = this.state;
    if (!refElOutput || !refCmInput) return;

    if (scrollingInput) {
      this.setState({ scrollingInput: false });
      return;
    }

    this.setState({ scrollingOutput: true });
    const { height, clientHeight } = refCmInput.getScrollInfo();

    const rate = refElOutput.scrollTop / (refElOutput.scrollHeight - refElOutput.clientHeight);
    const scrollPos = Math.round(rate * (height - clientHeight));
    if (Math.round(refElOutput.scrollTop - scrollPos)){
      refCmInput.scrollTo(null, scrollPos);
    }
  }

  render() {
    const {
      mdInput, htmlOutput,
      alert, saveAction,
      sampleLoadDialogHidden, clearDialogHidden, helpDialogHidden, alertDialogHidden, fileNameDialogHidden
    } = this.state;

    return (
      <div className={`${styles.app} app-container`}>
        <Header />

        <ButtonToolbar className={styles.toolbar}>
          <Button bsStyle="primary" onClick={this.handleSampleLoad} className={styles.toolbarButton}>
            <Glyphicon glyph="tasks" /> <b>Sample Document</b>
          </Button>
          {/*
            <Button bsStyle="info" onClick={() => {}} className={styles.toolbarButton}>
              <Glyphicon glyph="open" /> <b>Upload</b>
            </Button>
          */}
          <Button bsStyle="success" onClick={this.handleSaveAsMarkdown} className={styles.toolbarButton}>
            <Glyphicon glyph="floppy-save" /> <b>Save Markdown</b>
          </Button>
          <Button bsStyle="success" onClick={this.handleSaveAsHtml} className={styles.toolbarButton}>
            <Glyphicon glyph="floppy-save" /> <b>Save HTML</b>
          </Button>
          <Button bsStyle="danger" onClick={() => this.handleClear()} className={styles.toolbarButton}>
            <Glyphicon glyph="trash" /> <b>Clear</b>
          </Button>

          <Button bsStyle="warning" onClick={() => this.setHelpDialogHidden(false)} className={`${styles.toolbarButton} ${styles.toolbarButtonRight}`}>
            <Glyphicon glyph="question-sign" /> <b>Help</b>
          </Button>
        </ButtonToolbar>

        <div className={styles.container} >
          <MdInput
            code={mdInput}
            className={styles.io}
            onInputChange={this.onInputChange}
            onMount={refCmInput => this.setState({ refCmInput })}
            onScroll={this.onInputScroll} />
          <HtmlOutput
            className={styles.io}
            html={htmlOutput}
            onMount={refElOutput => this.setState({ refElOutput })}
            onScroll={this.onOutputScroll} />
        </div>

        {/* Sample */}
        <DialogOkCancel
          txtTitle="Editor is not empty."
          onOk={() => this.loadSample()}
          onCancel={() => this.setSampleLoadDialogHidden(true)}
          hidden={sampleLoadDialogHidden}>
            Clear exisiting document and load sample?
        </DialogOkCancel>

        {/* Reset */}
        <DialogOkCancel
          txtTitle="Confirm clear"
          onOk={() => {
            this.resetValue();
            this.setClearDialogHidden(true);
          }}
          onCancel={() => this.setClearDialogHidden(true)}
          hidden={clearDialogHidden}>
            This action cannot be undone.
        </DialogOkCancel>

        <DialogAlert
          onOk={() => this.setAlertDialogHidden(true)}
          message={alert}
          hidden={alertDialogHidden}
          hideOkButton />

        <DialogHelp
          onOk={() => this.setHelpDialogHidden(true)}
          hidden={helpDialogHidden} />

        {/* File name */}
        <DialogFileName
          action={saveAction}
          onOk={this.onFileNameSet}
          onCancel={() => this.setFileNameDialogHidden(true)}
          hidden={fileNameDialogHidden} />

        <Footer />
      </div>
    );
  }
}

export default App;
