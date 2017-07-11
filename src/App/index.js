import React, { Component } from 'react';
import { ButtonToolbar, Button, Glyphicon } from 'react-bootstrap';
import { cfmToHtml } from 'cfm-parser';
import debounce from 'lodash.debounce';
// import throttle from 'lodash.throttle';
import copy from 'copy-to-clipboard';

import { Header, Footer, MdInput, HtmlOutput, DialogAlert, DialogHelp, DialogOkCancel, DialogFileName } from '../Components';
import { saveIoState, loadIoState} from './Storage';
import { isSaveSupported, saveAsMarkdown, saveAsHtml } from './Export';
import { encodeInput, decodeHash, getPermalink, getDocHash } from './Permalink';

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
      isScrollingInput: false,
      isScrollingOutput: false,
      docHash: '',
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
    // const ioState = loadIoState();
    // // const mdInput = (ioState && ioState.mdInput ? ioState.mdInput : false);
    // if (ioState && ioState.mdInput) {
    //   const mdInput = ioState.mdInput;
    //   this.setState({ mdInput, htmlOutput: cfmToHtml(mdInput) });
    // }
    this.onHashChange();


    // const hash = getDocHash(window.location.hash);
    //
    // if (mdInput && hash) {
    //   this.setState({ conflictDialogHidden: false, mdInput, docHash: hash });
    // } else if (hash) {
    //   this.setIo(decodeHash(hash));
    // } else if (mdInput) {
    //   this.setIo(mdInput);
    // } else {
    //   this.setIo(sample.sample);
    // }
    this.onInputScroll();
    // window.addEventListener("hashchange", this.onHashChange, false);
  }

  componentDidUpdate() {
    const { mdInput } = this.state;
    saveIoState({ mdInput });
  }

  componentWillUnmount() {
    // window.removeEventListener("hashchange", this.onHashChange, false);
  }

  onHashChange = () => {
    // const mdInput = (this.state.mdInput ? this.state.mdInput : false);
    // this.setState({ mdInput, htmlOutput: cfmToHtml(mdInput) });

    let { mdInput } = this.state;
    if (!mdInput) {
      const ioState = loadIoState();
      mdInput = (ioState && ioState.mdInput ? ioState.mdInput : false);
    }
    const hash = getDocHash(window.location.hash);

    if (mdInput && hash) {
      this.setState({ conflictDialogHidden: false, mdInput, docHash: hash });
      console.log('both');
    } else if (hash) {
      this.setIo(decodeHash(hash));
      console.log('hash');
    } else if (mdInput) {
      this.setIo(mdInput);
      console.log('mdInput');
    } else {
      this.setIo(sample.sample);
      console.log('none');
    }
    this.forceUpdate();
  }

  resolveDocConflict = (discardLocal = false) => {
    const { docHash, mdInput } = this.state;

    if (discardLocal) {
      this.setIo(decodeHash(docHash));
    } else {
      this.setIo(mdInput);
    }

    window.location.hash = '';
    this.setConflictDialogHidden(true);
  }


  setIo = (mdInput) => {
    const htmlOutput = mdInput && mdInput.length > 0 ? cfmToHtml(mdInput) : '';
    const docHash = encodeInput(mdInput);
    // console.log(docHash);
    this.setState({ mdInput, htmlOutput, docHash });

    // const { refCmInput } = this.state;
    // if (refCmInput) {
    //   refCmInput.scrollIntoView({ line: refCmInput.lastLine(), ch: null });
    // }
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

  handleCopyPermalink = () => {
    const { docHash } = this.state;

    if (!docHash) {
      this.setAlertDialogHidden(false, 'Permalink could not be generated. Try again.');
      return;
    }

    const link = getPermalink(docHash);
    if (copy(link)) {
      this.setAlertDialogHidden(false, 'Permalink is copied to the clipboard.');
    }
  }

  onInputChange = debounce((newValue) => {
    // this.setState({ mdInput: newValue, htmlOutput: cfmToHtml(newValue) });
    this.setIo(newValue);
    // this.onInputScroll();
    // this.buildScrollMap();
  }, 10);

  onInputScroll = debounce(() => {
    const { refElOutput, refCmInput, isScrollingOutput } = this.state;
    if (!refElOutput || !refCmInput) return;

    if (isScrollingOutput) {
      this.setState({ isScrollingOutput: false });
      return;
    }

    this.setState({ isScrollingInput: true });

    // if(Object.keys(scrollMap).length === 0) {
    //   this.buildScrollMap();
    // }

    // const { top, height, clientHeight } = refCmInput.getScrollInfo();
    const { top } = refCmInput.getScrollInfo();

    let outputTop = 0;
    const lineNumber = refCmInput.lineAtHeight(top, 'local');
    if (lineNumber > 0) {
      // const range = refCmInput.getLine(0) + refCmInput.getRange({line: 0, ch: null}, {line: lineNumber, ch: null});
      let range = '';
      for (let i = 0; i < lineNumber + 1; i++) {
        range += refCmInput.getLine(i) + '\n';
      }
      // console.log(range);

      const output = cfmToHtml(range);
      const parse = new DOMParser().parseFromString(output, 'text/html');
      const length = parse.body.children.length;
      if (length > 0) {
        const child = refElOutput.children[length - 1];
        if (!child) return;
        outputTop = child.offsetTop + child.offsetHeight;
      }
    }
    // console.log(outputTop);
    refElOutput.scrollTop = outputTop;

    /* Percentage based scrolling */
    // const rate = top / (height - clientHeight);
    // const scrollPos = Math.round(rate * (refElOutput.scrollHeight - refElOutput.clientHeight));
    // if (Math.round(refElOutput.scrollTop - scrollPos)){
    //   refElOutput.scrollTop = scrollPos;
    // }
  }, 100);

  /*
  onOutputScroll = throttle(() => {
    const { refElOutput, refCmInput, isScrollingInput, scrollMap } = this.state;
    if (!refElOutput || !refCmInput) return;

    if (isScrollingInput) {
      this.setState({ isScrollingInput: false });
      return;
    }

    this.setState({ isScrollingOutput: true });

    // if(Object.keys(scrollMap).length === 0) {
    //   this.buildScrollMap();
    // }

    console.log(refElOutput.scrollTop);
    const top = refElOutput.scrollTop;
    for(let i=0; i < Object.keys(scrollMap).length; i++) {
      const obj = scrollMap[i]; //  > 0 ? i-1 : 0
      if (obj.start <= top && top < obj.end && obj.line < refCmInput.lineCount()) {
        refCmInput.scrollTo(null, refCmInput.heightAtLine(Number(obj.line) + 1));
        return;
      }
    }

    // const { height, clientHeight } = refCmInput.getScrollInfo();
    //
    // const rate = refElOutput.scrollTop / (refElOutput.scrollHeight - refElOutput.clientHeight);
    // const scrollPos = Math.round(rate * (height - clientHeight));
    // if (Math.round(refElOutput.scrollTop - scrollPos)){
    //   refCmInput.scrollTo(null, scrollPos);
    // }

    // onScroll={this.onOutputScroll}
  }, 100);
  */

  /* Dialog related */
  setSampleLoadDialogHidden = (sampleLoadDialogHidden = true) => this.setState({ sampleLoadDialogHidden });

  setClearDialogHidden = (clearDialogHidden = true) => this.setState({ clearDialogHidden });

  setAlertDialogHidden = (alertDialogHidden = true, alert = '') => this.setState({ alertDialogHidden, alert });

  setHelpDialogHidden = (helpDialogHidden = true) => this.setState({ helpDialogHidden });

  setFileNameDialogHidden = (fileNameDialogHidden = true, saveAction = '') => this.setState({ fileNameDialogHidden, saveAction });

  setHelpDialogHidden = (helpDialogHidden = true) => this.setState({ helpDialogHidden });

  setConflictDialogHidden = (conflictDialogHidden = true) => this.setState({ conflictDialogHidden });

  render() {
    const {
      mdInput, htmlOutput,
      alert, saveAction,
      sampleLoadDialogHidden, clearDialogHidden, helpDialogHidden, alertDialogHidden, fileNameDialogHidden, conflictDialogHidden
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

          <Button bsStyle="default" onClick={this.handleCopyPermalink} className={styles.toolbarButton}>
            <Glyphicon glyph="copy" /> <b>Copy Permalink</b>
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

        {/* Hash and localStorage conflict */}
          <DialogOkCancel
            txtTitle="Discard document from Local Storage?"
            onOk={() => this.resolveDocConflict(true)}
            onCancel={() => this.resolveDocConflict(false)}
            hidden={conflictDialogHidden}>
              This action cannot be undone.
          </DialogOkCancel>

        <Footer />
      </div>
    );
  }
}

export default App;
