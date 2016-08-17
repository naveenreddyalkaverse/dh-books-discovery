'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _md = require('md5');

var _md2 = _interopRequireDefault(_md);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EmptyArray = [];

exports.default = {
    books: {
        input: {
            source: {
                type: 'file'
            },
            format: {
                type: 'json-array',
                jsonPath: '*'
            }
        },
        output: {
            type: 'indexer',
            handler: 'upsert',
            indexType: 'book',
            memorySize: 8192,
            gcInterval: 50,
            concurrency: 1
        }
    },
    'book-stats': {
        input: {
            source: {
                type: 'file'
            },
            format: {
                type: 'json'
            }
        },
        mapper: {
            type: 'fn',
            fn: function fn(doc) {
                return {
                    id: _lodash2.default.get(doc, 'book_id'),
                    statsUpdateDate: _lodash2.default.get(doc, 'lastUpdated'),
                    viewCount: _lodash2.default.get(doc, 'detail_views.count'),
                    searchResultClickCount: _lodash2.default.get(doc, 'search_result_clicks.count'),
                    downloadCount: _lodash2.default.get(doc, 'downloads.count'),
                    buyClickCount: _lodash2.default.get(doc, 'buy_clicks.count'),
                    addToCardCount: _lodash2.default.get(doc, 'add_to_cart.count'),
                    purchasedCount: _lodash2.default.get(doc, 'purchases.count'),
                    profilerGivenScore: _lodash2.default.get(doc, 'overall_score')
                };
            }
        },
        output: {
            type: 'indexer',
            handler: 'partialUpdate',
            indexType: 'book',
            concurrency: 1,
            memorySize: 4096,
            gcInterval: 50
        },
        filter: function filter(doc, existingDoc) {
            return existingDoc && (!existingDoc.statsUpdateDate || existingDoc.statsUpdateDate < doc.statsUpdateDate);
        }
    },
    'search-logs': {
        input: {
            source: {
                type: 'file'
            },
            format: {
                type: 'log',
                regex: /([0-9a-f.:]+)\s+(-|.+?)\s+(-|.+?)\s+(-|.+?)\s+(.+?) \[([0-9]{2}\/[a-z]{3}\/[0-9]{4}:[0-9]{2}:[0-9]{2}:[0-9]{2}[^\]]*)] "(\S+?)\s(\S*?)\s?(\S+?)" ([0-9|\-]+) ([0-9|\-]+) (-|.+?) "(.+?)" "(.+?)" "(.+?)"/i, // eslint-disable-line max-len
                fields: ['client_ip', 'remote_id', 'user', 'unknown_1', 'time_taken', { ts: { type: 'date', format: 'DD/MMM/YYYY:HH:mm:ss ZZ' } }, 'method', { path: { transform: function transform(value) {
                            return _url2.default.parse(value, true);
                        } } }, 'http_version', 'status_code', 'size', 'unknown_2', 'user_agent', 'remote_ip', {
                    http_headers: {
                        transform: function transform(value) {
                            if (!value) {
                                return null;
                            }

                            var headers = {};
                            var headerStrings = value.split(/;|,/);
                            if (headerStrings && _lodash2.default.isArray(headerStrings) && headerStrings.length > 0) {
                                _lodash2.default.forEach(headerStrings, function (pair) {
                                    var values = pair.split('=');
                                    try {
                                        var processedValue = decodeURIComponent(values[1]).replace(/\++/mg, '').replace(/\n/mg, '');
                                        if (processedValue !== '-') {
                                            headers[values[0]] = JSON.parse(processedValue);
                                        }
                                    } catch (error) {
                                        // swallow error here
                                    }
                                });
                            }

                            return headers;
                        }
                    }
                }],
                transform: function transform(record) {
                    if (record.user_agent.match(/Pingdom/i) || !_lodash2.default.get(record, 'path.query.q') || _lodash2.default.get(record, 'path.query.start')) {
                        return null;
                    }

                    var languages = _lodash2.default.union(_lodash2.default.get(record, 'lang', '').split(',') || EmptyArray, _lodash2.default.get(record, 'http_headers.nhClientInfoV1.primaryLanguage', '').split(',') || EmptyArray, _lodash2.default.get(record, 'http_headers.nhClientInfoV1.secondaryLanguages', '').split(',') || EmptyArray);

                    languages = _lodash2.default.filter(languages, function (lang) {
                        return !_lodash2.default.isEmpty(lang);
                    });

                    if (!languages || _lodash2.default.isEmpty(languages)) {
                        languages = ['en'];
                    }

                    var query = _lodash2.default.trim(_lodash2.default.lowerCase(_lodash2.default.get(record, 'path.query.q')));
                    var queryTime = record.ts.getTime();
                    var hasResults = record.size !== 104;

                    return _lodash2.default.map(languages, function (lang) {
                        var key = (0, _md2.default)(lang + '/' + query);
                        return { key: key, query: query, queryTime: queryTime, hasResults: hasResults, lang: lang };
                    });
                }
            }
        },
        output: {
            type: 'indexer',
            handler: 'upsert',
            indexType: 'searchQuery',
            concurrency: 1,
            memorySize: 4096,
            gcInterval: 50
        }
    }
};