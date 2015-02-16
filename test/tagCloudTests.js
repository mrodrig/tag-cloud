var should = require('should'),
    tagCloud = require('.././lib/tagCloud'),
    fs = require('fs'),
    _ = require('underscore'),
    async = require('async');

var options = {
    randomize: false,
    classPrefix: 'tagCloud',
    additionalAttributes: {},
    numBuckets: 5,
    htmlTag: 'span'
};

var json_emptyTags      = require('./JSON/emptyTags'),
    json_singleTag      = require('./JSON/singleTag'),
    json_tenTags        = require('./JSON/tenTags'),
    json_twentyTags     = require('./JSON/twentyTags'),
    json_oneHundredTags = require('./JSON/oneHundredTags'),
    html_emptyTags      = '',
    html_singleTag      = '',
    html_tenTags        = '',
    html_twentyTags     = '',
    html_oneHundredTags = '';

var tagCloudTests = function () {
    // We can check the HTML is equivalent since we specify randomize to be false
    describe('/lib/tagCloud.js', function () {
        describe('Options Specified', function () {
            it('should convert no tags to an empty string', function(done) {
                tagCloud.tagCloud(json_emptyTags, function(err, html) {
                    html.should.equal(html_emptyTags);
                    html.length.should.equal(0);
                    return done();
                }, options);
            });

            it('should convert a single tag in the array to a html', function(done) {
                tagCloud.tagCloud(json_singleTag, function(err, html) {
                    html.should.equal(html_singleTag);
                    html.length.should.equal(html_singleTag.length);
                    return done();
                }, options);
            });

            it('should convert ten tags in the array to html', function(done) {
                tagCloud.tagCloud(json_tenTags, function(err, html) {
                    html.should.equal(html_tenTags);
                    html.length.should.equal(html_tenTags.length);
                    return done();
                }, options);
            });

            it('should convert twenty tags in the array to html', function(done) {
                tagCloud.tagCloud(json_twentyTags, function(err, html) {
                    html.should.equal(html_twentyTags);
                    html.length.should.equal(html_twentyTags.length);
                    return done();
                }, options);
            });

            it('should convert one hundred tags in the array to html', function(done) {
                tagCloud.tagCloud(json_oneHundredTags, function(err, html) {
                    html.should.equal(html_oneHundredTags);
                    html.length.should.equal(html_oneHundredTags.length);
                    return done();
                }, options);
            });
        });

        // Defaults to using randomized ordering. We need to verify the HTML length is the same as the desired
        //   and that each of the tags in the input appears in the output
        describe('Options Un-specified', function (done) {
            it('should convert no tags to an empty string', function(done) {
                tagCloud.tagCloud(json_emptyTags, function(err, html) {
                    html.length.should.equal(0);
                    return done();
                }, options);
            });

            it('should convert a single tag in the array to a html', function(done) {
                tagCloud.tagCloud(json_singleTag, function(err, html) {
                    html.length.should.equal(html_singleTag.length);
                    return done();
                }, options);
            });

            it('should convert ten tags in the array to html', function(done) {
                tagCloud.tagCloud(json_tenTags, function(err, html) {
                    html.length.should.equal(html_tenTags.length);
                    return done();
                }, options);
            });

            it('should convert twenty tags in the array to html', function(done) {
                tagCloud.tagCloud(json_twentyTags, function(err, html) {
                    html.length.should.equal(html_twentyTags.length);
                    return done();
                }, options);
            });

            it('should convert one hundred tags in the array to html', function(done) {
                tagCloud.tagCloud(json_oneHundredTags, function(err, html) {
                    html.length.should.equal(html_oneHundredTags.length);
                    return done();
                }, options);
            });
        });
    });
};

module.exports = {
    runTests: function () {
        describe('tag-cloud Tests', function() {
            before(function(done) {
                // Read in the desired output from a file
                async.parallel([
                        function(callback) {
                            fs.readFile('test/HTML/emptyTags.html', function(err, data) {
                                if (err) callback(err);
                                html_emptyTags = data.toString();
                                callback(null);
                            });
                        },
                        function(callback) {
                            fs.readFile('test/HTML/singleTag.html', function(err, data) {
                                if (err) callback(err);
                                html_singleTag = data.toString();
                                callback(null);
                            });
                        },
                        function(callback) {
                            fs.readFile('test/HTML/tenTags.html', function(err, data) {
                                if (err) callback(err);
                                html_tenTags = data.toString();
                                callback(null);
                            });
                        },
                        function(callback) {
                            fs.readFile('test/HTML/twentyTags.html', function(err, data) {
                                if (err) callback(err);
                                html_twentyTags = data.toString();
                                html_oneHundredTags = '';
                                _.range(5).forEach(function() {
                                    html_oneHundredTags += html_twentyTags;
                                });
                                callback(null);
                            });
                        }
                    ],
                    function(err, results) {
                        if (err) console.log(err);
                        done();
                    }
                );
            });

            // Run the tests
            tagCloudTests();
        });
    }
};