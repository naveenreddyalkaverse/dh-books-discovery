'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.searchResult = exports.autocomplete = exports.views = exports.languageMap = exports.secondaryLanguages = exports.primaryLanguages = exports.cockpitName = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _md = require('md5');

var _md2 = _interopRequireDefault(_md);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Languages = [{ key: 'English', code: 'en', unicode: 'English' }, { key: 'Hindi', code: 'hi', unicode: 'हिंदी' }, { key: 'Bengali', code: 'bn', unicode: 'বাংলা' }, { key: 'Marathi', code: 'mr', unicode: 'मराठी' }, { key: 'Tamil', code: 'ta', unicode: 'தமிழ்' }, { key: 'Malayalam', code: 'ml', unicode: 'മലയാളം' }, { key: 'Kannada', code: 'kn', unicode: 'ಕನ್ನಡ' }, { key: 'Gujrati', code: 'gu', unicode: 'ગુજરાતી' }, { key: 'Telugu', code: 'te', unicode: 'తెలుగు' }, { key: 'Oriya', code: 'or', unicode: 'ଓଡିଆ' }];

var LanguageMap = _lodash2.default.keyBy(Languages, 'code');

var cockpitName = exports.cockpitName = 'DailyHunt Books Cockpit';
var primaryLanguages = exports.primaryLanguages = Languages;
var secondaryLanguages = exports.secondaryLanguages = Languages;
var languageMap = exports.languageMap = LanguageMap;

function buildDataView(type, lang, requireVernacularValue) {
    return {
        type: 'data',
        name: lang.unicode + ' (' + lang.key + ')',
        key: (0, _md2.default)(type + '/' + lang.code + '/' + (requireVernacularValue || false)),
        params: { type: type, filter: { lang: lang.code, requireVernacularValue: requireVernacularValue } },
        fields: [{ Unicode: 'unicodeValue' }, { 'English (Manual/Auto)': 'value' }, { 'English (Auto)': 'transValue' }, { Books: 'bookCount' }],
        notes: ['All \'Unicode\' field values must be in ' + languageMap[lang.code].unicode + ' (' + languageMap[lang.code].key + ').', 'All \'English (transliterated)\' field values must be in English and shall be <strong>transliteration</strong> of \'Unicode\' field.']
    };
}

function buildSearchQueryView(lang, hasResults) {
    return {
        type: 'data',
        name: lang.unicode + ' (' + lang.key + ')',
        key: (0, _md2.default)('searchQuery/' + lang.code + '/' + (hasResults || false)),
        params: { type: 'searchQuery', filter: { lang: lang.code, hasResults: hasResults } },
        fields: [{ Query: 'query' }, { Count: 'count' }]
    };
}

var views = exports.views = [{
    name: 'Values that require vernacular',
    type: 'group',
    items: [{
        name: 'Author',
        type: 'group',
        items: (0, _lodash2.default)(Languages).filter(function (lang) {
            return lang.code !== 'en';
        }).map(function (lang) {
            return buildDataView('author', lang, true);
        }).value()
    }, {
        name: 'Publisher',
        type: 'group',
        items: (0, _lodash2.default)(Languages).filter(function (lang) {
            return lang.code !== 'en';
        }).map(function (lang) {
            return buildDataView('publisher', lang, true);
        }).value()
    }, {
        name: 'Category',
        type: 'group',
        items: (0, _lodash2.default)(Languages).filter(function (lang) {
            return lang.code !== 'en';
        }).map(function (lang) {
            return buildDataView('category', lang, true);
        }).value()
    }]
}, {
    name: 'All values',
    type: 'group',
    items: [{
        name: 'Author',
        type: 'group',
        items: _lodash2.default.map(Languages, function (lang) {
            return buildDataView('author', lang);
        })
    }, {
        name: 'Publisher',
        type: 'group',
        items: _lodash2.default.map(Languages, function (lang) {
            return buildDataView('publisher', lang);
        })
    }, {
        name: 'Category',
        type: 'group',
        items: _lodash2.default.map(Languages, function (lang) {
            return buildDataView('category', lang);
        })
    }, {
        name: 'Search Queries that has results',
        type: 'group',
        items: _lodash2.default.map(Languages, function (lang) {
            return buildSearchQueryView(lang, true);
        })
    }, {
        name: 'Search Queries that has no results',
        type: 'group',
        items: _lodash2.default.map(Languages, function (lang) {
            return buildSearchQueryView(lang, false);
        })
    }]
}];

