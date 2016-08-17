'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.eventHandlers = exports.views = exports.search = exports.autocomplete = exports.matchTypeBoosts = exports.types = exports.inputAnalyzer = exports.defaultSortOrder = exports.indices = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Config = require('config-boilerplate/lib/Config');

var _Config2 = _interopRequireDefault(_Config);

var _Beacon = require('./Beacon');

var _Beacon2 = _interopRequireDefault(_Beacon);

var _SearchEventHandler = require('./SearchEventHandler');

var _SearchEventHandler2 = _interopRequireDefault(_SearchEventHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var envConfig = new _Config2.default('dh-books/env', _path2.default.resolve(__dirname, '../envConfig')); // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

var indices = exports.indices = {
    book: {
        store: envConfig.bookStore
    },
    autocomplete: {
        store: envConfig.autocompleteStore
    },
    searchQuery: {
        store: envConfig.searchQueryStore
    }
};

var defaultSortOrder = exports.defaultSortOrder = 'DESC';

var inputAnalyzer = exports.inputAnalyzer = {
    name: 'standard_search_analyzer',
    index: indices.book.store
};

var langFilter = {
    field: 'lang',
    termQuery: true,
    value: function value(_value) {
        if (_value.secondary) {
            return _lodash2.default.union([_value.primary], _value.secondary);
        }

        return _value.primary;
    }
};

var types = exports.types = {
    book: {
        index: indices.book.store,
        type: 'book',
        sort: [// field names, field name => config, sort name => field + config
        'score', 'price', 'releaseDate', 'title', 'rating'],
        filters: {
            approvalStatus: {
                field: 'approvalStatus',
                termQuery: true,
                defaultValue: 0
            },
            bookSubType: {
                field: 'bookSubType',
                termQuery: true,
                defaultValue: 'full'
            },
            lang: langFilter,
            category: {
                field: 'categories.title',
                nestedPath: 'categories',
                noFuzzy: true
            }
        }
    },
    authorAutocomplete: {
        index: indices.autocomplete.store,
        type: 'authorAutocomplete',
        name: 'author',
        filters: {
            lang: langFilter
        }
    },
    categoryAutocomplete: {
        index: indices.autocomplete.store,
        type: 'categoryAutocomplete',
        name: 'category',
        filters: {
            lang: langFilter
        }
    },
    publisherAutocomplete: {
        index: indices.autocomplete.store,
        type: 'publisherAutocomplete',
        name: 'publisher',
        filters: {
            lang: langFilter
        }
    },
    searchQuery: {
        index: indices.searchQuery.store,
        type: 'searchQuery',
        filters: {
            lang: langFilter,
            hasResults: {
                field: 'hasResults',
                termQuery: true,
                defaultValue: true
            }
        }
    }
};

var matchTypeBoosts = exports.matchTypeBoosts = {
    exact: 1100,
    edgeGram: 1000,
    phonetic: 100,
    phoneticEdgeGram: 10,
    exact_edit: 1,
    edgeGram_edit: 0.1
};

var autocomplete = exports.autocomplete = {
    defaultType: '*',
    types: {
        searchQueryAutocomplete: {
            indexType: types.searchQuery,
            queryFields: [{
                field: 'unicodeQuery',
                vernacularOnly: true,
                weight: 10
            }, {
                field: 'query',
                weight: 9.5
            }]
        },
        authorAutocomplete: {
            indexType: types.authorAutocomplete,
            queryFields: [{
                field: 'unicodeValue',
                vernacularOnly: true,
                weight: 10
            }, {
                field: 'value',
                weight: 9.5
            }, {
                field: 'transValue',
                weight: 9.25
            }]
        },
        categoryAutocomplete: {
            indexType: types.categoryAutocomplete,
            queryFields: [{
                field: 'unicodeValue',
                vernacularOnly: true,
                weight: 10
            }, {
                field: 'value',
                weight: 9.5
            }, {
                field: 'transValue',
                weight: 9.25
            }]
        },
        publisherAutocomplete: {
            indexType: types.publisherAutocomplete,
            queryFields: [{
                field: 'unicodeValue',
                vernacularOnly: true,
                weight: 10
            }, {
                field: 'value',
                weight: 9.5
            }, {
                field: 'transValue',
                weight: 9.25
            }]
        },
        bookAutocomplete: {
            indexType: types.book,
            queryFields: [{
                field: 'titleUnicode',
                vernacularOnly: true,
                weight: 10
            }, {
                field: 'title',
                weight: 9.5
            }, {
                field: 'titleTrans',
                weight: 9.25
            }]
        }
    }
};

var search = exports.search = {
    defaultType: 'book',
    types: {
        category_entity: {
            indexType: types.book,
            minimumShouldMatch: '2<75%',
            queryFields: [{
                field: 'categories.title',
                nestedPath: 'categories',
                noFuzzy: true
            }]
        },
        author_entity: {
            indexType: types.book,
            minimumShouldMatch: '2<75%',
            queryFields: [{
                field: 'creators.creator',
                nestedPath: 'creators',
                noFuzzy: true
            }]
        },
        publisher_entity: {
            indexType: types.book,
            minimumShouldMatch: '2<75%',
            queryFields: [{
                field: 'publisher.publisherName',
                noFuzzy: true
            }]
        },
        book: {
            indexType: types.book,
            minimumShouldMatch: '3<90%',
            queryFields: [{
                field: 'titleUnicode',
                vernacularOnly: true,
                weight: 10
            }, {
                field: 'title',
                weight: 9.5
            }, {
                field: 'titleTrans',
                weight: 9.25
            }, {
                field: 'creators.creatorUnicode',
                vernacularOnly: true,
                nestedPath: 'creators',
                weight: 10
            }, {
                field: 'creators.creator',
                nestedPath: 'creators',
                weight: 9.5
            }, {
                field: 'creators.creatorTrans',
                nestedPath: 'creators',
                weight: 9.25
            }, {
                field: 'publisher.publisherName',
                vernacularOnly: true,
                weight: 8
            }, {
                field: 'publisher.publisherEngName',
                weight: 7.5
            }, {
                field: 'publisher.publisherTransName',
                weight: 7.25
            }, {
                field: 'categories.titleUnicode',
                vernacularOnly: true,
                nestedPath: 'categories',
                weight: 6
            }, {
                field: 'categories.title',
                nestedPath: 'categories',
                weight: 5.5
            }, {
                field: 'categories.titleTrans',
                nestedPath: 'categories',
                weight: 5.25
            }, {
                field: 'categories.keywords',
                nestedPath: 'categories',
                termQuery: true,
                weight: 3
            }, {
                field: 'tags',
                weight: 2
            }, {
                field: 'collections.titleUnicode',
                vernacularOnly: true,
                nestedPath: 'collections',
                weight: 1
            }, {
                field: 'collections.title',
                nestedPath: 'collections',
                weight: 0.5
            }, {
                field: 'collections.titleTrans',
                nestedPath: 'collections',
                weight: 0.25
            }, {
                field: 'descriptionUnicode',
                vernacularOnly: true,
                weight: 0.1
            }, {
                field: 'description',
                weight: 0.05
            }, {
                field: 'descriptionTrans',
                weight: 0.025
            }]
        }
    }
};

function buildViewConfig(indexType) {
    return {
        indexType: indexType,
        sort: { unicodeValue: true, order: 'asc' },
        filters: {
            lang: { // default type is query
                field: 'lang',
                termQuery: true
            },
            requireVernacularValue: {
                type: 'post',
                filter: function filter(doc) {
                    return doc.unicodeValue === doc.value;
                }
            }
        }
    };
}

var views = exports.views = {
    types: {
        author: buildViewConfig(types.authorAutocomplete),
        category: buildViewConfig(types.categoryAutocomplete),
        publisher: buildViewConfig(types.publisherAutocomplete),
        searchQuery: {
            indexType: types.searchQuery,
            sort: { count: true },
            filters: {
                lang: { // default type is query
                    field: 'lang',
                    termQuery: true
                },
                hasResults: {
                    field: 'hasResults',
                    termQuery: true
                }
            }
        }
    }
};

var beacon = new _Beacon2.default();

var eventHandlers = exports.eventHandlers = {
    search: [function (data) {
        return beacon.sendSearchQuery(data);
    }, function (data) {
        return beacon.sendSearchResult(data);
    }, function (data) {
        return new _SearchEventHandler2.default().handle(data);
    }]
};