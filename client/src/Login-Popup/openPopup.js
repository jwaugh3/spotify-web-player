let windowObjectReference = null;
let previousUrl = null;

const openSignInWindow = (url, name) => {

  let w = '400'
  let h = '600'

  //center popup to screen
  const dualScreenLeft = window.screenLeft !==  undefined ? window.screenLeft : window.screenX;
  const dualScreenTop = window.screenTop !==  undefined   ? window.screenTop  : window.screenY;

  const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth
  const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight


  const systemZoom = width / window.screen.availWidth;
  const left = (width - w) / 2 / systemZoom + dualScreenLeft
  const top = (height - h) / 2 / systemZoom + dualScreenTop

  // window features
  const strWindowFeatures = `toolbar=no, menubar=no, width=400, height=600, top=${top}, left=${left}`;

  if (windowObjectReference === null || windowObjectReference.closed) {
    /* if the pointer to the window object in memory does not exist
    or if such pointer exists but the window was closed */
    windowObjectReference = window.open(url, name, strWindowFeatures);
  } else if (previousUrl !== url) {
    /* if the resource to load is different,
    then we load it in the already opened secondary window and then
    we bring such window back on top/in front of its parent window. */
    windowObjectReference = window.open(url, name, strWindowFeatures);
    windowObjectReference.focus();
  } else {
    /* else the window reference must exist and the window
    is not closed; therefore, we can bring it back on top of any other
    window with the focus() method. There would be no need to re-create
    the window or to reload the referenced resource. */
    windowObjectReference.focus();
  }

  // assign the previous URL
  previousUrl = url;
 };

 export default openSignInWindow