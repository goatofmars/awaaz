(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

exports.homedir = function () {
	return '/'
};

},{}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){

//import all the pages here which you want to be in the app and use engine.get.pageModule api to get the page
const listPage = require('./pages/listPage/page');
const projectPage = require('./pages/projectPage/page');

//declare the first page module here
const startPage = listPage;

engine.add.object("api_url","http://localhost:8000");

const supers = require('./supers');
supers.init();

/*set the base url to the native vegana cdn,
or if hosting on non native platform please
set the baseurl to where the files for the project are held*/
const baseHref = null;

//------------------------------------------------------------------------------
//dont fuck with anything below
engine.router.set.baseHref(baseHref);
if(engine.router.active.page == null){
  startPage.init();
}

},{"./pages/listPage/page":6,"./pages/projectPage/page":7,"./supers":8}],4:[function(require,module,exports){
//controllers
const log = false;                        //turn on to log engine.common.tell string inputs
const compRef = '-comp-loader';             //dont worry about this
const type = 'comp';                      //type of app

//ids
var parentId;
var compId;

const init = (pid) => {         //pid referes to the parentPageId, pass this var when you init thiscomp.

  if(pid == null || pid == undefined){
    return engine.common.error('no_parent_page_ref_found'); //common error logger
  }

  parentId = pid;               //set parent page ref
  compId = parentId + compRef;  //set comp id
  engine.make.init.comp(compId,parentId,'comp');
  build();                      //start build you can also start fetch here.

}
function build(){

  const main = engine.make.div({
    parent:compId,
    class:'page-list-comp-loader'
  });

  engine.view.hide(main);

  const card = engine.make.div({
    parent:main,
    class:'card page-list-comp-loader-card'
  });

    engine.make.image({
      parent:card,
      class:'page-list-comp-loader-card-image',
      type:'local',
      location:'assets/images/loader.gif'
    });

  if(true){
    engine.make.div({
      parent:main,
      class:'page-list-comp-loader-background'
    });
  }

  engine.add.function('loader',()=>{
    return {
      show:()=>{
        engine.view.show(main);
      },
      hide:()=>{
        engine.view.hide(main);
      }
    }
  });

  return true; //always return after build it can be

}

module.exports = {init:init,ref:compRef,type:type,trackers:null}

},{}],5:[function(require,module,exports){
//controllers
const log = false;                        //turn on to log engine.common.tell string inputs
const compRef = '-comp-menu';             //dont worry about this
const type = 'comp';                      //type of app

//ids
var parentId;
var compId;

const init = (pid) => {         //pid referes to the parentPageId, pass this var when you init thiscomp.

  if(pid == null || pid == undefined){
    return engine.common.error('no_parent_page_ref_found'); //common error logger
  }

  parentId = pid;               //set parent page ref
  compId = parentId + compRef;  //set comp id
  engine.make.init.comp(compId,parentId,'comp');
  build();                      //start build you can also start fetch here.

}

function build(){

  const main = engine.make.div({
    parent:compId,
    class:'page-list-comp-menu'
  });

  const left = engine.make.div({
    parent:main,
    class:'page-list-comp-menu-left'
  });

    engine.make.div({
      parent:left,
      class:'page-list-comp-menu-left-logo',
      text:'awaaz'
    });

  const right = engine.make.div({
    parent:main,
    class:'page-list-comp-menu-right'
  });

    make_link(right,{tag:'Twitter',link:'https://twitter.com/myCrazyGoat'});
    make_link(right,{tag:'Framework',link:'https://vegana.github.io/'});
    make_link(right,{tag:'Git',link:'https://github.com/gzbakku'});
    make_link(right,{tag:'Npm',link:'https://www.npmjs.com/~gzbakku'});

  return true;

}

function make_link(p,link){
  engine.make.div({
    parent:p,
    class:'page-list-comp-menu-right-link',
    text:link.tag,
    function:()=>{
      window.open(link.url);
    }
  });
}

module.exports = {init:init,ref:compRef,type:type,trackers:null}

},{}],6:[function(require,module,exports){
//controllers
const log = false;
const type = 'page';

//ids
const pageId = "page-list";
const pageName = 'listPage';

//init page
const init = () => {
  engine.make.init.page(pageId,"page");  //init page
  build();                               //start build
}

//these trackers will be triggered when this module is routed
const trackers = {
  title:'sample page title',
  meta:[
    {
      name:'description',
      content:'this is a sample page description'
    },
    {
      name:'keywords',
      content:'page,vegana'
    }
  ],
  function_data:{},
  //function will be triggered with the function data as input when the module is routed to.
  function:(function_data)=>{}
};

const menuComp = require('./comps/menuComp/comp');
const projectComp = require('./comps/menuComp/comp');
const loaderComp = require('./comps/loaderComp/comp');

//build page
async function build(){

  engine.add.comp("menuComp",menuComp);

  menuComp.init(pageId);
  loaderComp.init(pageId);

  const messages = [
    '1. hey this is the sample app you asked for its in js frameowrk i developed.',
    '2. the api does not contains any db',
    '3. projects are wipped on regular intervals'
  ];

  const messages_cont = engine.make.div({
    parent:pageId,
    class:'card page-list-messages'
  })

    for(let message of messages){
      engine.make.div({
        parent:messages_cont,
        class:'page-list-messages-message',
        text:message
      })
    }

  if(false){
    return;
  }

  const query = await engine.global.function.request({
    to:'/list/',
    body:{}
  });

  console.log(query);

  return true; //always return after the build completes

}

//do not change current exports you are free to add your own though.
let pageControllers = {
  init:init,
  ref:pageId,
  type:type,
  name:pageName,
  contModules:{},
  contList:{},
  trackers:trackers
};
module.exports = pageControllers;
window.pageModules[pageName] = pageControllers;

},{"./comps/loaderComp/comp":4,"./comps/menuComp/comp":5}],7:[function(require,module,exports){
//controllers
const log = false;
const type = 'page';

//ids
const pageId = "page-project";
const pageName = 'projectPage';

//init page
const init = () => {
  engine.make.init.page(pageId,"page");  //init page
  build();                               //start build
}

//these trackers will be triggered when this module is routed
const trackers = {
  title:'sample page title',
  meta:[
    {
      name:'description',
      content:'this is a sample page description'
    },
    {
      name:'keywords',
      content:'page,vegana'
    }
  ],
  function_data:{},
  //function will be triggered with the function data as input when the module is routed to.
  function:(function_data)=>{}
};

//build page
function build(){

  engine.common.tell('building',log);

  //sample greetings
  let greetings = engine.make.div({
    id:"greetings",
    parent:pageId,
    class:'greetings',
    text:'greetings this is the project page'
  });

  //import conts when required to build required objects faster

  return true; //always return after the build completes

}

//do not change current exports you are free to add your own though.
let pageControllers = {
  init:init,
  ref:pageId,
  type:type,
  name:pageName,
  contModules:{},
  contList:{},
  trackers:trackers
};
module.exports = pageControllers;
window.pageModules[pageName] = pageControllers;

},{}],8:[function(require,module,exports){

const api_url = engine.global.object.api_url;

const functions = {
  request:async (object,log)=>{
    const build = {
      method:'POST',
      url:api_url + object.to,
      body:object.body
    };
    if(log){
      console.log(build);
    }
    engine.global.function.loader().show();
    const run = await engine.request(build);
    engine.global.function.loader().hide();
    if(log){
      console.log(run);
    }
    if(!run){
      console.log(build);
      console.log(run);
      console.log("!!! request failed");
      return false;
    }
    if(!run.hasOwnProperty("result")){
      console.log(build);
      console.log(run);
      console.log("!!! invalid request");
      return false;
    }
    if(run.result === "success"){
      if(run.hasOwnProperty("data")){
        return run.data;
      }
      return true;
    }
    console.log(build);
    console.log(run);
    console.log("!!! request error");
    return false;
  }
};

module.exports = {
  init:()=>{
    for(let key in functions){
      engine.add.function(key,functions[key]);
    }
  }
};

},{}],9:[function(require,module,exports){
const engineModule = require('vegana-engine');
window.pageModules = {};
window.pageList = {};
window.engine = engineModule;
const app = require('./app/index.js');

},{"./app/index.js":3,"vegana-engine":20}],10:[function(require,module,exports){
var charenc = {
  // UTF-8 encoding
  utf8: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
    }
  },

  // Binary encoding
  bin: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      for (var bytes = [], i = 0; i < str.length; i++)
        bytes.push(str.charCodeAt(i) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      for (var str = [], i = 0; i < bytes.length; i++)
        str.push(String.fromCharCode(bytes[i]));
      return str.join('');
    }
  }
};

