# Node Tag Cloud HTML Generator

[![Build Status](https://travis-ci.org/mrodrig/tag-cloud.svg?branch=master)](https://travis-ci.org/mrodrig/tag-cloud)
[![bitHound Dependencies](https://www.bithound.io/github/mrodrig/tag-cloud/badges/dependencies.svg)](https://www.bithound.io/github/mrodrig/tag-cloud/master/dependencies/npm)
[![Downloads](http://img.shields.io/npm/dm/tag-cloud.svg)](https://www.npmjs.org/package/tag-cloud)
[![NPM version](https://img.shields.io/npm/v/tag-cloud.svg)](https://www.npmjs.org/package/tag-cloud)
[![bitHound Score](https://www.bithound.io/github/mrodrig/tag-cloud/badges/score.svg)](https://www.bithound.io/github/mrodrig/tag-cloud)

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
  * `htmlTag` - String - The HTML tag name (ie. 'span') that you would like to be used. [Default: 'span']
  * `classPrefix` - String - Class prefix for the tag classes that are generated [Default: 'bucket']
  * `replacements` - Array - An array of Documents which represent replacements that should occur on attributes.
    * Each document should be of the form: `{ find: 'valueToBeReplaced', replace: 'valueToBeInserted' }`
    * This allows additional custom values to be inserted into attributes for further customization (ie. specifying conditional filters in URLs)
  * `additionalAttributes` - Document - A JSON document specifying any additional values that you would like to be added to the tag's HTML as an attribute [Default: {}]
    * If you would like to customize one of the fields to include the tag's text in the value, just use {{tag}} which will be replaced by the actual tag.
        * Example: ```{href: 'http://google.com?q={{tag}}'}```
    * If your tags include special characters (ie. C#) and you need to use the tag in a URL, then you can specify the value as an Object
        * Example: ```{ href : { encode : true, value: 'http://google.com?q={{tag}}' } } ```

##### tagCloud Example:

```javascript

var tagCloud = require('tag-cloud');

var tags = [
    {tagName: 'js', count: 5},
    {tagName: 'css', count: 9},
    {tagName: 'less', count: 13},
    {tagName: 'rest', count: 2}
];


/* Option 1 */
tagCloud.tagCloud(tags, function (err, data) {
    console.log(err, data);
});

/* Option 2 */
tagCloud.tagCloud(tags, function (err, data) {
    console.log(err, data);
}, {
    randomize: false
});

var promise = require('bluebird');
promise.promisifyAll(tagCloud);

/* Option 3 */
tagCloud.tagCloudAsync(tags)
    .then( function (html) {
        console.log(html);
    })
    .catch( function (err) {
        console.log(err);
    });

/* Option 4 */
tagCloud.tagCloudAsync(tags, {
    randomize: false
})
    .then( function (html) {
        console.log(html);
    })
    .catch( function (err) {
        console.log(err);
    });
```

Options 1 and 2 above both print out:

```html
null '<span class="bucket2" >js</span><span class="bucket4" >css</span><span class="bucket6" >less</span><span class="bucket0" >rest</span>'
```

Options 3 and 4 above both print out:

```html
<span class="bucket2" >js</span><span class="bucket4" >css</span><span class="bucket6" >less</span><span class="bucket0" >rest</span>
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

## Example

Your tag cloud can be styled to look like this:
![Tag Cloud Example](https://raw.githubusercontent.com/mrodrig/tag-cloud/master/demo/example.png)

To see the HTML and CSS used to create this, please look at the [demo](https://github.com/mrodrig/tag-cloud/tree/master/demo).

## Tests

```bash
$ npm test
```

_Note_: This requires `mocha`, `should`, `async`, and `underscore`.

## Features

- HTML Tag Cloud Generation
- Customizable HTML Classes
- Ability to add additional attributes to each HTML entity created
- Randomization to keep the tag cloud interesting
- Classes of the form 'bucket1' to allow for easy CSS styling and customization
- Ability to serve the generated HTML out via a route
