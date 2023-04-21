'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagCloud = void 0;
// Default options
const defaultOptions = {
    randomize: true,
    classPrefix: 'bucket',
    additionalAttributes: {},
    replacements: [],
    numBuckets: 10,
    htmlTag: 'span'
};
/**
 * Client Accessible Tag Cloud Function
 * @param array Array of documents of form {tagName: String, count: Number} which will be used to generate the cloud
 * @param callback Function of (err, data) which handles the error (if any) and data returned
 * @param opts Document {optional} which contains any of the options from the API doc
 * @returns {*}
 */
async function tagCloud(array, options) {
    // Merge the options with the defaults
    const opts = Object.assign(options ?? {}, defaultOptions);
    // Get the min, max, and difference between them
    const counts = array.map(i => i.count), min = Math.min(...counts), max = Math.max(...counts), diff = (max - min), 
    // Split the number of tags into the buckets as evenly as possible
    numTagsPerBucket = (diff || 1) / (opts.numBuckets - 1);
    const tags = array.map(tag => {
        if (tag.count < 0) {
            throw new Error('All tag counts must be greater than zero.');
        }
        const attributes = Object.assign({
            class: opts.classPrefix + determineBucket(min, numTagsPerBucket, tag.count)
        }, opts.additionalAttributes);
        return generateHTMLTag(opts.htmlTag, attributes, opts.replacements, tag.tagName);
    });
    // Shuffle the elements in the array to pseudo-randomize the tagCloud ordering
    if (opts.randomize) {
        return tags.sort(() => 0.5 - Math.random());
    }
    return tags.join('');
}
exports.tagCloud = tagCloud;
/**
 * Generates an HTML String with the given data
 * @param tagType String tag type (ie. div, span, etc.)
 * @param attributes Document {key : value}
 * @param replacements Array [{find : <String>, replace: <String>}, ...]
 * @param tagText String inner text of the HTML tag
 * @returns {string} HTML String value
 */
function generateHTMLTag(tagType, attributes, replacements, tagText) {
    const keys = Object.keys(attributes);
    let html = `<${tagType}`;
    // For each additional attribute, add it into the HTML
    keys.forEach((key) => {
        let value = attributes[key], attrTag = tagText;
        if (typeof value === 'object') {
            // If encode is specified for this key, encode the text
            attrTag = value.encode ? encodeURIComponent(tagText) : tagText;
            value = value.value;
        }
        html += generateHTMLAttribute(key, value, attrTag, replacements);
    });
    html += `>${tagText}</${tagType}>`;
    return html;
}
/**
 * Generates html attributes
 */
function generateHTMLAttribute(key, value, tagText, replacements) {
    return performReplacements(' {key}="{value}"', [
        { find: '{key}', replace: key },
        { find: '{value}', replace: value },
        { find: '{{tag}}', replace: tagText }
    ].concat(replacements || []));
}
function performReplacements(str, replacements) {
    replacements.forEach(replacementDoc => {
        str = str.replace(replacementDoc.find, replacementDoc.replace);
    });
    return str;
}
/**
 * Determines the appropriate bucket number for the tag
 * @param min value of the minimum tag count
 * @param numTagsPerBucket value of the number of tags per bucket
 * @param count current tag's count value
 * @returns returns the bucket number for the tag
 */
function determineBucket(min, numTagsPerBucket, count) {
    return Math.floor((count - min) / numTagsPerBucket);
}
