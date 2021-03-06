import React, { Component } from 'react';
import { ButtonToolbar, Button, Glyphicon } from 'react-bootstrap';
import { cfmToHtml } from 'cfm-parser';
import debounce from 'lodash.debounce';
// import throttle from 'lodash.throttle';
// import copy from 'copy-to-clipboard';

import { Header, Footer, MdInput, HtmlOutput, DialogAlert, DialogHelp, DialogOkCancel, DialogFileName } from '../Components';
import { saveIoState, loadIoState} from './Storage';
import { isSaveSupported, saveAsMarkdown, saveAsHtml } from './Export';
// import { encodeInput, decodeHash, getPermalink, getDocHash } from './Permalink';

import 'prismjs/components/prism-markdown.js';
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
      mdInput: '',
      htmlOutput: '',
      refCmInput: null,
      refElOutput: null,
      alert: '',
      saveAction: '',
      fileName: 'Untitled',
      sampleLoadDialogHidden: true,
      clearDialogHidden: true,
      helpDialogHidden: true,
      alertDialogHidden: true,
      fileNameDialogHidden: true,
      conflictDialogHidden: true
    };
  }

  componentDidMount() {
    // const hash = getDocHash(window.location.hash);
    //
    // if (hash) {
    //   this.setIo(decodeHash(hash));
    //   return;
    // }

    const ioState = loadIoState();
    if (ioState && ioState.mdInput) {
      this.setIo(ioState.mdInput);
      return;
    }

    this.setIo(sample.sample);
  }

  componentDidUpdate() {
    const { mdInput } = this.state;
    saveIoState({ mdInput });
  }

  componentWillUnmount() {

  }


  setIo = (mdInput) => {
    const htmlOutput = mdInput && mdInput.length > 0 ? cfmToHtml(mdInput) : '';
    this.setState({ mdInput, htmlOutput });

    const { refCmInput } = this.state;
    if (refCmInput) {
      refCmInput.scrollIntoView({ line: refCmInput.lastLine(), ch: null });
    }
    this.onInputScroll();
  }

  loadSample = () => {
    // this.setState({ mdInput: sample.sample, htmlOutput: cfmToHtml(sample.sample) });
    this.setIo(sample.sample);
    this.setSampleLoadDialogHidden(true);
    this.setAlertDialogHidden(false, 'Sample loaded!');
  };

  resetValue = () => this.setIo(''); // this.setState({ mdInput: '', htmlOutput: '' });

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

  /*
  handleCopyPermalink = () => {
    const { mdInput } = this.state;
    const docHash = encodeInput(mdInput);

    if (!docHash) {
      this.setAlertDialogHidden(false, 'Permalink could not be generated. Try again.');
      return;
    }

    const link = getPermalink(docHash);
    if (copy(link)) {
      this.setAlertDialogHidden(false, 'Permalink is copied to the clipboard.');
    }
  }
  */

  onInputChange = debounce((newValue) => {
    this.setIo(newValue);
  }, 10);

  onInputScroll = debounce(() => {
    const { refElOutput, refCmInput } = this.state;
    if (!refElOutput || !refCmInput) return;

    const { top } = refCmInput.getScrollInfo();

    let outputTop = 0;
    const lineNumber = refCmInput.lineAtHeight(top, 'local');
    if (lineNumber > 0) {
      let range = '';
      for (let i = 0; i < lineNumber + 1; i++) {
        range += refCmInput.getLine(i) + '\n';
      }

      const output = cfmToHtml(range);
      const parse = new DOMParser().parseFromString(output, 'text/html');
      const length = parse.body.children.length;
      if (length > 0) {
        const child = refElOutput.children[length - 1];
        if (!child) return;
        outputTop = child.offsetTop + child.offsetHeight;
      }
    }

    refElOutput.scrollTop = outputTop;
  }, 100);

  /* Dialog related */
  setSampleLoadDialogHidden = (sampleLoadDialogHidden = true) => this.setState({ sampleLoadDialogHidden });

  setClearDialogHidden = (clearDialogHidden = true) => this.setState({ clearDialogHidden });

  setAlertDialogHidden = (alertDialogHidden = true, alert = '') => this.setState({ alertDialogHidden, alert });

  setHelpDialogHidden = (helpDialogHidden = true) => this.setState({ helpDialogHidden });

  setFileNameDialogHidden = (fileNameDialogHidden = true, saveAction = '') => this.setState({ fileNameDialogHidden, saveAction });

  setHelpDialogHidden = (helpDialogHidden = true) => this.setState({ helpDialogHidden });

  render() {
    const {
      mdInput, htmlOutput,
      alert, saveAction,
      sampleLoadDialogHidden, clearDialogHidden, helpDialogHidden, alertDialogHidden, fileNameDialogHidden,
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

          {/*
            <Button bsStyle="default" onClick={this.handleCopyPermalink} className={styles.toolbarButton}>
              <Glyphicon glyph="copy" /> <b>Copy Permalink</b>
            </Button>
          */}

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
            onMount={refElOutput => this.setState({ refElOutput })} />
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