var autocomplete = exports.autocomplete = {
    author: {
        name: 'Author',
        statFields: [// score and weight are default.
        { Downloads: 'downloadCount' }, { Purchases: 'purchasedCount' }, { Views: 'viewCount' }, { Rating: 'rating' }, { Ratings: 'ratingCount' }, { Books: 'bookCount' }],
        displayField: 'unicodeValue',
        searchMode: 'autocomplete:entity',
        searchType: 'author_entity'
    },
    category: {
        name: 'Category',
        statFields: [{ Downloads: 'downloadCount' }, { Purchases: 'purchasedCount' }, { Views: 'viewCount' }, { Rating: 'rating' }, { Ratings: 'ratingCount' }, { Books: 'bookCount' }],
        displayField: 'unicodeValue',
        searchMode: 'autocomplete:entity',
        searchType: 'category_entity'
    },
    publisher: {
        name: 'Publisher',
        statFields: [{ Downloads: 'downloadCount' }, { Purchases: 'purchasedCount' }, { Views: 'viewCount' }, { Rating: 'rating' }, { Ratings: 'ratingCount' }, { Books: 'bookCount' }],
        displayField: 'unicodeValue',
        searchMode: 'autocomplete:entity',
        searchType: 'publisher_entity'
    },
    book: {
        name: 'Book',
        statFields: [{ Downloads: 'downloadCount' }, { Purchases: 'purchasedCount' }, { Views: 'viewCount' }, { Rating: 'rating' }, { Ratings: 'ratingCount' }],
        valueField: 'title',
        unicodeValueField: 'titleUnicode',
        displayField: 'titleUnicode'
    },
    searchQuery: {
        name: 'Search Query',
        statFields: [{ Count: 'count' }],
        valueField: 'query',
        unicodeValueField: 'unicodeQuery',
        displayField: 'query',
        searchMode: 'autocomplete:popular_search',
        searchType: 'book'
    }
};

var searchResult = exports.searchResult = {
    book: {
        fields: [// Id and Score are default fields
        {
            Cover: {
                field: 'coverImage',
                type: 'Image',
                transform: function transform(value) {
                    if (!value) return null;

                    return value.replace(/^\/images/, 'http://books.newshunt.com/NHBooks/data').replace(/\{0}\{1}/, 'cover');
                }
            }
        }, {
            'Title Unicode': 'titleUnicode'
        }, {
            Title: 'title'
        }, {
            'Title Trans': 'titleTrans'
        }, {
            'Author Unicode': ['creators', 0, 'creatorUnicode']
        }, {
            Author: ['creators', 0, 'creator']
        }, {
            'Author Trans': ['creators', 0, 'creatorTrans']
        }, {
            'Publisher Unicode': ['publisher', 'publisherName']
        }, {
            Publisher: ['publisher', 'publisherEngName']
        }, {
            'Publisher Trans': ['publisher', 'publisherTransName']
        }, {
            'Release Date': {
                field: 'acquisitionDate',
                type: 'Date' // default format: MMM Do YYYY
            }
        }, {
            'Release Period': {
                field: 'acquisitionDate',
                type: 'Duration'
            }
        }, {
            'Lang Unicode': {
                field: 'lang',
                transform: function transform(value, context) {
                    return value && context && context.appProperties && context.appProperties.getIn(['languageMap', value, 'unicode'], value) || value;
                }
            }
        }, {
            Lang: {
                field: 'lang',
                transform: function transform(value, context) {
                    return value && context && context.appProperties && context.appProperties.getIn(['languageMap', value, 'key'], value) || value;
                }
            }
        }, {
            Categories: {
                field: 'categories',
                type: 'Table',
                idField: 'id',
                tableFields: [{ Unicode: 'titleUnicode' }, { English: 'title' }, { Trans: 'titleTrans' }]
            }
        }, {
            Tags: {
                field: 'tags',
                type: 'Chip'
            }
        }, {
            'Description Unicode': 'descriptionUnicode'
        }, {
            Description: 'description'
        }, {
            'Description Trans': 'descriptionTrans'
        }],
        statFields: [{ Downloads: 'downloadCount' }, { Purchases: 'purchasedCount' }, { Views: 'viewCount' }, { Rating: 'rating' }, { Ratings: 'ratingCount' }]
    }
};