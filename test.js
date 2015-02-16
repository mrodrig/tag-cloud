var tagCloud = require('./lib/tagCloud');
var tags = require('./test/JSON/twentyTags');

/* Option 1 */
tagCloud.tagCloud(tags, function (err, data) {
    console.log(data);
},{
    randomize: false,
    classPrefix: 'tagCloud',
    additionalAttributes: {},
    numBuckets: 5,
    htmlTag: 'span'
});
