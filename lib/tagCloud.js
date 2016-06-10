'use strict';

var _ = require('underscore'); // Require underscore

// Default options; By using a function this is essentially a 'static' variable
var defaultOptions = {
    randomize: true,
    classPrefix: 'bucket',
    additionalAttributes: {},
    replacements: [],
    numBuckets: 10,
    htmlTag: 'span'
};

// Export the following functions that will be client accessible
module.exports = {

    /**
     * Client Accessible Tag Cloud Function (Promisifiable as of v1.0.5)
     * @param array Array of documents of form {tagName: String, count: Number} which will be used to generate the cloud
     * @param callback Function of (err, data) which handles the error (if any) and data returned
     * @param opts Document {optional} which contains any of the options from the API doc
     * @returns {*}
     */
    tagCloud: function (array, callback, opts) {
        // If this was promisified (callback and opts are swapped) then fix the argument order.
        if (_.isObject(callback) && !_.isFunction(callback)) {
            var func = opts;
            opts = callback;
            callback = func;
        }

        // Merge the options into the defaults
        opts = _.defaults(opts || {}, defaultOptions);
        // Shuffle the elements in the array to pseudo-randomize the tagCloud ordering
        var min = _.min(array, function(value) { return value.count; }).count,
            max = _.max(array, function(value) { return value.count; }).count,
            diff = (max - min),
        // Split the number of tags into the buckets as evenly as possible
            numTagsPerBucket = ((diff || 1)/(opts.numBuckets - 1));
        array = _.map(array, function (tag) {
            if (tag.count < 0) { return callback(new Error('All tag counts must be greater than zero.')); }
            var attributes = _.defaults({
                class: opts.classPrefix + determineBucket(min, numTagsPerBucket, tag.count)
            }, opts.additionalAttributes);
            return generateHTMLTag(opts.htmlTag, attributes, opts.replacements, tag.tagName);
        });
        if (opts.randomize) { array = _.shuffle(array); }
        var html = array.join('');
        return callback(null, html);
    }
};

/**
 * Generates an HTML String with the given data
 * @param tagType String tag type (ie. div, span, etc.)
 * @param attributes Document {key : value}
 * @param replacements Array [{find : <String>, replace: <String>}, ...]
 * @param text String inner text of the HTML tag
 * @returns {string} HTML String value
 */
var generateHTMLTag = function (tagType, attributes, replacements, tagText) {
    var html = '<{tag}'.replace(/{tag}/, tagType);
    var keys = _.keys(attributes);

    // For each additional attribute, add it into the HTML
    _.each(keys, function (key) {
        var value = attributes[key],
            attrTag = tagText;
        if (_.isObject(value)) {
            // If encode is specified for this key, encode the text
            attrTag = value.encode ? encodeURIComponent(tagText) : tagText;
            value = value.value;
        }
        html += generateHTMLAttribute(key, value, attrTag, replacements);
    });

    html += '>{text}</{tag}>'.replace(/{text}/, tagText).replace(/{tag}/, tagType);
    return html;
};

var generateHTMLAttribute = function (key, value, tagText, replacements) {
    return performReplacements(' {key}="{value}"', 
    [ 
        { find: '{key}', replace: key }, 
        { find: '{value}', replace: value }, 
        { find: '{{tag}}', replace: tagText }
    ].concat(replacements || []));
};

var performReplacements = function (str, replacements) {
    _.each(replacements, function (replacementDoc) {
        str = str.replace(replacementDoc.find, replacementDoc.replace);
    });
    return str;
};

/**
 * Determines the appropriate bucket number for the tag
 * @param min Number value of the minimum tag count
 * @param numTagsPerBucket Number value of the number of tags per bucket
 * @param count Number current tag's count value
 * @returns {number} returns the bucket number for the tag
 */
var determineBucket = function (min, numTagsPerBucket, count) {
    return Math.floor((count - min) / numTagsPerBucket);
};
