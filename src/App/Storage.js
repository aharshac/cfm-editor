const KEY_APP_STATE = 'appState';
const KEY_IO_STATE = 'ioState';


/* Io */
function saveIoState(state) {
  if (localStorage) localStorage[KEY_IO_STATE] = JSON.stringify(state);
}

function loadIoState() {
  if (!localStorage) return null;
  return JSON.parse(localStorage.getItem(KEY_IO_STATE));
}

function clearIoState() {
  if (localStorage) localStorage.removeItem(KEY_IO_STATE);
}


/* App */
function saveAppState(state) {
  if (localStorage) localStorage[KEY_APP_STATE] = JSON.stringify(state);
}

function loadAppState() {
  if (!localStorage) return null;
  return JSON.parse(localStorage.getItem(KEY_APP_STATE));
}

function clearAppState() {
  if (localStorage) localStorage.removeItem(KEY_APP_STATE);
}

export { saveIoState, loadIoState, clearIoState, saveAppState, loadAppState, clearAppState };
