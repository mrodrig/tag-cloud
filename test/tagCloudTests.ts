import assert from 'assert';
import fs from 'fs';
import { tagCloud, fromStrings } from '../src/tagCloud';

import jsonEmptyTags from './JSON/emptyTags.json';
import jsonSingleTag from './JSON/singleTag.json';
import jsonTenTags from './JSON/tenTags.json';
import jsonTwentyTags from './JSON/twentyTags.json';
import jsonOneHundredTags from './JSON/oneHundredTags.json';

const options = {
    randomize: false,
    classPrefix: 'tagCloud',
    additionalAttributes: {
        href : { encode: true, value: 'http://google.com?q={{tag}}'},
        title : '{{tag}}'
    },
    replacements: [
        {find: '{filter}', replace: 'color=red'}
    ],
    numBuckets: 5,
    htmlTag: 'span'
};

let htmlEmptyTags      = '',
    htmlSingleTag      = '',
    htmlTenTags        = '',
    htmlTenTagsReplacements = '',
    htmlTwentyTags     = '',
    htmlTwentyTagsUniq = '',
    htmlOneHundredTags = '';

const tagCloudTests = () => {
    // We can check the HTML is equivalent since we specify randomize to be false
    describe('tagCloud.js', () => {
        describe('Options Specified', () => {
            it('should convert no tags to an empty string', async () => {
                const html = await tagCloud(jsonEmptyTags, options);
                assert.equal(html, htmlEmptyTags);
                assert.equal(html.length, 0);
            });

            it('should convert a single tag in the array to a html', async () => {
                const html = await tagCloud(jsonSingleTag, options);
                assert.equal(html, htmlSingleTag);
                assert.equal(html.length, htmlSingleTag.length);
            });

            it('should convert ten tags in the array to html', async () => {
                const html = await tagCloud(jsonTenTags, options);
                assert.equal(html, htmlTenTags);
                assert.equal(html.length, htmlTenTags.length);
            });

            it('should convert twenty tags in the array to html', async () => {
                const html = await tagCloud(jsonTwentyTags, options);
                assert.equal(html, htmlTwentyTags);
                assert.equal(html.length, htmlTwentyTags.length);
            });

            it('should convert one hundred tags in the array to html', async () => {
                const html = await tagCloud(jsonOneHundredTags, options);
                assert.equal(html, htmlOneHundredTags);
                assert.equal(html.length, htmlOneHundredTags.length);
            });
            
            it('should convert no tags with custom replacements to blank html', async () => {
                const options = {
                    randomize: false,
                    classPrefix: 'tagCloud',
                    additionalAttributes: {
                        href : { encode: true, value: 'http://google.com?q={{tag}}&{filter}'},
                        title : '{{tag}}'
                    },
                    replacements: [
                        {find: '{filter}', replace: 'color=red'}
                    ],
                    numBuckets: 5,
                    htmlTag: 'span'
                };

                const html = await tagCloud(jsonEmptyTags, options);
                assert.equal(html, htmlEmptyTags);
                assert.equal(html.length, htmlEmptyTags.length);
            });
            
            it('should convert tags with custom replacements to html', async () => {
                const options = {
                    randomize: false,
                    classPrefix: 'tagCloud',
                    additionalAttributes: {
                        href : { encode: true, value: 'http://google.com?q={{tag}}&{filter}'},
                        title : '{{tag}}'
                    },
                    replacements: [
                        {find: '{filter}', replace: 'color=red'}
                    ],
                    numBuckets: 5,
                    htmlTag: 'span'
                };

                const html = await tagCloud(jsonTenTags, options);
                assert.equal(html, htmlTenTagsReplacements);
                assert.equal(html.length, htmlTenTagsReplacements.length);
            });
        });

        // Defaults to using randomized ordering. We need to verify the HTML length is the same as the desired
        //   and that each of the tags in the input appears in the output
        describe('Options Un-specified', () => {
            it('should convert no tags to an empty string', async () => {
                const html = await tagCloud(jsonEmptyTags, options);
                assert.equal(html.length, 0);
            });

            it('should convert a single tag in the array to a html', async () => {
                const html = await tagCloud(jsonSingleTag, options);
                assert.equal(html.length, htmlSingleTag.length);
            });

            it('should convert ten tags in the array to html', async () => {
                const html = await tagCloud(jsonTenTags, options);
                assert.equal(html.length, htmlTenTags.length);
            });

            it('should convert twenty tags in the array to html', async () => {
                const html = await tagCloud(jsonTwentyTags, options);
                assert.equal(html.length, htmlTwentyTags.length);
            });

            it('should convert one hundred tags in the array to html', async () => {
                const html = await tagCloud(jsonOneHundredTags, options);
                assert.equal(html.length, htmlOneHundredTags.length);
            });
        });
    });

    describe('fromStrings', () => {
        it('should convert no tags to an empty string', async () => {
            const html = await fromStrings([], options);
            assert.equal(html, htmlEmptyTags);
            assert.equal(html.length, 0);
        });

        it('should convert one hundred tags in the array to html', async () => {
            const html = await fromStrings(jsonTwentyTags.map(t => t.tagName), options);
            assert.equal(html, htmlTwentyTagsUniq);
            assert.equal(html.length, htmlTwentyTagsUniq.length);
        });
    });
};

export function runTests () {
    describe('tag-cloud Tests', () => {
        before(async () => {
            // Read in the HTML test files
            try {
                await Promise.all([
                    fs.readFile('test/HTML/emptyTags.html', async (err, data) => {
                        if (err) throw err;
                        htmlEmptyTags = data.toString();
                    }),
                    fs.readFile('test/HTML/singleTag.html', async (err, data) => {
                        if (err) throw err;
                        htmlSingleTag = data.toString();
                    }),
                    fs.readFile('test/HTML/tenTags.html', async (err, data) => {
                        if (err) throw err;
                        htmlTenTags = data.toString();
                    }),
                    fs.readFile('test/HTML/tenTagsReplacements.html', async (err, data) => {
                        if (err) throw err;
                        htmlTenTagsReplacements = data.toString();
                    }),
                    fs.readFile('test/HTML/twentyTags.html', async (err, data) => {
                        if (err) throw err;
                        htmlTwentyTags = data.toString();
                        htmlOneHundredTags = '';
                        Array(5).fill(0).forEach(() => {
                            htmlOneHundredTags += htmlTwentyTags;
                        });
                    }),
                    fs.readFile('test/HTML/twentyTagsUnique.html', async (err, data) => {
                        if (err) throw err;
                        htmlTwentyTagsUniq = data.toString();
                    })
                ]);
            } catch (error) {
                console.error(error);
            }
        });

        // Run the tests
        tagCloudTests();
    });
}