'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.aggregators = exports.types = exports.indices = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _md = require('md5');

var _md2 = _interopRequireDefault(_md);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Config = require('config-boilerplate/lib/Config');

var _Config2 = _interopRequireDefault(_Config);

var _analysis_setting = require('humane-indexer/lib/schemas/analysis_setting');

var _analysis_setting2 = _interopRequireDefault(_analysis_setting);

var _book_mapping = require('./schemas/book_mapping');

var _book_mapping2 = _interopRequireDefault(_book_mapping);

var _autocomplete_mapping = require('./schemas/autocomplete_mapping');

var _autocomplete_mapping2 = _interopRequireDefault(_autocomplete_mapping);

var _search_query_mapping = require('./schemas/search_query_mapping');

var _search_query_mapping2 = _interopRequireDefault(_search_query_mapping);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers


var envConfig = new _Config2.default('dh-books/env', _path2.default.resolve(__dirname, '../envConfig'));

var indices = exports.indices = {
    book: {
        store: envConfig.bookStore,
        analysis: _analysis_setting2.default
    },
    autocomplete: {
        store: envConfig.autocompleteStore,
        analysis: _analysis_setting2.default
    },
    searchQuery: {
        store: envConfig.searchQueryStore,
        analysis: _analysis_setting2.default
    }
};

var types = exports.types = {
    book: {
        index: indices.book.store,
        type: 'book',
        mapping: _book_mapping2.default,
        transform: function transform(doc) {
            // fix doc view count
            doc.viewCount = (doc.viewCount || 0) <= (doc.downloadCount || 0) ? (doc.downloadCount || 0) * 10 : doc.viewCount || 0;

            // build per
            _lodash2.default.forEach(doc.prices || [], function (price) {
                doc['price_' + _lodash2.default.upperCase(price.currency)] = price;
            });

            return doc;
        },
        id: function id(doc) {
            return doc.id;
        },
        filter: function filter(doc) {
            return _lodash2.default.isUndefined(doc.approvalStatus) || doc.approvalStatus === 0;
        },
        weight: function weight(doc) {
            return _lodash2.default.get(doc, 'viewCount', 0) + _lodash2.default.get(doc, 'searchResultClickCount', 0) + 10 * _lodash2.default.get(doc, 'downloadCount', 0) + 25 * _lodash2.default.get(doc, 'addToCardCount', 0) + 100 * _lodash2.default.get(doc, 'buyClickCount', 0) + 500 * _lodash2.default.get(doc, 'purchasedCount', 0) + _lodash2.default.get(doc, 'rating', 0) / 5 * _lodash2.default.get(doc, 'ratingCount', 0);
        }
    },
    authorAutocomplete: {
        index: indices.autocomplete.store,
        type: 'authorAutocomplete',
        mapping: _autocomplete_mapping2.default,
        id: function id(doc) {
            return doc.key;
        },
        filter: function filter(doc) {
            return doc.bookCount > 0;
        },
        child: true
    },
    categoryAutocomplete: {
        index: indices.autocomplete.store,
        type: 'categoryAutocomplete',
        mapping: _autocomplete_mapping2.default,
        id: function id(doc) {
            return doc.key;
        },
        filter: function filter(doc) {
            return doc.bookCount > 0;
        },
        child: true
    },
    publisherAutocomplete: {
        index: indices.autocomplete.store,
        type: 'publisherAutocomplete',
        mapping: _autocomplete_mapping2.default,
        id: function id(doc) {
            return doc.key;
        },
        filter: function filter(doc) {
            return doc.bookCount > 0;
        },
        child: true
    },
    searchQuery: {
        index: indices.searchQuery.store,
        type: 'searchQuery',
        mapping: _search_query_mapping2.default,
        id: function id(doc) {
            return doc.key;
        },
        mode: 'aggregate',
        aggregateBuilder: function aggregateBuilder(existingDoc, newDoc) {
            return { key: newDoc.key, lang: newDoc.lang, query: newDoc.query, unicodeQuery: newDoc.unicodeQuery, hasResults: newDoc.hasResults };
        },
        measures: [{ count: 'COUNT' }, { weight: function weight(doc) {
                return doc.count;
            } }]
    }
};

function buildBookData(fieldData) {
    var value = fieldData.value;
    var transValue = fieldData.transValue;
    var id = fieldData.id;
    var unicodeValue = fieldData.unicodeValue;
    var lang = fieldData.lang;


    if (!unicodeValue) {
        unicodeValue = value;

        if (!lang) {
            lang = 'en';
        }
    }

    if (!lang) {
        lang = 'xx';
    }

    var key = (0, _md2.default)(lang + '.' + (unicodeValue || value));

    return { key: key, value: value, unicodeValue: unicodeValue, transValue: transValue, lang: lang, id: id };
}

var aggregators = exports.aggregators = {
    book: {
        measures: ['viewCount', 'searchResultClickCount', 'downloadCount', 'addToCardCount', 'buyClickCount', 'purchasedCount', 'ratingCount', {
            rating: { type: 'WEIGHTED_AVERAGE', weight: 'ratingCount', round: 1 }
        }, {
            bookCount: 'COUNT'
        }, {
            weight: function weight(doc) {
                return _lodash2.default.get(doc, 'viewCount', 0) + _lodash2.default.get(doc, 'searchResultClickCount', 0) + 10 * _lodash2.default.get(doc, 'downloadCount', 0) + 25 * _lodash2.default.get(doc, 'addToCardCount', 0) + 100 * _lodash2.default.get(doc, 'buyClickCount', 0) + 500 * _lodash2.default.get(doc, 'purchasedCount', 0) + _lodash2.default.get(doc, 'rating', 0) / 5 * _lodash2.default.get(doc, 'ratingCount', 0);
            }
        }],

        aggregates: {
            publisher: {
                field: 'publisher',
                indexType: types.publisherAutocomplete,
                aggregateBuilder: function aggregateBuilder(doc, field) {
                    return buildBookData({
                        id: field.publisherId,
                        value: _lodash2.default.trim(field.publisherEngName),
                        unicodeValue: _lodash2.default.trim(field.publisherName),
                        transValue: _lodash2.default.trim(field.publisherTransName),
                        lang: doc.lang
                    });
                }
            },
            author: {
                field: 'creators',
                indexType: types.authorAutocomplete,
                aggregateBuilder: function aggregateBuilder(doc, field) {
                    return buildBookData({
                        value: _lodash2.default.trim(field.creator),
                        unicodeValue: _lodash2.default.trim(field.creatorUnicode),
                        transValue: _lodash2.default.trim(field.creatorTrans),
                        lang: doc.lang
                    });
                }
            },
            category: {
                field: 'categories',
                indexType: types.categoryAutocomplete,
                aggregateBuilder: function aggregateBuilder(doc, field) {
                    return buildBookData({
                        id: field.id,
                        value: _lodash2.default.trim(field.title),
                        unicodeValue: _lodash2.default.trim(field.titleUnicode),
                        transValue: _lodash2.default.trim(field.titleTrans),
                        lang: field.language || doc.lang
                    });
                }
            }
        }
    }
};