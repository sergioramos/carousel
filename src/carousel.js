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
    var tmpid = sgen(3);
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

  var image = function (src) {
    if(size === 0) disable('next', 'last');
    var str = interpolate(templates.image, src, id(), size + 1, active());
    var node = domify(str);
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
  };

  var first = function () {
    if(pos === 1) return;
    if(pos === size) disable('last', 'next');
    move(pos, pos = 1);
    disable('prev', 'first');
  };

  var last = function () {
    if(pos === size) return;
    if(pos === 1) disable('first', 'prev');
    move(pos, pos = size);
    disable('next', 'last');
    pos = size;
  };

  var next = function () {
    if(pos === size) return;
    move(pos, pos += 1);
    if(pos === size) disable('next', 'last');
    if(pos === 2) disable('prev', 'first');
  };

  var prev = function () {
    if(pos === 1) return;
    move(pos, pos -= 1);
    if(pos === (size - 1)) disable('next', 'last');
    if(pos === 1) disable('prev', 'first');
  };

  var key = function (e) {
    if(e.target.tagName.toLowerCase() === 'input') return;
    if(!arrows[e.keyCode]) return;
    arrows[e.keyCode]();
  };

  var arrows = { 38: first, 37: prev, 39: next, 40: last }

  ev.bind(el(id('first')), 'click', first);
  ev.bind(el(id('last')), 'click', last);
  ev.bind(el(id('next')), 'click', next);
  ev.bind(el(id('prev')), 'click', prev);
  ev.bind(document, 'keydown', key)

  returns.add = add;
  return returns;
};