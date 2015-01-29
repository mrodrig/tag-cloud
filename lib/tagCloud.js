'use strict';

var _ = require('underscore'); // Require underscore

// Default options; By using a function this is essentially a 'static' variable
var defaultOptions = {
    randomize: true,
    classPrefix: 'bucket',
    additionalAttributes: {},
    numBuckets: 10,
    htmlTag: 'span'
};

// Export the following functions that will be client accessible
module.exports = {

    /**
     * Client Accessible Tag Cloud Function
     * @param array Array of documents of form {tagName: String, count: Number} which will be used to generate the cloud
     * @param callback Function of (err, data) which handles the error (if any) and data returned
     * @returns {string}
     */
    tagCloud: function (array, callback, opts) {
        try {
            // Merge the options into the defaults
            opts = _.defaults(opts || {}, defaultOptions);
            // HTML String Accumulator
            var html = '';
            // Shuffle the elements in the array to pseudo-randomize the tagCloud ordering
            if (opts.randomize) { array = _.shuffle(array); }
            var min = _.min(array, function(value) { return value.count; }).count,
                max = _.max(array, function(value) { return value.count; }).count,
                diff = max - min,
                // Split the number of tags into the buckets as evenly as possible
                numTagsPerBucket = Math.ceil(array.length/opts.numBuckets);
            _.each(array, function (tag, indx) {
                var attributes = _.defaults({
                    class: opts.classPrefix + determineBucket(min, numTagsPerBucket, tag.count)
                }, opts.additionalAttributes);
                html += generateHTMLTag(opts.htmlTag, attributes, tag.tagName);
            });
            return callback(null, html);
        } catch (e) {
            return callback(e);
        }
    }
};

/**
 * Generates an HTML String with the given data
 * @param tagType String tag type (ie. div, span, etc.)
 * @param attributes Document {key : value}
 * @param text String inner text of the HTML tag
 * @returns {string} HTML String value
 */
var generateHTMLTag = function (tagType, attributes, text) {
    var html = '<{tag}'.replace(/{tag}/, tagType);
    var keys = _.keys(attributes);
    _.each(keys, function (key, indx) {
        html += ' {key}="{value}" '.replace(/{key}/, key).replace(/{value}/, attributes[key]);
    });
    html += '>{text}</{tag}>'.replace(/{text}/, text).replace(/{tag}/, tagType);
    return html;
};

/**
 * Determines the appropriate bucket number for the tag
 * @param min Number value of the minimum tag count
 * @param numTagsPerBucket Number value of the number of tags per bucket
 * @param count Number current tag's count value
 * @returns {number} returns the bucket number for the tag
 */
var determineBucket = function (min, numTagsPerBucket, count) {
   return Math.ceil((count - min) / numTagsPerBucket);
};
