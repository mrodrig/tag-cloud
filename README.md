# Node Tag Cloud HTML Generator

[![Build Status](https://travis-ci.org/mrodrig/tag-cloud.svg?branch=master)](https://travis-ci.org/mrodrig/tag-cloud)
![David - Dependency Checker Icon](https://david-dm.org/mrodrig/tag-cloud.png "tag-cloud Dependency Status")
[![NPM version](http://img.shields.io/npm/dm/tag-cloud.svg)](https://www.npmjs.org/package/tag-cloud)
[![NPM version](https://img.shields.io/npm/v/tag-cloud.svg)](https://www.npmjs.org/package/tag-cloud)

This node module will take an array of tags and counts and generate a Tag/Word Cloud.

## Installation

```bash
$ npm install tag-cloud
```

## Usage

```javascript
var tagCloud = require('tag-cloud');
```

### API

#### tagCloud(array, callback, options)

* `array` - An array of JSON documents of the form {tagName: <String>, count: <Number>}
* `callback` - A function of the form `function (err, html)`; This function will receive any errors and/or the HTML generated.
* `options` - (Optional) A JSON document specifying any of the following fields:
  * `randomize` - Boolean - Indicates whether the tags should be shuffled before the Tag Cloud is generated. [Default: true]
  * `numBuckets` - Number - Number of buckets to utilize [Default: 10]
  * `classPrefix` - String - Class prefix for the tag classes that are generated [Default: 'bucket'
  * `additionalAttributes` - Document - A JSON document specifying any additional values that you would like to be added to the tag's HTML as an attribute [Default: {}]

##### tagCloud Example:

```javascript

var tagCloud = require('tag-cloud');

var tags = [
    {tagName: 'js', count: 5},
    {tagName: 'css', count: 9},
    {tagName: 'less', count: 13},
    {tagName: 'rest', count: 2}
]

tagCloud.tagCloud(tags, function (err, data) {
    console.log(err, data);
})

```

The above code prints out:

```html
null '<span class="bucket2" >js</span><span class="bucket4" >css</span><span class="bucket6" >less</span><span class="bucket0" >rest</span>'
```

The HTML can then be styled with CSS as such:

```css
.bucket1 {
  color: red;
}

.bucket2 {
  color: blue;
}

.bucket3 {
  color: yellow;
}
```

## Tests

No tests are currently added. These will be added soon.

## Features

- HTML Tag Cloud Generation
- Classes of the form 'bucket1' to allow for easy CSS styling and customization
- Ability to serve the generated HTML out via a route
