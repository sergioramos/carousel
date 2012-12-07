# carousel

image carousel [demo](http://ramitos.github.com/carousel)

## installation

for [component](https://github.com/component/component):

    $ component install ramitos/carousel

## usage

```js
var carousel = require('carousel');
var cats = carousel(document.getElementById('carousel-container'));

setInterval(function () {
  var height = Math.floor(Math.random() * 500) + 100;
  var width = Math.floor(Math.random() * 500) + 100;
  var url = "http://placekitten.com/g/" + width + "/" + height;
  carousel.add(url);
}, 1000)
```

## api

#### void add(url: string)

add an image url to the carousel

#### number image()

retrieve the selected image position

#### void disable()

disable all carousel controls

#### void enable()

enable all carousel controls

## license

MIT