module.exports = charenc;

},{}],11:[function(require,module,exports){
(function() {
  var base64map
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

  crypt = {
    // Bit-wise rotation left
    rotl: function(n, b) {
      return (n << b) | (n >>> (32 - b));
    },

    // Bit-wise rotation right
    rotr: function(n, b) {
      return (n << (32 - b)) | (n >>> b);
    },

    // Swap big-endian to little-endian and vice versa
    endian: function(n) {
      // If number given, swap endian
      if (n.constructor == Number) {
        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
      }

      // Else, assume array and swap all items
      for (var i = 0; i < n.length; i++)
        n[i] = crypt.endian(n[i]);
      return n;
    },

    // Generate an array of any length of random bytes
    randomBytes: function(n) {
      for (var bytes = []; n > 0; n--)
        bytes.push(Math.floor(Math.random() * 256));
      return bytes;
    },

    // Convert a byte array to big-endian 32-bit words
    bytesToWords: function(bytes) {
      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
        words[b >>> 5] |= bytes[i] << (24 - b % 32);
      return words;
    },

    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function(words) {
      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a hex string
    bytesToHex: function(bytes) {
      for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
      }
      return hex.join('');
    },

    // Convert a hex string to a byte array
    hexToBytes: function(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
    },

    // Convert a byte array to a base-64 string
    bytesToBase64: function(bytes) {
      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++)
          if (i * 8 + j * 6 <= bytes.length * 8)
            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
          else
            base64.push('=');
      }
      return base64.join('');
    },

    // Convert a base-64 string to a byte array
    base64ToBytes: function(base64) {
      // Remove non-base-64 characters
      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
          imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
      }
      return bytes;
    }
  };

  module.exports = crypt;
})();

},{}],12:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],13:[function(require,module,exports){
(function(){
  var crypt = require('crypt'),
      utf8 = require('charenc').utf8,
      isBuffer = require('is-buffer'),
      bin = require('charenc').bin,

  // The core
  md5 = function (message, options) {
    // Convert to byte array
    if (message.constructor == String)
      if (options && options.encoding === 'binary')
        message = bin.stringToBytes(message);
      else
        message = utf8.stringToBytes(message);
    else if (isBuffer(message))
      message = Array.prototype.slice.call(message, 0);
    else if (!Array.isArray(message))
      message = message.toString();
    // else, assume byte array already

    var m = crypt.bytesToWords(message),
        l = message.length * 8,
        a =  1732584193,
        b = -271733879,
        c = -1732584194,
        d =  271733878;

    // Swap endian
    for (var i = 0; i < m.length; i++) {
      m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
             ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
    }

    // Padding
    m[l >>> 5] |= 0x80 << (l % 32);
    m[(((l + 64) >>> 9) << 4) + 14] = l;

    // Method shortcuts
    var FF = md5._ff,
        GG = md5._gg,
        HH = md5._hh,
        II = md5._ii;

    for (var i = 0; i < m.length; i += 16) {

      var aa = a,
          bb = b,
          cc = c,
          dd = d;

      a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
      d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
      c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
      b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
      a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
      d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
      c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
      b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
      a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
      d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
      c = FF(c, d, a, b, m[i+10], 17, -42063);
      b = FF(b, c, d, a, m[i+11], 22, -1990404162);
      a = FF(a, b, c, d, m[i+12],  7,  1804603682);
      d = FF(d, a, b, c, m[i+13], 12, -40341101);
      c = FF(c, d, a, b, m[i+14], 17, -1502002290);
      b = FF(b, c, d, a, m[i+15], 22,  1236535329);

      a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
      d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
      c = GG(c, d, a, b, m[i+11], 14,  643717713);
      b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
      a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
      d = GG(d, a, b, c, m[i+10],  9,  38016083);
      c = GG(c, d, a, b, m[i+15], 14, -660478335);
      b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
      a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
      d = GG(d, a, b, c, m[i+14],  9, -1019803690);
      c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
      b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
      a = GG(a, b, c, d, m[i+13],  5, -1444681467);
      d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
      c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
      b = GG(b, c, d, a, m[i+12], 20, -1926607734);

      a = HH(a, b, c, d, m[i+ 5],  4, -378558);
      d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
      c = HH(c, d, a, b, m[i+11], 16,  1839030562);
      b = HH(b, c, d, a, m[i+14], 23, -35309556);
      a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
      d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
      c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
      b = HH(b, c, d, a, m[i+10], 23, -1094730640);
      a = HH(a, b, c, d, m[i+13],  4,  681279174);
      d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
      c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
      b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
      a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
      d = HH(d, a, b, c, m[i+12], 11, -421815835);
      c = HH(c, d, a, b, m[i+15], 16,  530742520);
      b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

      a = II(a, b, c, d, m[i+ 0],  6, -198630844);
      d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
      c = II(c, d, a, b, m[i+14], 15, -1416354905);
      b = II(b, c, d, a, m[i+ 5], 21, -57434055);
      a = II(a, b, c, d, m[i+12],  6,  1700485571);
      d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
      c = II(c, d, a, b, m[i+10], 15, -1051523);
      b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
      a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
      d = II(d, a, b, c, m[i+15], 10, -30611744);
      c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
      b = II(b, c, d, a, m[i+13], 21,  1309151649);
      a = II(a, b, c, d, m[i+ 4],  6, -145523070);
      d = II(d, a, b, c, m[i+11], 10, -1120210379);
      c = II(c, d, a, b, m[i+ 2], 15,  718787259);
      b = II(b, c, d, a, m[i+ 9], 21, -343485551);

      a = (a + aa) >>> 0;
      b = (b + bb) >>> 0;
      c = (c + cc) >>> 0;
      d = (d + dd) >>> 0;
    }

    return crypt.endian([a, b, c, d]);
  };

  // Auxiliary functions
  md5._ff  = function (a, b, c, d, x, s, t) {
    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._gg  = function (a, b, c, d, x, s, t) {
    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._hh  = function (a, b, c, d, x, s, t) {
    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._ii  = function (a, b, c, d, x, s, t) {
    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };

  // Package private blocksize
  md5._blocksize = 16;
  md5._digestsize = 16;

  module.exports = function (message, options) {
    if (message === undefined || message === null)
      throw new Error('Illegal argument ' + message);

    var digestbytes = crypt.wordsToBytes(md5(message, options));
    return options && options.asBytes ? digestbytes :
        options && options.asString ? bin.bytesToString(digestbytes) :
        crypt.bytesToHex(digestbytes);
  };

})();

},{"charenc":10,"crypt":11,"is-buffer":12}],14:[function(require,module,exports){
(function (process){
/* 
(The MIT License)
Copyright (c) 2014-2019 Halász Ádám <mail@adamhalasz.com>
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

//  Unique Hexatridecimal ID Generator
// ================================================

//  Dependencies
// ================================================
var pid = process && process.pid ? process.pid.toString(36) : '' ;
var address = '';
if(typeof __webpack_require__ !== 'function'){
    var mac = '', networkInterfaces = require('os').networkInterfaces();
    for(let interface_key in networkInterfaces){
        const networkInterface = networkInterfaces[interface_key];
        const length = networkInterface.length;
        for(var i = 0; i < length; i++){
            if(networkInterface[i].mac && networkInterface[i].mac != '00:00:00:00:00:00'){
                mac = networkInterface[i].mac; break;
            }
        }
    }
    address = mac ? parseInt(mac.replace(/\:|\D+/gi, '')).toString(36) : '' ;
} 

//  Exports
// ================================================
module.exports = module.exports.default = function(prefix, suffix){ return (prefix ? prefix : '') + address + pid + now().toString(36) + (suffix ? suffix : ''); }
module.exports.process = function(prefix, suffix){ return (prefix ? prefix : '') + pid + now().toString(36) + (suffix ? suffix : ''); }
module.exports.time    = function(prefix, suffix){ return (prefix ? prefix : '') + now().toString(36) + (suffix ? suffix : ''); }

//  Helpers
// ================================================
function now(){
    var time = Date.now();
    var last = now.last || time;
    return now.last = time > last ? time : last + 1;
}

}).call(this,require('_process'))
},{"_process":2,"os":1}],15:[function(require,module,exports){
const common = require('./common');
const log = false;

module.exports = {

  object : function(key,object){
    common.tell('adding global function',log);
    if(!key){
      return common.error('not_found-key');
    }
    if(!object){
      return common.error('not_found-object');
    }
    engine['global']['object'][key] = object;
    return true;
  },

  function : function(key,func){
    common.tell('adding global function',log);
    if(!key){
      return common.error('not_found-key');
    }
    if(!func){
      return common.error('not_found-func');
    }
    engine['global']['function'][key] = func;
    return true;
  },

  comp : function(key,mod){
    common.tell('adding global comp',log);
    if(!key){
      return common.error('not_found-key');
    }
    if(!mod){
      return common.error('not_found-module');
    }
    engine['global']['comp'][key] = mod;
    return true;
  }

};

},{"./common":17}],16:[function(require,module,exports){
module.exports= {

  hover : function(id,func){

    if(!id || !func){
      return engine.common.error('not_found-id/function=>binder-hover');
    }

    let get = document.getElementById(id);
    if(get == null){
      return engine.common.error('invalid_id');
    }

    get.addEventListener('mouseenter',()=>{
      func(id);
    });
    return id;

  },

  click : function(id,func){

    if(!id || !func){
      return engine.common.error('not_found-id/function=>binder-click');
    }

    let get = document.getElementById(id);
    if(get == null){
      return engine.common.error('invalid_id');
    }

    get.addEventListener('click',()=>{
      func(id);
    });
    return id;

  },

  files : function(id){

    if(id == null){
      return engine.common.error('no_id_found');
    }

    let get = document.getElementById(id);
    if(get == null){
      return engine.common.error('invalid_id');
    }

    return get.files;

  },

  text : function(id){

    if(id == null){
      return engine.common.error('no_id_found');
    }

    let get = document.getElementById(id);
    if(get == null){
      return engine.common.error('invalid_id');
    }

    return get.value;

  },

  number : function(id){

    if(id == null){
      return engine.common.error('no_id_found');
    }

    let get = document.getElementById(id);
    if(get == null){
      return engine.common.error('invalid_id');
    }

    if(Number(get.value)){
      return Number(get.value);
    } else if(get.value === '0'){
      return 0;
    } else {
      return false;
    }

  },

  value : function(id){

    if(id == null){
      return engine.common.error('no_id_found');
    }

    let get = document.getElementById(id);
    if(get == null){
      return engine.common.error('invalid_id');
    }

    if(get.value){
      return get.value;
    } else if(get.innerHTML){
      return get.innerHTML;
    } else {
      return false;
    }

  },

  active : function(id){

    if(id == null){
      return engine.common.error('no_id_found');
    }
    let get = document.getElementById(id);
    if(get == null){
      return engine.common.error('invalid_id');
    }

    if(get.checked){
      return true;
    } else {
      return false;
    }

  },

  boolean : function(id){

    if(id == null){
      return engine.common.error('no_id_found');
    }

    let get = document.getElementById(id);
    if(get == null){
      return engine.common.error('invalid_id');
    }

    let value = get.value;

    try{
      return JSON.parse(value);
    } catch(err){
      return null;
    }

  }

};

},{}],17:[function(require,module,exports){
module.exports= {

  kill : false,

  tell : function(message,control){
    if(control == true || this.kill == true){
      console.log('>>> ' + message);
    }
    return true;
  },

  error : function(error,data){
    if(data){
      console.log(data);
    }
    console.log('!!! ' + error);
    return false;
  }

};

},{}],18:[function(require,module,exports){
var db = {};

module.exports = {

  get : function(tag,where){

    if(typeof(tag) !== 'string'){
      return engine.common.error('invalid_tag');
    }
    if(!where){
      where = 'mem';
    }

    if(where == 'mem'){
      if(db.hasOwnProperty(tag) == false){
        return null;
      } else {
        return db[tag];
      }
    }
    if(where == 'session'){
      if(sessionStorage.hasOwnProperty(tag) == false){
        return null;
      } else {
        return sessionStorage[tag];
      }
    }
    if(where == 'local'){
      if(localStorage.hasOwnProperty(tag) == false){
        return null;
      } else {
        return localStorage[tag];
      }
    }

  },

  set : function(tag,value,where){

    if(typeof(tag) !== 'string'){
      return engine.common.error('invalid_tag');
    }
    if(!where){
      where = 'mem';
    }
    if(typeof(value) == 'object'){
      value = JSON.stringify(value);
    }
    if(typeof(value) !== 'string'){
      value = value.toString();
    }

    if(where == 'mem'){
      if(!db[tag]){
        db[tag] = value;
        return true;
      } else {
        return false;
      }
    }
    if(where == 'session'){
      if(!sessionStorage[tag]){
        sessionStorage.setItem(tag,value);
        return true;
      } else {
        return false;
      }
    }
    if(where == 'local'){
      if(!localStorage[tag]){
        localStorage.setItem(tag,value);
        return true;
      } else {
        return false;
      }
    }

  },

  reset : function(tag,value,where){

    if(typeof(tag) !== 'string'){
      return engine.common.error('invalid_tag');
    }
    if(!where){
      where = 'mem';
    }
    if(typeof(value) == 'object'){
      value = JSON.stringify(value);
    }
    if(typeof(value) !== 'string'){
      value = value.toString();
    }

    if(where == 'mem'){
      db[tag] = value;
      return true;
    }
    if(where == 'session'){
      sessionStorage.setItem(tag,value);
      return true;
    }
    if(where == 'local'){
      localStorage.setItem(tag,value);
      return true;
    }

  }

}

},{}],19:[function(require,module,exports){
module.exports = {

  platform:(data)=>{

    if(!data){
      if(window.hasOwnProperty('is_cordova')){
        return 'cordova';
      }
      if(window.hasOwnProperty('is_electron')){
        return 'electron';
      }
      data = 'platform';
    }

    if(data == 'electron'){
      if(window.hasOwnProperty('is_electron')){
        return true;
      } else {
        return false;
      }
    }

    if(data == 'cordova'){
      if(window.hasOwnProperty('is_cordova')){
        return true;
      } else {
        return false;
      }
    }

    let w = document.body.offsetWidth;
    let h = Math.max(window.innerHeight, document.body.clientHeight);
    let ans;

    if(w >= h){
      if(data == 'platform'){
        ans = 'pc';
      } else if(data == 'mobile'){
        ans = false;
      } else if(data == 'pc'){
        ans = true;
      }
    }

    if(w < h){
      if(data == 'platform'){
        ans = 'mobile';
      } else if(data == 'mobile'){
        ans = true;
      } else if(data == 'pc'){
        ans = false;
      }
    }

    return ans;

  },

  pageModule : function(pageName){

    if(window.pageModules[pageName]){
      return window.pageModules[pageName];
    } else {
      return null;
    }

  },

  contName : function(contId){

    if(!contId || typeof(contId) !== 'string'){
      return engine.common.error('invalid/not_found-contId');
    }

    if(!contId.match('-')){
      return engine.common.error('invalid-contId');
    }

    let name = contId.split('-')[3];
    return name + 'Cont';

  },

  contModule : function(pageName,contName){

    if(!pageName || typeof(pageName) !== 'string'){
      return engine.common.error('invalid/not_found-pageName');
    }
    if(!contName || typeof(contName) !== 'string'){
      return engine.common.error('invalid/not_found-contName');
    }

    let pool = window.pageModules[pageName].contModules;

    if(pool[contName]){
      return pool[contName];
    } else {
      return false;
    }

  },

  panelModule : function(pageName,contName,panelName){

    if(!pageName || typeof(pageName) !== 'string'){
      return engine.common.error('invalid/not_found-pageName');
    }
    if(!contName || typeof(contName) !== 'string'){
      return engine.common.error('invalid/not_found-contName');
    }
    if(!panelName || typeof(panelName) !== 'string'){
      return engine.common.error('invalid/not_found-panelName');
    }

    let pool = window.pageModules[pageName].contModules[contName].panelModules[panelName];

    if(pool){
      return pool;
    } else {
      return false;
    }

  },

  rowByTdId : function(id){

    if(id==null){
      return engine.common.error('not_found-td_id');
    }
    if(!id.match('-') || !id.match('row')){
      return engine.common.error('invalid-td_id');
    }
    let array = id.split('-');
    let rowIndex = array.indexOf('row') + 2;
    let rowId = null;
    for(var i=0;i<rowIndex;i++){
      if(rowId == null){
        rowId = array[i];
      } else {
        rowId = rowId + '-' + array[i];
      }
    }
    return rowId;
  },

  divIdByEvent : function(e){

    if(navigator.userAgent.indexOf("Chrome") != -1){
      return e.path[0].id;
    }
    if(navigator.userAgent.indexOf("Firefox") != -1){
      return e.target.id;
    }

    return false;

  },

  body : {

    width : function(){
      return document.body.offsetWidth;
    },

    height : function(){
      return document.body.offsetHeight;
    }

  },

};

},{}],20:[function(require,module,exports){
const make = require('./make');
const view = require('./view');
const router = require('./router');
const common = require('./common');
const binder = require('./binder');
const loader = require('./loader');
const session = require('./session');
const request = require('./request');
const get = require('./get');
const wet = require('./wet');
const validate = require('./validate');
const set = require('./set');
const add = require('./add');
const data = require('./data');
const time = require('./time');
const params = require('./params');
const meta = require('./meta');

const md5 = require('md5');
const uniqid = require('uniqid');

//common.tell('one');

let hooks = {
  pages:{},
  conts:{},
  panels:{},
  comps:{}
};

module.exports = {
  meta:meta,
  add:add,
  binder:binder,
  make:make,
  view:view,
  router:router,
  common:common,
  loader:loader,
  session:session,
  request:request.send,
  validate:validate,
  get:get,
  wet:wet,
  set:set,
  data:data,
  time:time,
  params:params,
  global:{
    function:{},
    comp:new Proxy({},{
      set(obj, prop, value){
        obj[prop] = value;
        if(hooks.comps.hasOwnProperty(prop) == true){
          hooks.comps[prop]();
        }
      }
    }),
    object:{}
  },
  hooks:hooks,
  md5:md5,
  uniqid:uniqid,
  app_version:null
};

},{"./add":15,"./binder":16,"./common":17,"./data":18,"./get":19,"./loader":21,"./make":22,"./meta":33,"./params":34,"./request":35,"./router":36,"./session":42,"./set":43,"./time":44,"./validate":45,"./view":46,"./wet":47,"md5":13,"uniqid":14}],21:[function(require,module,exports){
const log = false;
const httpMarker = 'http://';

module.exports = {

  load : {

    image:function(url){
      let img=new Image();
      img.src=url;
    },

    js : function(options){

      return new Promise((resolve,reject)=>{

        engine.common.tell('loading page module',log);

        let error;

        if(!engine.validate.json({
          type:{type:'string',options:['local','url']},
          url:{type:'string',max:4048}
        },options)){
          error = 'invalid/not_found-compName';
          reject(error);
        }

        let location;

        if(options.type == 'local'){
          if(window.hasOwnProperty('is_electron') || window.hasOwnProperty('is_cordova')){
            location = 'js/' + options.url;
          } else {
            location = baseHref + '/js/' + options.url;
          }
        }
        if(options.type == 'url'){
          location = options.url;
        }

        let parent = document.getElementsByTagName("head")[0];

        let scp = document.createElement('script');
        scp.type = "text/javascript";
        scp.src = location;

        scp.onload  = function(){
          engine.common.tell('js_loaded',log);
          resolve(true);
        };

        scp.onreadystatechange = function(){
          engine.common.tell('js_loaded',log);
          resolve(true);
        };

        scp.onerror = function(e){
          console.error(e);
          engine.common.error('failed-load_js');
          error = 'failed-load_js';
          reject(error);
        }

        parent.appendChild(scp);

      });

    },

    comp : function(compName){

      return new Promise((resolve,reject)=>{

        engine.common.tell('loading page module',log);

        let error;

        if(!compName || typeof(compName) !== 'string'){
          error = 'invalid/not_found-compName';
          reject(error);
        }
        if(engine.global.comp.hasOwnProperty(compName)){
          error = 'global_comp-already-loaded';
          reject(error);
        }

        let location;
        if(window.hasOwnProperty('is_electron') || window.hasOwnProperty('is_cordova')){
          location = 'js/globals/' + compName + 'Comp/globalComp.js';
        } else {
          location = baseHref + '/js/globals/' + compName + 'Comp/globalComp.js';
        }

        let parent = document.getElementsByTagName("head")[0];

        let scp = document.createElement('script');
        scp.type = "text/javascript";
        scp.src = location;

        scp.onload  = function(){
          engine.common.tell('global_comp_loaded',log);
          resolve(true);
        };

        scp.onreadystatechange = function(){
          engine.common.tell('global_comp_loaded',log);
          resolve(true);
        };

        scp.onerror = function(){
          engine.common.error('failed-compLoad');
          error = 'failed-compLoad';
          reject(error);
        }

        parent.appendChild(scp);

      });

    },

    page : function(pageName){

      return new Promise((resolve,reject)=>{

        engine.common.tell('loading page module',log);

        let error;

        if(!pageName || typeof(pageName) !== 'string'){
          error = 'invalid/not_found-pageName';
          reject(error);
        }
        if(window.pageList[pageName] == 'onboard'){
          error = 'pageModule-already-loaded';
          reject(error);
        }

        let location;
        if(window.hasOwnProperty('is_electron') || window.hasOwnProperty('is_cordova')){
          location = 'js/pages/' + pageName + '/page.js';
        } else {
          location = baseHref + '/js/pages/' + pageName + '/page.js';
        }

        let parent = document.getElementsByTagName("head")[0];

        let scp = document.createElement('script');
        scp.type = "text/javascript";
        scp.src = location;

        scp.onload  = function(){
          engine.common.tell('page_loaded',log);
          resolve(true);
        };

        scp.onreadystatechange = function(){
          engine.common.tell('page_loaded',log);
          resolve(true);
        };

        scp.onerror = function(){
          engine.common.error('failed-pageLoad');
          error = 'failed-pageLoad';
          reject(error);
        }

        parent.appendChild(scp);
        window.pageList[pageName] = 'onboard';

      });

    },

    cont : function(pageName,contName){

      return new Promise((resolve,reject)=>{

        let error;

        engine.common.tell('loading cont module',log);


        if(!pageName || typeof(pageName) !== 'string'){
          error = 'invalid/not_found-pageName';
          reject(error);
        }
        if(!contName || typeof(contName) !== 'string'){
          error = 'invalid/not_found-ContName';
          reject(error);
        }
        if(window.pageModules[pageName].contList[contName] == 'onboard'){
          error = 'cont-already-loaded';
          reject(error);
        }

        let location;
        if(window.hasOwnProperty('is_electron') || window.hasOwnProperty('is_cordova')){
          location = 'js/pages/' + pageName + '/conts/' + contName + '/cont.js';
        } else {
          location = baseHref + '/js/pages/' + pageName + '/conts/' + contName + '/cont.js';
        }

        //console.log(location);

        let parent = document.getElementsByTagName("head")[0];

        let scp = document.createElement('script');
        scp.type = "text/javascript";
        scp.src = location;

        scp.onload  = function(){
          engine.common.tell('cont_loaded',log);
          resolve(true);
        };

        scp.onreadystatechange   = function(){
          engine.common.tell('cont_loaded',log);
          resolve(true);
        };

        parent.appendChild(scp);

      });

    },

    panel : function(pageName,contName,panelName){

      return new Promise((resolve,reject)=>{

        let error;

        engine.common.tell('loading panel module',log);

        if(!pageName || typeof(pageName) !== 'string'){
          error = 'invalid/not_found-pageName';
          reject(error);
        }
        if(!contName || typeof(contName) !== 'string'){
          error = 'invalid/not_found-ContName';
          reject(error);
        }
        if(!panelName || typeof(panelName) !== 'string'){
          error = 'invalid/not_found-panelName';
          reject(error);
        }

        let location;
        if(window.hasOwnProperty('is_electron') || window.hasOwnProperty('is_cordova')){
          location = 'js/pages/' + pageName + '/conts/' + contName + '/panels/' + panelName + '/panel.js';
        } else {
          location = baseHref + '/js/pages/' + pageName + '/conts/' + contName + '/panels/' + panelName + '/panel.js';
        }

        let parent = document.getElementsByTagName("head")[0];

        let scp = document.createElement('script');
        scp.type = "text/javascript";
        scp.src = location;

        scp.onload  = function(){
          engine.common.tell('panel_loaded',log);
          resolve(true);
        };

        scp.onreadystatechange   = function(){
          engine.common.tell('panel_loaded',log);
          resolve(true);
        };

        parent.appendChild(scp);

      });

    }

  },

  css : function(fileName){

    return new Promise((resolve,reject)=>{

      let error;

      engine.common.tell('loading page module',log);

      if(!fileName || typeof(fileName) !== 'string'){
        error = 'invalid/not_found-css_file_name';
        reject(error);
      }

      let location = baseHref + '/css/' + fileName + '.css';

      if(window.hasOwnProperty('is_electron') || window.hasOwnProperty('is_cordova')){
        location = 'css/' + fileName + '.css';
      } else {
        location = baseHref + '/css/' + fileName + '.css';
      }

      let parent = document.getElementsByTagName("head")[0];

      let css = document.createElement('link');
      css.rel  = 'stylesheet';
      css.type = 'text/css';
      css.href = location;
      css.media = 'all';
      parent.appendChild(link);

      resolve(true);

    });

  },

  hook : {

    comp:(data)=>{

      if(!data.comp || !data.function){
        return engine.common.error("not_found-comp/function");
      }

      engine.hooks.comps[data.comp] = data.function;

    },

    page:(data)=>{

      if(!data.page || !data.function){
        return engine.common.error("not_found-page/function");
      }

      engine.hooks.pages[data.page] = data.function;
      let hold = window.pageModules;
      window.pageModules = new Proxy(hold,{
        set(obj,key,val){
          obj[key] = val;
          engine.hooks.pages[data.page]();
        }
      });

    },

    cont:(data)=>{

      if(!data.page || !data.cont || !data.function){
        return engine.common.error("not_found-page/cont/function");
      }

      engine.hooks.conts[data.page] = {};
      engine.hooks.conts[data.page][data.cont] = data.function;
      let hold = window.pageModules;

      window.pageModules[data.page].contModules = new Proxy(hold,{
        set(obj,key,val){
          obj[key] = val;
          engine.hooks.conts[data.page][key]();
        }
      });

    },

    panel:(data)=>{

      if(!data.page || !data.cont || !data.panel || !data.function){
        return engine.common.error("not_found-page/cont/panel/function");
      }

      engine.hooks.panels[data.page] = {};
      engine.hooks.panels[data.page][data.cont] = {};
      engine.hooks.panels[data.page][data.cont][data.panel] = data.function;
      let hold = window.pageModules;

      window.pageModules[data.page].contModules[data.cont].panelModules = new Proxy(hold,{
        set(obj,key,val){
          obj[key] = val;
          engine.hooks.panels[data.page][data.cont][key]();
        }
      });

    }

  }

};

},{}],22:[function(require,module,exports){
const initImport = require('./make/init');
const viewersImport = require('./make/viewers');
const inputsImport = require('./make/inputs');
const listImport = require('./make/list');
const customImport = require('./make/custom');
const tabsImport = require('./make/tabs/index');
const a = require('./make/a.js');

module.exports = {

  a:a,

  //init
  init : initImport,
  //viewers
  div:viewersImport.div,
  card:viewersImport.card,
  text:viewersImport.text,
  span:viewersImport.span,
  p:viewersImport.p,
  heading:viewersImport.heading,
  image:viewersImport.image,
  addClass:viewersImport.addClass,
  removeClass:viewersImport.removeClass,
  style:viewersImport.style,
  message:viewersImport.message,
  tabs:tabsImport,

  //inputs
  select:inputsImport.select,
  input:inputsImport.input,
  upload:inputsImport.upload,
  textarea:inputsImport.textarea,
  checkBox:inputsImport.checkBox,
  checkbox:inputsImport.checkBox,
  button:inputsImport.button,
  enableButton:inputsImport.enableButton,

  //lists
  list:listImport.list,
  listItem:listImport.listItem,
  listItems:listImport.listItems,

  //custom
  element:customImport.element

};

},{"./make/a.js":23,"./make/custom":26,"./make/init":27,"./make/inputs":28,"./make/list":29,"./make/tabs/index":30,"./make/viewers":32}],23:[function(require,module,exports){

const creator = require('./creator');


module.exports = (options)=>{

  if(!options.href && options.type == 'url'){
    return engine.common.error('not_found/invalid-href-a-make-engine');
  }
  if(options.type !== 'url' && options.type !== 'local'){
    return engine.common.error('not_found/invalid-type-a-make-engine');
  }

  if(options.type == 'local'){

    let href = window.baseHref;

    if(options.page){
      let local = options.page;
      let replace = local.replace('Page','');
      href += replace;
    }
    if(options.cont){
      let local = options.cont;
      let replace = local.replace('Cont','');
      href += '/' + replace;
    }
    if(options.panel){
      let local = options.panel;
      let replace = local.replace('Panel','');
      href += '/' + replace;
    }

    if(options.params){
      for(var key in options.params){
        if(href.indexOf('?') < 0){
          href += '?' + key + '=' + options.params[key];
        } else {
          href += '&' + key + '=' + options.params[key];
        }
      }
    }

    options.href = href;

    //options.href = '#';

    let router = 'to';
    if(options.new == true){
      router = 'new';
    }

    options.function = (object,data,e)=>{

      if(options.baseFunction){
        options.baseFunction();
      }

      e.preventDefault();
      e.stopPropagation();

      if(options.page && !options.cont && !options.panel){
        const page = engine.get.pageModule(options.page);
        if(page){
          engine.router.navigate[router].page(page,options.data);
        }
      }

      if(options.page && options.cont && !options.panel){
        const cont = engine.get.contModule(options.page,options.cont);
        if(cont){
          engine.router.navigate[router].cont(cont,options.data);
        }
      }

      if(options.page && options.cont && options.panel){
        const panel = engine.get.panelModule(options.page,options.cont,options.panel);
        if(panel){
          engine.router.navigate[router].panel(panel,options.data);
        }
      }

      return true;

    }// local function

  }// make the href local



  return creator('a',options);

};

},{"./creator":25}],24:[function(require,module,exports){
const common = require('../common');

module.exports = {

  check: function(object){

    if(typeof(object) !== 'object'){
      return common.error('invalid_object');
    }

    //check parent property
    if(!object.hasOwnProperty('parent') == true){
      return common.error('not_found-parent');
    }
      if(typeof(object.parent) !== 'string'){
        return common.error('not_found-parent');
      }

    return true;

  }

};

},{"../common":17}],25:[function(require,module,exports){
const common = require('../common');
const checkBaseOptions = require('./check').check;
const httpMarker = 'http://';
let scollers = {};
let keepScroller = [];
let scoll_direction = 'down';
let last_scroll_position = window.pageYOffset;
let showing = {};
let exit = {};

window.addEventListener('scroll', scrollFunction);

function scrollFunction(){

  let keys = Object.keys(scollers);
  let windowHeight = window.innerHeight;

  let current_scroll_position = window.pageYOffset;
  if(current_scroll_position < last_scroll_position){
    scoll_direction = 'up';
  } else {
    scoll_direction = 'down';
  }
  let view_count = windowHeight + current_scroll_position;

  for(var id in scollers){

    let e = document.getElementById(id);
    if(!e){
      delete scollers[id];
    } else {

      if(!showing.hasOwnProperty(id)){
        showing[id] = false;
      }

      let positionFromBottom = e.getBoundingClientRect().bottom;
      let positionFromTop = e.getBoundingClientRect().top;

      let bottom_diff = windowHeight - positionFromBottom;
      let top_diff = windowHeight - positionFromTop;

      if(scoll_direction == 'up'){
        if(positionFromBottom >= 0 && bottom_diff >= 0 && showing[id] == false){
          process_enter(id);
        }
        if(top_diff < 0){
          process_exit(id);
        }
      }

      if(scoll_direction == 'down'){
        if(top_diff >= 0 && positionFromBottom >= 0 && showing[id] == false){
          process_enter(id);
        }
        if(positionFromBottom <= 0){
          process_exit(id);
        }
      }

    }



  }//loop ends here

  function process_enter(id){
    if(showing[id] == true){return false;}
    showing[id] = true;
    let func = scollers[id]
    if(typeof(func) == 'function'){func(id);}
    if(keepScroller.indexOf(id) < 0 && exit.hasOwnProperty(id) == false){
      delete scollers[id];
      delete showing[id];
    }
    return true;
  }

  function process_exit(id){
    if(showing[id] == false){return false;}
    showing[id] = false;
    let func = exit[id]
    if(typeof(func) == 'function'){func(id);}
    if(keepScroller.indexOf(id) < 0){
      delete scollers[id];
      delete showing[id];
      delete exit[id];
    }
    return true;
  }

  last_scroll_position = current_scroll_position;

};

module.exports = (tag,options)=>{

  //check options object
  let check = checkBaseOptions(options);
  if(check == false){
    return common.error('invalid_options',options);
  }

  if(!options.id){
    options.id = engine.uniqid();
  }

  //check parent
  let get = document.getElementById(options.parent);
  if(get == null){
    return common.error('invalid_parent',options);
  }

  //make element
  let id = options.parent + '-' + tag + '-' + options.id;
  let object = document.createElement(tag);
  object.id = id;

  if(options.enter){
    if(!scollers.hasOwnProperty(id)){
      scollers[id] = options.enter;
    }
    if(options.keepScroller && options.keepScroller == true){
      if(keepScroller.indexOf(id) < 0){
        keepScroller.push(id);
      }
    }
  }

  if(options.exit){
    if(!scollers.hasOwnProperty(id)){
      if(!options.enter){
        scollers[id] = null;
      }
    }
    if(exit.hasOwnProperty(id) == false){
      exit[id] = options.exit;
    }
    if(options.keepScroller && options.keepScroller == true){
      if(keepScroller.indexOf(id) < 0){
        keepScroller.push(id);
      }
    }
  }

  if(options.class){
    object.className = options.class;
  } else {
    if(tag == 'input' && options.type !== 'button'){
      object.className = 'form-input';
    }
    if(tag == 'select'){
      object.className = 'form-select';
    }
    if(tag == 'checkbox'){
      object.className = 'form-checkbox';
    }
    if(tag == 'input' && options.type == 'button'){
      object.className = 'form-button';
    }
  }

  if(options.hasOwnProperty('text') && options.text !== undefined && options.text !== null){
    object.innerHTML = options.text;
  }
  if(options.style){
    object.style = options.style;
  }

  for(var i in options){
    if(
      i !== 'function' &&
      i !== 'events' &&
      i !== 'event' &&
      i !== 'text' &&
      i !== 'style' &&
      i !== 'class' &&
      i !== 'parent' &&
      i !== 'tag' &&
      i !== 'list_id' &&
      i !== 'id'
    ){
      if(options[i]){
        object[i] = options[i];
      }
    }
  }

  //select items
  if(options.options && typeof(options.options) == 'object' && options.options.length > 0){
    for(var i=0;i<options.options.length;i++){
      let data = options.options[i];
      if(data.text && data.value !== 'undefined'){
        let option = document.createElement("option");
        option.text = data.text;
        option.value = data.value;
        if(data.class){
          option.className = data.class;
        } else {
          option.className = 'form-select-item';
        }
        if(options.value !== undefined){
          if(options.value == data.value){
            option.selected = true;
          }
        }
        if(!data.hasOwnProperty('value') || data.disabled){
          option.disabled = true;
        }
        object.add(option);
      }
    }
  }


  let default_event = 'click';
  if((tag == 'input' || tag == 'textarea') && options.type !== 'button'){
    default_event = 'input'
  }
  if(options.function && tag !== 'ol' && tag !== 'ul'){
    object.addEventListener(default_event,(e)=>{
      options.function(object,options.functionData,e);
    });
  }

  if(options.event && options.events){
    common.error('invalid_config=>event&&events__cannot_co_exists',options);
  }

  if(options.events && !options.event){
    for(var i in options.events){
      let e = options.events[i];
      if(e.event && e.function){
        if(
          typeof(e.event) == 'string' &&
          typeof(e.function) == 'function'
        ){
          object.addEventListener(e.event,(eve)=>{
            e.function(object.id,eve)
          });
        }
      }
    }

  }

  if(options.event){
    if(
      typeof(options.event.type) == 'string' &&
      typeof(options.event.function) == 'function'
    ){
      object.addEventListener(options.event.type,(eve)=>{
        options.event.function(object.id,eve)
      });
    }
  }

  if(options.expire && typeof(options.expire) == 'number' && options.expire > 1000){
    setTimeout(function(){
      engine.view.remove(object.id);
      scrollFunction();
    }, options.expire);
  }

  if(options.position){
    get.insertAdjacentElement(options.position,object);
  } else {
    get.appendChild(object);
  }


  scrollFunction();

  return object.id;

}

},{"../common":17,"./check":24}],26:[function(require,module,exports){
const creator = require('./creator');

module.exports = {

  element : function(options){
    if(!options.tag){
      return engine.common.error('not_found-tag-custom-make-engine');
    }
    return creator(options.tag,options);
  }

};

},{"./creator":25}],27:[function(require,module,exports){
const common = require('../common');
const log = false;

async function build(type,id,parent,cls){

  common.tell('initiating ' + type,log);

  //security checks
  if(id == null){
    return common.error('not_found-id');
  }
  if(parent == null){
    return common.error('not-found-parent');
  }

  //check parent
  let get = document.getElementById(parent);
  if(get == null){
    return common.error('invalid_parent');
  }

  //make element
  let div = document.createElement("div");
  div.id = id;
  if(cls){
    div.className = cls;
  }
  get.appendChild(div);

  let router = require('../router');

  if(type == 'page' && !engine.router.active.page){
    let pageName = id.split('-')[1] + 'Page';
    let mod = engine.get.pageModule(pageName);
    engine.router.route.push({
      url:window.baseHref,
      mod:mod,
      type:'page'
    });
  }

  if(type == 'page' && !engine.router.active.page){
    let hold = id.split('-')[1] + 'Page';
    let app = engine.get.pageModule(hold);
    if(app){
      if(app.trackers){
        let trackers = app.trackers;
        if(trackers.title){
          engine.set.pageTitle(trackers.title);
        }
        if(trackers.meta){
          for(var i in trackers.meta){
            engine.meta.update(trackers.meta[i]);
          }
        }
        if(trackers.function){
          if(trackers.function_data){
            trackers.function(trackers.function_data);
          } else {
            trackers.function();
          }
        }
      }
    }
  }

  //update router catalogs here
  if(type == 'page'){
    //router.route.push(id);
    router.built.page.push(id);
    router.active.page = id;
    router.navigate.url.add.page(id);
  } else if(type == 'cont'){
    //router.route.push(id);
    router.built.cont.push(id);
    router.active.cont = id;
    router.track.cont[parent] = id;
  } else if(type == 'panel'){
    //router.route.push(id);
    router.built.panel.push(id);
    router.active.panel = id;
    router.track.panel[parent] = id;
  }

  //page-router



  return id;

}

module.exports = {

  page : function(id,cls){
    return build('page',id,'page-router',cls);
  },

  comp : function(id,parent,cls){
    return build('comp',id,parent,cls);
  },

  cont : function(id,parent,cls){
    return build('cont',id,parent,cls);
  },

  panel : function(id,parent,cls){
    return build('panel',id,parent,cls);
  }

}

},{"../common":17,"../router":36}],28:[function(require,module,exports){
const common = require('../common');
const checkBaseOptions = require('./check').check;
const log = false;
const seprator = false;
const creator = require('./creator');

module.exports = {

  upload: function(options){
    if(options.function){
      let user_function = options.function;
      let local_function = (object)=>{
        user_function(object.id,object.files);
      };
      options.function = local_function;
    }
    options.type = 'file';
    return creator('input',options);
  },

  select : function(options){
    if(options.function){
      let user_function = options.function;
      let local_function = (object)=>{
        user_function(object.id,object.value);
      };
      options.function = local_function;
    }
    return creator('select',options);
  },

  input : function(options){

    if(options.function){
      let user_function = options.function;
      let fetch_this = 'value';
      if(options.type == 'file'){fetch_this = 'files';}
      let local_function = (object)=>{
        if(options.type == 'number'){
          user_function(object.id,Number(object[fetch_this]));
        } else {
          user_function(object.id,object[fetch_this]);
        }
      };
      options.function = local_function;
    }

    if(!options.type){options.type = 'string';}
    return creator('input',options);

  },

  checkBox : function(options){

    //check options object
    let check = checkBaseOptions(options);
    if(check == false){
      return common.error('invalid_options',options);
    }

    //check parent
    let get = document.getElementById(options.parent);
    if(get == null){
      return common.error('invalid_parent',options);
    }

    //make label first
    let label = document.createElement("label");
    if(options.labelClass){
      label.className = options.labelClass;
    } else {
      label.className = 'form-checkbox-label';
    }

    //create object
    let object = document.createElement("input");
    object.id = options.parent + '-checkbox-' + options.id;
    object.type = 'checkbox';
    if(options.class){
      object.className = options.class;
    } else {
      object.className = 'form-checkbox';
    }
    if(options.checked){
      if(options.checked == true){
        object.checked = true;
      }
    }
    label.appendChild(object);
    label.appendChild(document.createElement('span'));

    if(options.function){
      object.addEventListener('click',()=>{
        options.function(object.id);
      });
    }

    get.appendChild(label);
    return object.id;

  },

  textarea : function(options){

    if(options.function){
      let user_function = options.function;
      let local_function = (object)=>{
        user_function(object.id,object.value);
      };
      options.function = local_function;
    }

    return creator('textarea',options);

  },

  button : function(options){

    if(options.function){
      let user_function = options.function;
      let local_function = (object,data)=>{
        user_function(object.id,data);
      };
      options.function = local_function;
    }

    options.type = 'button';
    return creator('input',options);

  },

  enableButton : function(buttonId){

    let get = document.getElementById(buttonId);
    if(get == null){
      return common.error('not-found/invalid-buttonId');
    } else {
      get.disabled = false;
      return true;
    }

  }

};

},{"../common":17,"./check":24,"./creator":25}],29:[function(require,module,exports){
const creator = require('./creator');

module.exports = {

  list : function(options){

    if(options.type !== 'ol' && options.type !== 'ul'){
      options.type == 'ol';
    }
    if(!options.data){
      options.data = 0;
    }

    let list_id = creator(options.type,options);

    for(var i=0;i<options.data.length;i++){
      let thisItemData = options.data[i];
      make_list_item(list_id,thisItemData,options.itemClass,options.function,options.events,options.event);
    }

    return list_id;

  },

  listItem : (options)=>{
    return make_list_item(options.list_id,options,options.itemClass,options.function,options.events,options.event);
  },

  listItems : function(options){

    if(!options.list_id){
      return engine.common.error('not_found-list_id-listItems_make_engine');
    }
    let items = options.data;
    for(var i in items){
      make_list_item(options.list_id,items[i],options.itemClass,options.function,options.events,options.event);
    }
    return options.id;

  }

};

function make_list_item(id,item,superClass,superFunction,superEvents,superEvent){

  if(!item.id){
    item.id = engine.uniqid();
  }

  let cls = 'list-item';
  if(item.class){
    cls = item.class;
  } else if(superClass){
    cls = superClass;
  }

  let func = item.function;
  if(!func && superFunction){
    func = superFunction;
  }

  let local_function = (object)=>{
    if(typeof(func) == 'function'){
      func(object.id);
    }
  };

  let events = item.events;
  if(!events && superEvents){
    events = superEvents;
  }

  let eve = item.event;
  if(!eve && superEvent){
    eve = superEvent;
  }

  let build = {
    id:item.id,
    parent:id,
    class:cls,
    text:item.text,
    function:local_function,
    event:eve,
    events:events
  };

  return creator('li',build);

}

},{"./creator":25}],30:[function(require,module,exports){
"use strict";
const make = require('./make');

//input object sample
// {
//   tabs:[
//     {value:value0,module,module0,active:true},
//     {value:value1,module,module1}
//   ]
// }

function build(type,options,clickFunction,activeFunction){

  if(!options || !options.tabs.length || !options.parent || !document.getElementById(options.parent)){
    return engine.common.error('invalid_parent : ' + options);
  }

  options.tabClass = options.tabClass || 'tab-idle';
  options.tabsContClass = options.tabsContClass || 'tab-cont-main';
  options.activeTabClass = options.activeTabClass || 'tab-active';
  options.navButtonClass = options.navButtonClass || 'tab-nav';
  options.linksContClass = options.linksContClass || 'tab-cont-links';
  options.moduleContClass = options.moduleContClass || 'tab-cont-module';
  options.navButtonClass = options.navButtonClass || 'tab-nav';

  const parentButtonCont = engine.make.div({
    id:'links',
    parent:options.parent,
    class:options.linksContClass
  });

  let parentModuleCont;
  if(type == 'comp'){
    const moduleCont = engine.make.div({
      id:'modules',
      parent:options.parent,
      class:options.tabsContClass
    });
    parentModuleCont = engine.router.init.comps(moduleCont,null,null,options.moduleContClass);
  } else {
    parentModuleCont = engine.make.div({
      id:'tabs',
      parent:options.parent,
      class:options.tabsContClass
    });
  }

  make.tabs(
    parentButtonCont,
    parentModuleCont,
    options.tabs,
    clickFunction,
    activeFunction,
    options.tabClass,
    options.activeTabClass,
    options.navButtonClass
  );

  return parentModuleCont;

}

module.exports = {

  comp : function(options){

    function clickFunction(id,mod,data,router){
      engine.router.navigate.to.comp(mod,data,router);
    }

    function activeFunction(id,mod,data,router){
      mod.init(router,data);
      engine.router.track.comp[router] = router + mod.ref;
      engine.router.built.comp.push(router + mod.ref);
    }

    return build('comp',options,clickFunction,activeFunction);

  },

  panel : function(options){

    let routerId;

    function clickFunction(id,mod,data){
      engine.router.navigate.to.panel(mod,data);
    }

    function activeFunction(id,mod,data){
      const page = engine.router.active.page + '-router-cont';
      const cont = engine.router.track.cont[page];
      routerId = engine.router.init.panels(cont);
      mod.init(routerId);
    }

    return build('panel',options,clickFunction,activeFunction);

  },

  cont : function(options){

    function clickFunction(id,mod,data){
      engine.router.navigate.to.cont(mod,data);
    }

    function activeFunction(id,mod,data){
      const routerId = engine.router.init.conts(engine.router.active.page);
      mod.init(routerId,data);
    }

    return build('cont',options,clickFunction,activeFunction);

  }

};

},{"./make":31}],31:[function(require,module,exports){
"use strict"

module.exports = {

  tabs : function(parent,moduleCont,tabs,clickFunction,activeFunction,idleClass,activeClass,navButtonClass){

    let tab_style = 'float:left;';
    if(engine.get.body.width() <= 640){
      tab_style += 'width:26.66%;';
    }
    if(engine.get.body.width() <= 480){
      tab_style += 'width:40%;';
    }
    if(engine.get.body.width() > 640 && tabs.length <= 6){
      tab_style += 'width:auto;';
    }

    let tab_ids = [],linksCont,nodes,firstTabIndex,nextTabIndex,count = 2,hidden_count = 0,total_nodes,visible;

    const leftButton = engine.make.div({
      parent:parent,
      text:'&#8619;',
      style:'width:10%;float:left;display:none;',
      class:navButtonClass,
      function:()=>{
        if(firstTabIndex > 1){
          engine.view.hide(nodes[nextTabIndex].id);
          firstTabIndex--;
          nextTabIndex--;
          engine.view.show(nodes[firstTabIndex].id);
        }
      }
    });

    for(const tab of tabs){

      if(tab.value && tab.module){

        const tabId = engine.make.button({
          parent:parent,
          value:tab.value,
          style:tab_style,
          class:idleClass,
          function:()=>{

            //check for active tab
            if(engine.router.track.tabs[parent]['tab'] == tabId){
              return true;
            }

            //remove active class from active tab
            let activeTab = engine.router.track.tabs[parent]['tab'];
            if(activeClass){
              engine.make.removeClass({id:activeTab,parent:'any',class:activeClass});
              engine.make.addClass({id:tabId,parent:'any',class:activeClass});
            } else {
              engine.make.removeClass({id:activeTab,parent:'any',class:'tab-active'});
              engine.make.addClass({id:tabId,parent:'any',class:'tab-active'});
            }

            clickFunction(tabId,tab.module,data,moduleCont);

            //set comp router tags
            engine.router.track.tabs[parent] = {module:tabRef,tab:tabId};
            engine.router.built.tab.push(tabRef);

          }
        });

        tab_ids.push(tabId);

        let tabRef = parent + tab.module.ref;
        let data = null;
        if(tab.data){
          data = tab.data;
        }

        //set active tab class here
        if(tab.active){
          if(tab.active == true){
            //set router tabs track catalog here
            engine.router.track.tabs[parent] = {module:tabRef,tab:tabId};
            engine.router.built.tab.push(tabRef);
            if(activeClass){
              engine.make.addClass({id:tabId,parent:'any',class:activeClass});
            } else {
              engine.make.addClass({id:tabId,parent:'any',class:'tab-active'});
            }
            if(activeFunction){
              activeFunction(tabId,tab.module,data,moduleCont);
            }
          }
        }

      }//tab object check

    }//loop ends here

    linksCont = document.getElementById(parent);
    nodes = linksCont.childNodes;
    total_nodes = nodes.length;
    firstTabIndex = 1;
    nextTabIndex = nodes.length - count + 1;

    const rightButton = engine.make.div({
      parent:parent,
      text:'&#8620;',
      style:'width:10%;float:left;display:none;',
      class:navButtonClass,
      function:()=>{
        if(firstTabIndex + visible <= total_nodes - 1){
          nextTabIndex = firstTabIndex + visible;
          if(nodes[nextTabIndex]){
            engine.view.hide(nodes[firstTabIndex].id);
            engine.view.show(nodes[nextTabIndex].id);
            firstTabIndex++;
          }
        }
      }
    });

    if(linksCont.scrollHeight > 50){
      while(linksCont.scrollHeight > 50 && count < nodes.length){
        let hideThisTab = nodes[nodes.length - count];
        engine.view.hide(hideThisTab.id);
        count++;
        hidden_count++;
      }
      engine.view.show(leftButton);
      engine.view.show(rightButton);
    }

    visible = total_nodes - hidden_count - 1;

    return true;

  }

}

},{}],32:[function(require,module,exports){
const creator = require('./creator');

module.exports = {

  style : (options)=>{

    if(!options.id || !options.style){
      return engine.common.error('not_found-id/style-addStyle-make-engine');
    }

    let object = document.getElementById(options.id);
    if(object){
      object.style = options.style;
      return true;
    } else {
      return engine.common.error('not_found-doc_element_by_id-addStyle-make-engine');
    }

  },

  addClass : function(options){

    if(!options.id || !options.class){
      return engine.common.error('not_found-id/class-addClass-make-engine');
    }

    let object = document.getElementById(options.id);
    if(object){
      let style = object.className;
      if(style.indexOf(options.class) >= 0){
        return true;
      }
      style = style + ' ' + options.class;
      object.className = style;
      return true;
    } else {
      return engine.common.error('not_found-doc_element_by_id-addClass-make-engine');
    }


  },

  removeClass : function(options){

    if(!options.id || !options.class){
      return engine.common.error('not_found-id/class-removeClass-make-engine');
    }

    let object = document.getElementById(options.id);
    if(object){
      let style = object.className;
      if(style.indexOf(options.class) < 0){
        return true;
      }
      let updated = style.replace(options.class,"");
      object.className = updated;
      return true;
    } else {
      return engine.common.error('not_found-doc_element_by_id-removeClass-make-engine');
    }

  },

  span : function(options){
    if(options.function){
      let user_function = options.function;
      let local_function = (object)=>{
        user_function(object.id);
      };
      options.function = local_function;
    }
    return creator('span',options);
  },

  div : function(options){
    if(options.function){
      let user_function = options.function;
      let local_function = (object)=>{
        user_function(object.id);
      };
      options.function = local_function;
    }
    return creator('div',options);
  },

  heading : function(options){
    if(options.function){
      let user_function = options.function;
      let local_function = (object)=>{
        user_function(object.id);
      };
      options.function = local_function;
    }
    if(!options.level){options.level = 1;}
    return creator('h' + options.level,options);
  },

  p : function(options){
    if(options.function){
      let user_function = options.function;
      let local_function = (object)=>{
        user_function(object.id);
      };
      options.function = local_function;
    }
    return creator('p',options);
  },

  text : function(options){

    if(!options.id || !options.text){
      return engine.common.error('not_found-id/text-text-make-engine');
    }

    let object = document.getElementById(options.id);
    if(object){
      object.innerHTML = options.text;
      return true;
    } else {
      return engine.common.error('not_found-doc_element_by_id-text-make-engine');
    }

  },

  image : function(options){

    if(!options.location){
      return engine.common.error('not_found-image_location-image-make-engine');
    }
    if(!options.type || (options.type !== 'local' && options.type !== 'url')){
      options.type = 'local';
    }
    if(options.type == 'local'){
      if(options.location[0] !== '/'){
        if(!window.hasOwnProperty('is_electron') && !window.hasOwnProperty('is_cordova')){
          options.location = '/' + options.location;
        }
      }
      options.src = window.baseHref + options.location;
    }
    if(options.type == 'url'){
      options.src = options.location;
    }
    if(options.function){
      let user_function = options.function;
      let local_function = (object)=>{
        user_function(object.id);
      };
      options.function = local_function;
    }

    return creator('img',options);

  }

};

},{"./creator":25}],33:[function(require,module,exports){


module.exports = {

  add:(options)=>{
    if(!options.name){return engine.common.error('not_found-name-add-meta-engine');}
    if(document.querySelector('meta[name="' + options.name + '"]')){
      return engine.common.error('already_exists-meta_tag-add-meta-engine=>"you might wanna update the meta tag, not set it again."');
    }
    var meta = document.createElement('meta');
    if(options.href){meta.httpEquiv = options.href;}
    meta.content = options.content;
    meta.name = options.name;
    document.getElementsByTagName('head')[0].appendChild(meta);
    return true;
  },

  update:(options)=>{
    let get = document.querySelector('meta[name="' + options.name + '"]');
    if(!get){
      let check = engine.meta.add(options);
      if(!check){
        return engine.common.error('failed-add_meta_tag-update-meta-engine');
      } else {
         get = document.querySelector('meta[name="' + options.name + '"]');
      }
    }
    get.setAttribute("content", options.content);
    return true;
  },

  delete:(name)=>{
    let get = document.querySelector('meta[name="' + name + '"]');
    if(get){
      get.remove();
      return true;
    } else {
      return engine.common.error('not_found-meta_tag-delete-meta-engine');
    }
  }

};

},{}],34:[function(require,module,exports){


function fetch(){

  let params = {};

  if (/\?(.+?\=.+){1}/.test(document.URL)) {
    document.URL.split('?')[1].split('&').forEach(function(both){
      var e = both.split('=');
      params[e[0]] = e[1];
    });
  }

  return params;

}

function post(params){

  let url = document.URL.split('?')[0];
  for(var i in params){
    if(i && params[i]){
      if(url.indexOf("?") < 0){
        url += '?' + i + '=' + params[i];
      } else {
        url += '&' + i + '=' + params[i];
      }
    }
  }

  window.history.pushState("object or string", null, url);

  return true;

}

module.exports = {

  get : fetch,

  add:(key,val)=>{

    let params = fetch();

    if(typeof(key) == 'string'){
      params[key] = val;
    }

    if(typeof(key) == 'object'){
      for(var i in key){
        if(i && key[i]){
          params[i] = key[i];
        }
      }
    }

    post(params);

  },

  delete:(key)=>{

    let params = fetch();

    if(params.hasOwnProperty(key)){
      delete params[key];
      post(params);
    }

    return true;

  },

  native:{

    get:()=>{

      let result = {
        page:null,
        cont:null,
        panel:null,
        custom:[],
        params:fetch()
      };

      let url = document.URL;
      if(url.indexOf('?') >= 0){
        url = url.split('?')[0];
      }
      url = url.replace(window.location.protocol,'');
      url = url.replace(window.location.hostname,'');
      url = url.replace(window.location.port,'');
      url = url.replace('//','');
      url = url.replace(':','');

      let natives = url.split('/');

      if(natives.length == 0){
        return result;
      }
      if(natives[0].length == 0){
        delete natives.splice(0,1);
      }
      if(natives[0]){
        result.page = natives[0] + 'Page';
        natives.splice(0,1);
      }
      if(natives[0]){
        result.cont = natives[0] + 'Cont';
        natives.splice(0,1);
      }
      if(natives[0]){
        result.panel = natives[0] + 'Panel';
        natives.splice(0,1);
      }
      if(natives.length > 0){
        result.custom = natives;
      }

      return result;

    },

    push:(data)=>{

      let hold = document.URL.split('?');

      if(hold.length > 1){
        url = hold[0] + '/' + data + '?' + hold[1];
      } else {
        url = hold[0] + '/' + data;
      }

      window.history.pushState("object or string", null, url);
      return url;

    }

  }

}

},{}],35:[function(require,module,exports){
const log = false;

module.exports = {

  send : async function(options){

    engine.common.tell('sending request',log);

    if(typeof(options) !== 'object'){
      return engine.common.error('invalid_options');
    }
    if(!options.body || !options.url){
      return engine.common.error('not_found-body/headers/url/method||options');
    }

    let build = {
      method:'get',
      body:JSON.stringify(options.body)
    };

    engine.common.tell('build configured',log);

    if(options.method){
      build['method'] = options.method;
    }
    //add header content type tag if doent exists for wet platform
    if(options.headers){
      build['headers'] = (options.headers);
      if(!options.headers['Content-Type']){
        if(typeof(options.body) == 'object'){
          build['headers']['Content-Type'] = 'application/json';
        }
      }
    }
    if(!options.headers){
      if(typeof(options.body) == 'object'){
        build['headers'] = {
          'Content-Type': 'application/json'
        }
      }
    }

    function reponseProcessor(str){
      try {
        /*
        let object = JSON.parse(str);
        if(typeof(object) == 'object'){
            return object;
        } else {
          return str;
        }
        */
        return str.json();
      } catch (err) {
        return str;
      }
    }

    let worker = await fetch(options.url,build)
    .then((response)=>{
      //console.log(response);

      if(typeof(response) == 'string'){
        return reponseProcessor(response);
      } else {
        let data = response.json();
        return data;
      }
    })
    .catch((error)=>{
      engine.common.error('request_error : ' + error);
      return engine.common.error('failed-request');
    });

    engine.common.tell('worker called',log);

    return worker;

  }

};

},{}],36:[function(require,module,exports){
const log = false;
const initWorker = require('./router/init');
const navWorker = require('./router/nav');
const getWorker = require('./router/get');
const setWorker = require('./router/set');
const back = require('./router/back');

window.onpopstate = function(){
  back.nav_back();
}

let active = {
  page:null,
  cont:null,
  panel:null
};

let built = {
  page:[],
  cont:[],
  panel:[],
  tab:[],
  comp:[]
};

let route = [];

let track = {
  cont:{},
  panel:{},
  tabs:{},
  comp:{}
};

let mods = {
  page:{},
  cont:{},
  panel:{}
};

module.exports = {

  //nav data
  active:active,
  built:built,
  route:route,
  track:track,
  mods:mods,

  //functions
  get : getWorker,
  set : setWorker,
  navigate : navWorker,
  init : initWorker

};

},{"./router/back":37,"./router/get":38,"./router/init":39,"./router/nav":40,"./router/set":41}],37:[function(require,module,exports){

module.exports = {

  nav_back : function(){

    if(engine.router.route.length > 1){
      let route = engine.router.route;
      route.pop();
      let last = route[route.length - 1];
      engine.router.navigate.to[last.type](last.mod,null);
      engine.router.route.pop();
      window.history.replaceState("object or string", null, last.url);
    }

  }

};

},{}],38:[function(require,module,exports){
const common = require('../common');
const log = false;

module.exports = {

  pageModule : function(pageName){

    common.tell('fetching pageModule',log);

    if(!pageName){
      return common.error('not_found-inputs');
    }
    if(!window.pageModules[pageName]){
      return common.error('not_found-pageModule');
    } else {
      return window.pageModules[pageName];
    }

  },

  contModule : function(pageName,contName){

    common.tell('fetching contModule',log);

    if(!pageName || !contName){
      return common.error('not_found-inputs');
    }
    if(!window.pageModules[pageName].contModules[contName]){
      return common.error('not_found-pageModule');
    } else {
      return window.pageModules[pageName].contModules[contName];
    }

  },

  panelModule : function(pageName,contName,panelName){

    common.tell('fetching panelModule',log);

    if(!pageName || !contName || !panelName){
      return common.error('not_found-inputs');
    }
    if(!window.pageModules[pageName].contModules[contName].panelModules[panelName]){
      return common.error('not_found-pageModule');
    } else {
      return window.pageModules[pageName].contModules[contName].panelModules[panelName];
    }

  },

  baseHref : function(){
    return window.baseHref;
  }

}

},{"../common":17}],39:[function(require,module,exports){


function build(parent,type,mod,data,cls){

  //check parent
  let get = document.getElementById(parent);
  if(get == null){
    return common.error('invalid_parent : ' + parent);
  }

  //make router
  let router = document.createElement("div");

  if(type == 'comp'){
    router.id = parent + '-router-' + engine.uniqid() + '-' + type;
  } else {
    router.id = parent + '-router-' + type;
  }

  if(cls){
    router.className = cls;
  } else {
    router.className = 'router-' + type;
  }

  let routerApp = require('../router');

  //append router
  get.appendChild(router);
  if(mod && type == 'comp'){
    routerApp.track.comp[router.id] = router.id + mod.ref;
    routerApp.built.comp.push(router.id + mod.ref);
    mod.init(router.id,data);
  }
  return router.id;

}

module.exports = {

  conts : function(parent,cls){
    if(parent == null){
      return common.error('no_parent_found : ' + parent);
    }
    return build(parent,'cont',null,null,cls);
  },

  panels : function(parent,cls){
    if(parent == null){
      return common.error('no_parent_found : ' + parent);
    }
    return build(parent,'panel',null,null,cls);
  },

  comps : function(parent,mod,data,cls){
    if(parent == null){
      return common.error('no_parent_found : ' + parent);
    }
    return build(parent,'comp',mod,data,cls);
  }

};

},{"../router":36}],40:[function(require,module,exports){
const common = require('../common');
const log = false;

function toWorker(app,type,reset,routerId,data){

  common.tell("navigation initiated",log);
  common.tell("reinitiate module : " + reset,log);

  //other modules
  let router = require('../router');
  let view = require('../view');

  common.tell("router / view localised",log);

  //catalogs
  let active = router.active;
  let built = router.built;
  let route = router.route;
  let track = router.track;
  let mods = router.mods;

  common.tell("router objects localised",log);

  //check if there is a initiated page heres
  if(type == 'page'){
    if(active[type] == null){
      return common.error('no_page_initiated_from_app_starter');
    }
  }

  common.tell("base page intiation validated",log);

  //security checks
  if(app == null || app == undefined){
    return common.error('not_found-app');
  }
  if(app.ref == null || app.ref == undefined){
    return common.error('invalid_app');
  }
  if(type == 'comp'){
    if(!routerId){
      return common.error('not_found-routerId');
    }
  }

  common.tell("module checks completed",log);

  //set ref here
  let toId;
  if(type == 'page'){
    toId = app.ref;
  } else if(type == 'cont'){
    toId = active.page + '-router-cont' + app.ref;
  } else if(type == 'panel'){
    let page = active.page + '-router-cont';
    let cont = track.cont[page];
    toId = cont + '-router-panel' + app.ref;
  } else if(type == 'comp'){
    toId = routerId + app.ref;
  }

  common.tell("module ref built",log);

  if(reset == true){
    if(document.getElementById(toId)){
      document.getElementById(toId).remove();
      while(built[type].indexOf(toId) >= 0){
        let toIdPos = built[type].indexOf(toId);
        if(toIdPos >= 0){
          built[type].splice(toIdPos, 1);
        }
      }
    }
  }

  common.tell("pre-built module removed",log);

  if(type == 'page'){
    view.hide(active.page);
  } else if(type == 'cont'){
    let page = active.page + '-router-cont';
    let cont = track.cont[page];
    view.hide(cont);
  } else if(type == 'panel'){
    let page = active.page + '-router-cont';
    let cont = track.cont[page] + '-router-panel';
    let panel = track.panel[cont];
    view.hide(panel);
  } else if(type == 'comp'){
    view.hide(track['comp'][routerId]);
  }

  common.tell("active module hidden",log);

  //update track catalog with toId
  if(type == 'page'){
    active[type] = toId;
  } else if(type == 'cont'){
    let page = active.page + '-router-cont';
    track.cont[page] = toId;
    active[type] = toId;
  } else if(type == 'panel'){
    let page = active.page + '-router-cont';
    let cont = track.cont[page] + '-router-panel';
    track.panel[cont] = toId;
    active[type] = toId;
  } else if(type == 'comp'){
    track.comp[routerId] = toId;
  }

  common.tell("to-module cataloged",log);

  //navigate here
  let url;
  if(type == 'page'){
    url = exp.url.add.page(toId);
    route.push({type:type,id:toId,url:url,mod:app});
  } else if(type == 'cont'){
    url = exp.url.add.cont(toId);
    route.push({type:type,id:toId,url:url,mod:app});
  } else if(type == 'panel'){
    url = exp.url.add.panel(toId);
    route.push({type:type,id:toId,url:url,mod:app});
  }

  if(app.trackers){
    let trackers = app.trackers;
    if(trackers.title){
      engine.set.pageTitle(trackers.title);
    }
    if(trackers.meta){
      for(var i in trackers.meta){
        engine.meta.update(trackers.meta[i]);
      }
    }
    if(trackers.function){
      if(trackers.function_data){
        trackers.function(trackers.function_data);
      } else {
        trackers.function();
      }
    }
  }

  //already built the app
  if(built[type].indexOf(toId) >= 0 && document.getElementById(toId)){
    view.show(toId);
    common.tell("to-module view activated",log);
  }

  //app not built yet
  if(built[type].indexOf(toId) < 0 || !document.getElementById(toId)){

    //initiate app
    if(type == 'page'){
      app.init(data);
    } else if(type == 'cont'){
      let page = active.page + '-router-cont';
      app.init(page,data);
    } else if(type == 'panel'){
      let page = active.page + '-router-cont';
      let cont = track.cont[page] + '-router-panel';
      app.init(cont,data);
    } else if(type == 'comp'){
      app.init(routerId,data);
    }

    if(type == 'comp'){
      built[type].push(toId);
    }



    common.tell("to-module built",log);

  }

  common.tell("to-module router tags pushed",log);

  return true;

}



let exp = {

  url:{
    add : {
      page:function(id){
        let page;
        if(id){
          page = id;
        } else {
          page = engine.router.active.page;
        }
        let url = "/" + clean_page(page);
        // if(document.URL.split('?').length > 1){
        //   url += '?' + document.URL.split('?')[1];
        // }
        if(window.hasOwnProperty('vegana_do_not_route_with_url')){
          if(vegana_do_not_route_with_url){
            window.history.pushState("object or string", null, url);
          }
        }
        return url;
      },
      cont:function(id){
        let page = engine.router.active.page;
        let cont;
        if(id){
          cont = id;
        } else {
          cont = engine.router.track.cont[page];
        }
        let url = "/" + clean_page(page) + "/" + clean_cont(cont);
        // if(document.URL.split('?').length > 1){
        //   url += '?' + document.URL.split('?')[1];
        // }
        if(window.hasOwnProperty('vegana_do_not_route_with_url')){
          if(vegana_do_not_route_with_url){
            window.history.pushState("object or string", null, url);
          }
        }
        return url;
      },
      panel:function(id){
        let page = engine.router.active.page;
        let cont = engine.router.track.cont[page + '-router-cont'];
        let panel;
        if(id){
          panel = id;
        } else {
          panel = engine.router.track.panel[cont];
        }
        let url = "/" + clean_page(page) + "/" + clean_cont(cont) + "/" + clean_panel(panel);
        // if(document.URL.split('?').length > 1){
        //   url += '?' + document.URL.split('?')[1];
        // }
        if(window.hasOwnProperty('vegana_do_not_route_with_url')){
          if(vegana_do_not_route_with_url){
            window.history.pushState("object or string", null, url);
          }
        }
        return url;
      }
    }
  },

  to : {
    page : function(app,data){
      if(engine.router.active.page == app.ref){
        return true;
      }
      return toWorker(app,'page',false,null,data);
    },
    cont : function(app,data){
      let parse = engine.router.active.page + '-router-cont' + app.ref;
      if(engine.router.active.cont == parse){
        return true;
      }
      return toWorker(app,'cont',false,null,data);
    },
    panel : function(app,data){
      let parse = engine.router.active.cont + '-router-panel' + app.ref;
      if(engine.router.active.panel == parse){
        return true;
      }
      return toWorker(app,'panel',false,null,data);
    },
    comp : function(app,data,routerId){
      return toWorker(app,'comp',false,routerId,data);
    }
  },

  new : {
    page : function(app,data){
      return toWorker(app,'page',true,null,data);
    },
    cont : function(app,data){
      return toWorker(app,'cont',true,null,data);
    },
    panel : function(app,data){
      return toWorker(app,'panel',true,null,data);
    },
    comp : function(app,data,routerId){
      return toWorker(app,'comp',true,routerId,data);
    }
  }

}

module.exports = exp;



function clean_page(p){
  let h = p.split('-')[1];
  //console.log({clean_page_result:h});
  return h;
}

function clean_cont(c){

  if(!c){
    return engine.common.error('not_found-cont-clean_cont-navigate-router');
  }

  let page = engine.router.active.page;

  let final = c;
  final = final.replace(page,'');
  final = final.replace('-router-cont-cont-','');

  //console.log({clean_cont_result:final});

  return final;

}

function clean_panel(p){

  let page = engine.router.active.page;
  let cont = engine.router.track.cont[page + '-router-cont'];

  //console.log({cont:cont});

  let final = p;
  final = final.replace(cont,'');
  final = final.replace('-router-panel-panel-','');

  //console.log({clean_panel_result:final});

  return final;

}

},{"../common":17,"../router":36,"../view":46}],41:[function(require,module,exports){
const common = require('../common');
const log = false;

module.exports = {

  pageModule : function(pageName,controller){

    common.tell('activating pageModule : ' + controller.pageName,log);

    if(!pageName || !controller){
      return common.error('not_found-inputs');
    }
    if(typeof(controller) !== 'object'){
      return common.error('invalid-controller');
    }

    window.pageModules[pageName] = controller;
    window.pageList[pageName] = 'onboard';

    return true;

  },

  contModule : function(pageName,contName,controller){

    common.tell('activating contModule : ' + controller.contName,log);

    if(!pageName || !contName || !controller){
      return common.error('not_found-inputs');
    }
    if(typeof(controller) !== 'object'){
      return common.error('invalid-controller');
    }

    window.pageModules[pageName].contModules[contName] = controller;
    window.pageModules[pageName].contList[contName] = 'onboard';

    return true;

  },

  panelModule : function(pageName,contName,panelName,controller){

    common.tell('activating panelModule : ' + panelName,log);

    if(!pageName || !contName || !panelName || !controller){
      return common.error('not_found-inputs');
    }
    if(typeof(controller) !== 'object'){
      return common.error('invalid-controller');
    }

    window.pageModules[pageName].contModules[contName].panelModules[panelName] = controller;
    window.pageModules[pageName].contModules[contName].panelList[panelName] = 'onboard';

    return true;

  },

  baseHref : function(url){

    common.tell('activating baseHref',log);

    let location;
    let protocol = window.location.protocol;
    let host = window.location.hostname;
    let port = window.location.port;

    let hold = '';
    if(protocol && protocol !== 'file:'){
      hold += protocol + '//';
    }
    if(host){
      hold += host;
    }
    if(port){
      hold += ':' + port;
    }
    if(url && url !== '/'){
      hold += '/' + url;
    }

    window.baseHref = hold;

    return true;

  }

};

},{"../common":17}],42:[function(require,module,exports){
const log = false;

let token,user,user_type,uid,session_type;

function check(){

  let type = localStorage.getItem('session_type');
  if(!type){
    return false;
  }

  if(type == 'temp'){
    token = sessionStorage.getItem('token');
    user = sessionStorage.getItem('user');
    user_type = sessionStorage.getItem('user_type');
    uid = sessionStorage.getItem('uid');
    session_type = localStorage.getItem('session_type');
  } else {
    token = localStorage.getItem('token');
    user = localStorage.getItem('user');
    user_type = localStorage.getItem('user_type');
    uid = localStorage.getItem('uid');
    session_type = localStorage.getItem('session_type');
  }

  if(!token){
    return false;
  }

  return true;

}

function end(){

  let type = localStorage.getItem('session_type');
  if(!type){
    return false;
  }

  if(type == 'temp'){
    token = sessionStorage.removeItem('token');
    user = sessionStorage.removeItem('user');
    user_type = sessionStorage.removeItem('user_type');
    uid = sessionStorage.removeItem('uid');
    session_type = localStorage.removeItem('session_type');
  } else {
    token = localStorage.removeItem('token');
    user = localStorage.removeItem('user');
    user_type = localStorage.removeItem('user_type');
    uid = localStorage.removeItem('uid');
    session_type = localStorage.removeItem('session_type');
  }

  return true;

}

module.exports = {

  check : check,

  start : function(token_arg,user_arg,uid,remember){

    engine.common.tell('starting-session',log);

    if(!token_arg){
      return engine.common.error("not_found-token");
    }

    if(user_arg && typeof(user_arg) == 'object'){
      user_type = 'object';
      user_arg = JSON.stringify(user_arg);
    }

    if(remember == true){
      localStorage.setItem('token',token_arg);
      localStorage.setItem('user',user_arg);
      localStorage.setItem('uid',uid);
      localStorage.setItem('session_type','persistant');
    } else {
      sessionStorage.setItem('token',token_arg);
      sessionStorage.setItem('user',user_arg);
      sessionStorage.setItem('uid',uid);
      localStorage.setItem('session_type','temp');
    }

    return check();

  },

  end : end,

  token : token,
  uid   : uid,
  user  : user,
  user_type  : user_type,
  session_type:session_type,

  get : {

    user: function(){
      if(check() == false){
        return null;
      }
      if(user_type == "object"){
        return JSON.parse(user);
      } else {
        return user;
      }
    },

    token:function(){
      check();
      return token;
    },

    uid:function(){
      check();
      return uid;
    },

    session_type:function(){
      check();
      return session_type;
    },

  }

};

},{}],43:[function(require,module,exports){
const log = false;

module.exports = {

  pageTitle : function(title){

    engine.common.tell('setting pageTitle',log);

    if(typeof(title) !== 'string'){
      return engine.common.error('invalid-title-data_type');
    }

    document.title = title;
    return true;

  },

  input : {

    value : function(id,value){
      let get = document.getElementById(id);
      if(get == null){
        return engine.common.error('invalid-parent');
      }
      get.value = value;
      return true;
    }

  },

  div : {

    text : function(id,value){
      let get = document.getElementById(id);
      if(get == null){
        return engine.common.error('invalid-parent');
      }
      get.innerHTML = value;
      return true;
    },

    style: function(id,styles){

      if(!id || typeof(styles) !== 'object' || !styles.length || styles.length == 0){
        return engine.common.error("not_found-id/styles");
      }

      let get = document.getElementById(id);
      if(get == null){
        return engine.common.error('invalid-parent');
      }

      for(var i=0;i<styles.length;i++){
        let hold = styles[i];
        let key = Object.keys(hold)[0];
        get.style[key] = hold[key];
      }

    }

  }

}

},{}],44:[function(require,module,exports){


module.exports = {

  now : function(g){
    let d;if(g){d = new Date(g);} else {d = new Date();}
    return d.getTime();
  },

  date : function(g){
    let d;if(g){d = new Date(g);} else {d = new Date();}
    return d.getDate();
  },

  month : function(g){
    let d;if(g){d = new Date(g);} else {d = new Date();}
    return (d.getMonth() + 1);
  },

  year : function(g){
    let d;if(g){d = new Date(g);} else {d = new Date();}
    return (d.getFullYear());
  },

  day : function(g){
    let d;if(g){d = new Date(g);} else {d = new Date();}
    return (d.getDay() + 1);
  },

  diff : {

    days : function(time1,time2){

      let
      aHold = new Date(time1),
      bHold = new Date(time2),
      a,b;

      a = {
        day:aHold.getDate(),
        month:aHold.getMonth(),
        year:aHold.getFullYear(),
        hour:aHold.getHours(),
        minutes:aHold.getMinutes(),
        seconds:aHold.getSeconds()
      };

      b = {
        day:bHold.getDate(),
        month:bHold.getMonth(),
        year:bHold.getFullYear(),
        hour:bHold.getHours(),
        minutes:bHold.getMinutes(),
        seconds:bHold.getSeconds()
      };

      let base = 0;

      //check if same year
      if(a.year !== b.year){
        let yearDiff = b.year - a.year;
        base += yearDiff * 365;
      }

      //check month
      if(a.month !== b.month){
        let monthDiff = b.month - a.month;
        base += monthDiff * 30;
      }

      //check days
      if(a.day !== b.day){
        let dayDiff = b.day - a.day;
        if(dayDiff > 0){
          base += dayDiff;
        }
      }

      if(base > 0){
        return base;
      }

      //check hours
      if(a.hour !== b.hour){
        let hourDiff = b.hour - a.hour;
        base += hourDiff / 100;
      }

      return base;

    }

  }

};

},{}],45:[function(require,module,exports){
module.exports = {
  json:json,
  email:checkEmail
};

function json(schema,data,schema_type,maxSize){

  //if no type or maxSize is given static type and max size of 21 is automatically assumed
  if(!schema_type){schema_type = 'static'}
  if(schema_type == 'dynamic' && !maxSize){maxSize = 21;}

  //check schema
  if(!schema || typeof(schema) !== 'object' || Object.keys(schema).length == 0){
    return engine.common.error('not_found-valid_schema');
  }

  //check data
  if(!data || typeof(data) !== 'object' || Object.keys(data).length == 0){
    return engine.common.error('not_found-valid_data');
  }

  let keys_schema = Object.keys(schema);
  let keys_data = Object.keys(data);

  //check size of both objects
  if(schema_type == 'static'){
    if(keys_schema.length !== keys_data.length){
      return engine.common.error('miss_matched-object_size');
    }
  }

  //check data object keys size if maxSize property is set
  if(schema_type == 'dynamic' && maxSize){
    if(keys_data.length > maxSize){
      return engine.common.error('max_limit_reached-data_size');
    }
  }

  //add any further data types first
  let dataTypes = ['object','array','string','number','email','boolean'];

  const defaultStrLen = 255;

  //loop the schema and check the data
  for(let key in schema){

    const item = schema[key];

    //check shcema item type
    if(typeof(item) !== 'object'){
      return engine.common.error('invalid-schema_item_type-' + key);
      break;
    }

    //check if schema item have been declared
    if(!item.type || dataTypes.indexOf(item.type) < 0){
      return engine.common.error('not_found/invalid-schema_item_type-' + key);
      break;
    }

    let
    type = item.type,
    needed = true,
    present = false;

    //check if the item is elective
    if(item.elective && item.elective == true){
      if(schema_type == 'static'){
        return engine.common.error('invalid-elective_item_in_static_schema-schema_key_in_data-' + key);
        break;
      } else {
        needed = false;
      }
    }

    //check if schema key exists in data
    if(needed == true && data.hasOwnProperty(key) == false){
      return engine.common.error('not_found-schema_key_in_data-' + key);
      break;
    }

    //check if static data exists
    if(data.hasOwnProperty(key) == true && data[key] !== undefined && data[key] !== null){
      present = true;
    }

	//check if the data value is not false for non boolean keys
    if(present && type !== 'boolean' && data[key] === false){
      present = false;
    }

    //check if the data is needed and present
    if(present == false && needed == true){
      return engine.common.error('not_found-data-data_type_for_key-' + key);
      break;
    }

    //check if data type is valid
    if(present == true && type !== 'email' && checkType(data[key]) !== type){
      console.log(data[key]);
      return engine.common.error('invalid-data_type_for_key-' + key);
      break;
    }

    //check the array and string length for schema key in data
    if((type == 'array' || type == 'string') && present == true){

      if(!data[key]){
        return engine.common.error('not_found-data-schema_key_in_data-' + key);
        break;
      }

      if(item.min && data[key].length < item.min){
        return engine.common.error('min_length_reached-schema_key_in_data-' + key);
        break;
      }

      if(item.max && data[key].length > item.max){
        return engine.common.error('max_length_reached-schema_key_in_data-' + key);
        break;
      } else if(!item.max && type == 'string' && data[key].length > defaultStrLen){
        return engine.common.error('default_max_length_reached-schema_key_in_data-' + key);
        break;
      }

      //check if the key is a valid option
      if(type == 'string'){
        if(item.options && checkType(item.options)){
          if(item.options.indexOf(data[key]) < 0){
            return engine.common.error('invalid_option-schema_key_in_data-' + key);
            break;
          }
        }
      }

    }

    //check the number for schema key in data
    if(type == 'number' && present == true){

      if(data[key] !== 0 && !data[key]){
        return engine.common.error('not_found-data-schema_key_in_data-' + key);
        break;
      }

      if(item.min && data[key] < item.min){
        return engine.common.error('min_length_reached-schema_key_in_data-' + key);
        break;
      }

      if(item.max && data[key] > item.max){
        return engine.common.error('max_length_reached-schema_key_in_data-' + key);
        break;
      }

    }

    //check the object key size for schema key in data
    if(type == 'object' && present == true){

      if(data[key] == false){
        return engine.common.error('not_found-data-schema_key_in_data-' + key);
        break;
      }

      if(item.min && Object.keys(data[key]).length < item.min){
        return engine.common.error('min_length_reached-schema_key_in_data-' + key);
        break;
      }

      if(item.max && Object.keys(data[key]).length > item.max){
        return engine.common.error('max_length_reached-schema_key_in_data-' + key);
        break;
      }

    }

    //check the boolean data type
    if(type == 'boolean' && present == true){
      if(data[key] !== true && data[key] !== false){
        return engine.common.error('invalid-invalid_data-expected_boolean' + key);
        break;
      }
    }

    //check email and email string length for schema key in data
    if(type == 'email' && present == true){

      if(checkType(data[key]) !== 'string'){
        return engine.common.error('invalid-schema_key_in_data-' + key);
        break;
      }

      if(item.min && Object.keys(data[key]).length < item.min){
        return engine.common.error('min_length_reached-schema_key_in_data-' + key);
        break;
      }

      if(item.max && Object.keys(data[key]).length > item.max){
        return engine.common.error('max_length_reached-schema_key_in_data-' + key);
        break;
      }

      if(checkEmail(data[key]) == false){
        return engine.common.error('invalid-email_key-' + key);
        break;
      }

    }

  }
  //loop ends here

  //final functional return
  return true;

}

function checkType(data){

  if(data == undefined || data == null){
    return data;
  }

  let base = typeof(data);

  if(base == 'object'){

    if(Object.keys(data).length == 0){
      return 'object';
    }

    if(!data.length){
      return 'object';
    } else if(data.length > 0){
      return 'array';
    }

  }

  if(base == 'string' || base == 'number'){
    return base;
  }

  if(data == false || data == true){
    return 'boolean';
  }

  return null;

}

function checkEmail(mail){

  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let test = re.test(String(mail).toLowerCase());

  if(test == true){
    return true;
  } else {
    return false;
  }

}

},{}],46:[function(require,module,exports){
function doo(id,what){
  let get = document.getElementById(id);
  if(get == null){
    return false;
  }
  if(what == 'show'){
    get.style.display = 'block';
  } else if (what == 'hide'){
    get.style.display = 'none';
  } else if (what == 'remove'){
    get.remove();
  }
  return id;
}

module.exports= {

  hide : (id)=>{
    return doo(id,'hide');
  },
  show : (id)=>{
    return doo(id,'show');
  },
  remove : (id)=>{
    return doo(id,'remove');
  },

};

},{}],47:[function(require,module,exports){
var address = null;

//this function takes a authetication token from sessions api
async function query(options){

  if(engine.session.check() == false){
    return engine.common.error('not_found-session');
  }
  if(typeof(options) !== 'object'){
    return engine.common.error('invalid_options');
  }

  let token = engine.session.get.token();

  if(options){
    if(typeof(options) == 'object'){
      if(!options.url){
        return engine.common.error('not_found-url=>options');
      }
      if(!options.body){
        return engine.common.error('not_found-body=>options');
      }
      if(options.headers){
        if(typeof(options.headers) !== 'object'){
          options.headers['td-wet-token'] = token;
        } else {
          options.headers = {
            'td-wet-token':token
          };
        }
      } else {
        options.headers = {
          'td-wet-token':token
        };
      }
    }
  }

  let worker = await engine.request(options);
  if(worker == false){
    return engine.common.error('failed-wet_query');
  }
  return worker;

}

module.exports = {

  address:address,

  api:{

    get : function(){
      return address;
    },

    set : function(url){
      address = url;
      return true;
    },

    query : async function(options){
      //this query is performed without authetication token
      if(address == null){
        return engine.common.error('please set the api address first');
      }
      if(!options){
        return engine.common.error('not_found-options');
      }
      if(options){
        if(options.at){
          options.url = address + options.at;
          let result = await query(options);
          if(result == false){
            return engine.common.error('failed-wet_api_query');
          } else {
            return result;
          }
        } else {
          return engine.common.error('not_found-options=>at');
        }
      }
      return engine.common.error('invalid-options');
    }

  },

  query : query

};

},{}]},{},[9]);
