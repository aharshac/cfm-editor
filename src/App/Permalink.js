import { inflate, deflate } from 'pako';

const encodeInput = input => {
  try {
    return btoa( // base64 so url-safe
        deflate( // gzip
          unescape(
            encodeURIComponent( // convert to utf8
              input
            )
          ), { to: 'string', level: 7 }
        )
      );
  } catch (__) {
    return false;
  }
};

const decodeHash = encoded => {
  try {
    return decodeURIComponent(
        escape(
          inflate(
            atob(
              encoded
            ), { to: 'string', level: 7 }
          )
        )
      );
  } catch (__) {
    return false;
  }
};

const getPermalink = encoded => {
  return window.location.href.replace('#', '') + '#doc:' + encoded;
};

const getDocHash = () => {
  if(!window.location.hash) {
    return false;
  }

  const hash = window.location.hash.replace(/^#/, '');
  if (hash.length < 5 || hash.slice(0, 4) !== 'doc:') {
    return false;
  } else {
    return hash.slice(4);
  }
};

export { encodeInput, decodeHash, getPermalink, getDocHash };
