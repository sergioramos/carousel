/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(p, parent, orig){
  var path = require.resolve(p)
    , mod = require.modules[path];

  // lookup failed
  if (null == path) {
    orig = orig || p;
    parent = parent || 'root';
    throw new Error('failed to require "' + orig + '" from "' + parent + '"');
  }

  // perform real require()
  // by invoking the module's
  // registered function
  if (!mod.exports) {
    mod.exports = {};
    mod.client = mod.component = true;
    mod.call(this, mod, mod.exports, require.relative(path));
  }

  return mod.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path){
  var orig = path
    , reg = path + '.js'
    , regJSON = path + '.json'
    , index = path + '/index.js'
    , indexJSON = path + '/index.json';

  return require.modules[reg] && reg
    || require.modules[regJSON] && regJSON
    || require.modules[index] && index
    || require.modules[indexJSON] && indexJSON
    || require.modules[orig] && orig
    || require.aliases[index];
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `fn`.
 *
 * @param {String} path
 * @param {Function} fn
 * @api private
 */

require.register = function(path, fn){
  require.modules[path] = fn;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to){
  var fn = require.modules[from];
  if (!fn) throw new Error('failed to alias "' + from + '", it does not exist');
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj){
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function fn(path){
    var orig = path;
    path = fn.resolve(path);
    return require(path, parent, orig);
  }

  /**
   * Resolve relative to the parent.
   */

  fn.resolve = function(path){
    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    if ('.' != path.charAt(0)) {
      var segs = parent.split('/');
      var i = lastIndexOf(segs, 'deps') + 1;
      if (!i) i = 0;
      path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
      return path;
    }
    return require.normalize(p, path);
  };

  /**
   * Check if module is defined at `path`.
   */

  fn.exists = function(path){
    return !! require.modules[fn.resolve(path)];
  };

  return fn;
};require.register("ramitos-interpolate/interpolate.js", function(module, exports, require){
/*
 * Copyright Joyent, Inc. and other Node contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the
 * following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
 * NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

module.exports = function (f) {
  if (typeof f !== 'string') throw new Error('first parameter must be a string')

  var i = 1,
      args = arguments,
      len = args.length,
      str

  str = f.replace(/%[sdj%]/g, function (x) {
    if (x === '%%') return '%'
    if (i >= len) return x
    switch (x) {
      case '%s': return String(args[i++])
      case '%d': return Number(args[i++])
      case '%j': return JSON.stringify(args[i++])
      default: return x
    }
  })

  for (var x = args[i]; i < len; x = args[++i]) {
     str += ' ' + x
   }

   return str
}
});
require.register("component-indexof/index.js", function(module, exports, require){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
});
require.register("component-classes/index.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var index = require('indexof');

/**
 * Whitespace regexp.
 */

var re = /\s+/;

/**
 * Wrap `el` in a `ClassList`.
 *
 * @param {Element} el
 * @return {ClassList}
 * @api public
 */

module.exports = function(el){
  return new ClassList(el);
};

/**
 * Initialize a new ClassList for `el`.
 *
 * @param {Element} el
 * @api private
 */

function ClassList(el) {
  this.el = el;
  this.list = el.classList;
}

/**
 * Add class `name` if not already present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.add = function(name){
  // classList
  if (this.list) {
    this.list.add(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (!~i) arr.push(name);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove class `name` when present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.remove = function(name){
  // classList
  if (this.list) {
    this.list.remove(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (~i) arr.splice(i, 1);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Toggle class `name`.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.toggle = function(name){
  // classList
  if (this.list) {
    this.list.toggle(name);
    return this;
  }

  // fallback
  if (this.has(name)) {
    this.remove(name);
  } else {
    this.add(name);
  }
  return this;
};

/**
 * Return an array of classes.
 *
 * @return {Array}
 * @api public
 */

ClassList.prototype.array = function(){
  var arr = this.el.className.split(re);
  if ('' === arr[0]) arr.pop();
  return arr;
};

/**
 * Check if class `name` is present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.has = function(name){
  return this.list
    ? this.list.contains(name)
    : !! ~index(this.array(), name);
};

});
require.register("component-domify/index.js", function(module, exports, require){

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Wrap map from jquery.
 */

var map = {
  option: [1, '<select multiple="multiple">', '</select>'],
  optgroup: [1, '<select multiple="multiple">', '</select>'],
  legend: [1, '<fieldset>', '</fieldset>'],
  thead: [1, '<table>', '</table>'],
  tbody: [1, '<table>', '</table>'],
  tfoot: [1, '<table>', '</table>'],
  colgroup: [1, '<table>', '</table>'],
  caption: [1, '<table>', '</table>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  th: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  _default: [0, '', '']
};

/**
 * Parse `html` and return the children.
 *
 * @param {String} html
 * @return {Array}
 * @api private
 */

function parse(html) {
  if ('string' != typeof html) throw new TypeError('String expected');
  
  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) throw new Error('No elements were generated.');
  var tag = m[1];
  
  // body support
  if (tag == 'body') {
    var el = document.createElement('html');
    el.innerHTML = html;
    return [el.removeChild(el.lastChild)];
  }
  
  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = document.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  return orphan(el.children);
}

/**
 * Orphan `els` and return an array.
 *
 * @param {NodeList} els
 * @return {Array}
 * @api private
 */

function orphan(els) {
  var ret = [];

  while (els.length) {
    ret.push(els[0].parentNode.removeChild(els[0]));
  }

  return ret;
}

});
require.register("component-event/index.js", function(module, exports, require){

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  if (el.addEventListener) {
    el.addEventListener(type, fn, capture);
  } else {
    el.attachEvent('on' + type, fn);
  }
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  if (el.removeEventListener) {
    el.removeEventListener(type, fn, capture);
  } else {
    el.detachEvent('on' + type, fn);
  }
};
});
require.register("ramitos-sgen/src/sgen.js", function(module, exports, require){
var map = require('./map');

module.exports.timestamp = function (from) {
  if(!from) from = 1328054400000; //2012/1/1
  
  var timestamp = (new Date().getTime() - from).toString().split('');
  var elements = [];
  var hash = '';
  
  for(var i = 0; i < timestamp.length; i += 1) {
    if(i%2 === 0) elements.push(timestamp[i]);
    else elements[elements.length -1] += timestamp[i];
  }
  
  for(var y = 0; y < elements.length; y += 1) {
    hash += map[elements[y]];
  }
  
  return hash;
}

module.exports.random = function (length) {
  if(!length) length = 6;
  
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
  var hash = [];

  for(var i = 0; i < length; i += 1) {
    hash.push(chars[Math.floor(Math.random()*62)]);
  }

  return hash.join('');
};
});
require.register("ramitos-sgen/src/map.js", function(module, exports, require){
module.exports = {
  "0": "0",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
  "10": "a",
  "11": "b",
  "12": "c",
  "13": "d",
  "14": "e",
  "15": "f",
  "16": "g",
  "17": "h",
  "18": "i",
  "19": "j",
  "20": "k",
  "21": "l",
  "22": "m",
  "23": "n",
  "24": "o",
  "25": "p",
  "26": "q",
  "27": "r",
  "28": "s",
  "29": "t",
  "30": "u",
  "31": "v",
  "32": "w",
  "33": "x",
  "34": "y",
  "35": "z",
  "36": "0a",
  "37": "1b",
  "38": "2c",
  "39": "3d",
  "40": "4e",
  "41": "5f",
  "42": "6g",
  "43": "7h",
  "44": "8i",
  "45": "9j",
  "46": "ak",
  "47": "bl",
  "48": "cm",
  "49": "dn",
  "50": "eo",
  "51": "fp",
  "52": "gq",
  "53": "hr",
  "54": "is",
  "55": "jt",
  "56": "ku",
  "57": "lv",
  "58": "mw",
  "59": "nx",
  "60": "oy",
  "61": "pz",
  "62": "q0",
  "63": "r1",
  "64": "s2",
  "65": "t3",
  "66": "u4",
  "67": "v5",
  "68": "w6",
  "69": "x7",
  "70": "y8",
  "71": "z9",
  "72": "0z",
  "73": "1y",
  "74": "2x",
  "75": "3w",
  "76": "4v",
  "77": "5u",
  "78": "6t",
  "79": "7s",
  "80": "8r",
  "81": "9q",
  "82": "ap",
  "83": "bo",
  "84": "cn",
  "85": "dm",
  "86": "el",
  "87": "fk",
  "88": "gj",
  "89": "hi",
  "90": "ih",
  "91": "jg",
  "92": "kf",
  "93": "le",
  "94": "md",
  "95": "nc",
  "96": "ob",
  "97": "pa",
  "98": "q9",
  "99": "r8",
  "01": "s7",
  "02": "t6",
  "03": "u5",
  "04": "v4",
  "05": "x3",
  "06": "y2",
  "07": "z1",
  "08": "a0",
  "09": "ba"
}
});
require.register("carousel/templates/image.js", function(module, exports, require){
module.exports = '<img src=\'%s\' id=\'%s-carousel-image-%s\' class=\'%s\'>';
});
require.register("carousel/templates/main.js", function(module, exports, require){
module.exports = '<div id=\'%s-carousel\' class=\'carousel\'>\n  <div id=\'%s-carousel-images\' class=\'images\'></div>\n  <div id=\'%s-carousel-controls\' class=\'controls\'>\n    <div id=\'%s-carousel-first\' class=\'first control before disabled\'>&#8676;</div>\n    <div id=\'%s-carousel-prev\' class=\'prev control before disabled\'>&#8592;</div>\n    <div id=\'%s-carousel-count\' class=\'count\'>0/0</div>\n    <div id=\'%s-carousel-last\' class=\'last control after disabled\'>&#8677;</div>\n    <div id=\'%s-carousel-next\' class=\'next control after disabled\'>&#8594;</div>\n  </div>\n</div>';
});
require.register("carousel/src/carousel.js", function(module, exports, require){
var interpolate = require('interpolate'),
    classes = require('classes'),
    domify = require('domify'),
    sgen = require('sgen'),
    ev = require('event');

var templates = {};
var ids = {};

templates.image = require('../templates/image');
templates.main = require('../templates/main');

var genid = function () {
  var id = '';

  while(!id.length) {
    var tmpid = sgen.random(3);
    if(ids[tmpid]) continue;
    id = tmpid;
  }

  return function (meta) {
    if(!meta) return id;
    return interpolate('%s-carousel-%s', id, meta);
  };
};

var el = function (id) {
  return document.getElementById(id);
};

module.exports = function (container) {
  var enabled = true;
  var id = genid();
  var returns = {};
  var size = 0;
  var els = {};
  var pos = 1;

  container.appendChild(domify(templates.main.replace(/%s/mg, id())).pop());

  els.images = el(id('images'));
  els.count = el(id('count'));

  var active = function () {
    return size > 0 ? '' : 'active';
  };

  var disable = function () {
    var ids = Array.prototype.slice.call(arguments);
    ids.forEach(function (_id) {
      classes(el(id(_id))).toggle('disabled');
    });
  };

  var selected = function () {
    return pos;
  };

  var image = function (src) {
    if(size === 0) disable('next', 'last');
    var str = interpolate(templates.image, src, id(), size + 1, active());
    var node = domify(str).pop();
    size += 1;
    return node;
  };

  var add = function (src) {
    if(src instanceof Array) return src.forEach(add);
    els.images.appendChild(image(src));
    els.count.innerHTML = interpolate('%s/%s', pos, size);
  };

  var move = function (prev, next) {
    classes(el(id('image-' + prev))).remove('active');
    classes(el(id('image-' + next))).add('active');
    els.count.innerHTML = interpolate('%s/%s', next, size);
  };

  var first = function () {
    if(pos === 1) return false;
    if(pos === size) disable('last', 'next');
    move(pos, pos = 1);
    disable('prev', 'first');
  };

  var last = function () {
    if(pos === size) return false;
    if(pos === 1) disable('first', 'prev');
    move(pos, pos = size);
    disable('next', 'last');
    pos = size;
  };

  var next = function () {
    if(!enabled) return;
    if(pos === size) return first();
    move(pos, pos += 1);
    if(pos === size) disable('next', 'last');
    if(pos === 2) disable('prev', 'first');
  };

  var prev = function () {
    if(pos === 1) return last();
    move(pos, pos -= 1);
    if(pos === (size - 1)) disable('next', 'last');
    if(pos === 1) disable('prev', 'first');
  };

  var key = function (e) {
    if(!enabled) return;
    var tagName = e.target.tagName.toLowerCase();
    if(tagName === 'input' || tagName === 'textarea') return;
    if(!arrows[e.keyCode]) return;
    arrows[e.keyCode]();
  };

  var arrows = { 38: first, 37: prev, 39: next, 40: last }

  ev.bind(el(id('images')), 'click', next);
  ev.bind(el(id('first')), 'click', first);
  ev.bind(el(id('last')), 'click', last);
  ev.bind(el(id('prev')), 'click', prev);
  ev.bind(el(id('next')), 'click', next);
  ev.bind(document, 'keydown', key);

  returns.disable = function () {
    enabled = false;
  };

  returns.enable = function () {
    enabled = true;
  };

  returns.image = selected;
  returns.add = add;
  return returns;
};
});
require.alias("ramitos-interpolate/interpolate.js", "carousel/deps/interpolate/interpolate.js");
require.alias("ramitos-interpolate/interpolate.js", "carousel/deps/interpolate/index.js");

require.alias("component-classes/index.js", "carousel/deps/classes/index.js");
require.alias("component-indexof/index.js", "component-classes/deps/indexof/index.js");

require.alias("component-domify/index.js", "carousel/deps/domify/index.js");

require.alias("component-event/index.js", "carousel/deps/event/index.js");

require.alias("ramitos-sgen/src/sgen.js", "carousel/deps/sgen/src/sgen.js");
require.alias("ramitos-sgen/src/map.js", "carousel/deps/sgen/src/map.js");
require.alias("ramitos-sgen/src/sgen.js", "carousel/deps/sgen/index.js");

require.alias("carousel/src/carousel.js", "carousel/index.js");
