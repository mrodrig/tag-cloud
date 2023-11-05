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

const tagCloudTests = ({
    htmlEmptyTags,
    htmlSingleTag,
    htmlTenTags,
    htmlTenTagsReplacements,
    htmlTwentyTags,
    htmlTwentyTagsUniq,
    htmlOneHundredTags
}: Record<string, string>) => {
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

function initializeTestData() {
    const testData = {
        htmlEmptyTags: fs.readFileSync('test/HTML/emptyTags.html').toString(),
        htmlSingleTag: fs.readFileSync('test/HTML/singleTag.html').toString(),
        htmlTenTags: fs.readFileSync('test/HTML/tenTags.html').toString(),
        htmlTenTagsReplacements: fs.readFileSync('test/HTML/tenTagsReplacements.html').toString(),
        htmlTwentyTags: fs.readFileSync('test/HTML/twentyTags.html').toString(),
        htmlOneHundredTags: '', // Generated below
        htmlTwentyTagsUniq: fs.readFileSync('test/HTML/twentyTagsUnique.html').toString()
    };

    Array(5).fill(0).forEach(() => {
        testData.htmlOneHundredTags += testData.htmlTwentyTags;
    });

    return testData;
}

export function runTests () {
    describe('tag-cloud Tests', () => {
        const testData = initializeTestData();

        // Run the tests
        tagCloudTests(testData);
    });
}