// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

import _ from 'lodash';
import Path from 'path';

import Config from 'config-boilerplate/lib/Config';

import Beacon from './Beacon';
import SearchEventHandler from './SearchEventHandler';

const envConfig = new Config('dh-books/env', Path.resolve(__dirname, '../envConfig'));

export const indices = {
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

export const defaultSortOrder = 'DESC';

export const inputAnalyzer = {
    name: 'standard_search_analyzer',
    index: indices.book.store
};

const langFilter = {
    field: 'lang',
    termQuery: true,
    value: (value) => {
        if (value.secondary) {
            return _.union([value.primary], value.secondary);
        }

        return value.primary;
    }
};

export const types = {
    book: {
        index: indices.book.store,
        type: 'book',
        sort: [ // field names, field name => config, sort name => field + config
            'score',
            'price',
            'releaseDate',
            'title',
            'rating'
        ],
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

export const matchTypeBoosts = {
    exact: 1100,
    edgeGram: 1000,
    phonetic: 100,
    phoneticEdgeGram: 10,
    exact_edit: 1,
    edgeGram_edit: 0.1
};

export const autocomplete = {
    defaultType: '*',
    types: {
        searchQueryAutocomplete: {
            indexType: types.searchQuery,
            queryFields: [
                {
                    field: 'unicodeQuery',
                    vernacularOnly: true,
                    weight: 10
                },
                {
                    field: 'query',
                    weight: 9.5
                }
            ]
        },
        authorAutocomplete: {
            indexType: types.authorAutocomplete,
            queryFields: [
                {
                    field: 'unicodeValue',
                    vernacularOnly: true,
                    weight: 10
                },
                {
                    field: 'value',
                    weight: 9.5
                },
                {
                    field: 'transValue',
                    weight: 9.25
                }
            ]
        },
        categoryAutocomplete: {
            indexType: types.categoryAutocomplete,
            queryFields: [
                {
                    field: 'unicodeValue',
                    vernacularOnly: true,
                    weight: 10
                },
                {
                    field: 'value',
                    weight: 9.5
                },
                {
                    field: 'transValue',
                    weight: 9.25
                }
            ]
        },
        publisherAutocomplete: {
            indexType: types.publisherAutocomplete,
            queryFields: [
                {
                    field: 'unicodeValue',
                    vernacularOnly: true,
                    weight: 10
                },
                {
                    field: 'value',
                    weight: 9.5
                },
                {
                    field: 'transValue',
                    weight: 9.25
                }
            ]
        },
        bookAutocomplete: {
            indexType: types.book,
            queryFields: [
                {
                    field: 'titleUnicode',
                    vernacularOnly: true,
                    weight: 10
                },
                {
                    field: 'title',
                    weight: 9.5
                },
                {
                    field: 'titleTrans',
                    weight: 9.25
                }
            ]
        }
    }
};

export const search = {
    defaultType: 'book',
    types: {
        category_entity: {
            indexType: types.book,
            minimumShouldMatch: '2<75%',
            queryFields: [
                {
                    field: 'categories.title',
                    nestedPath: 'categories',
                    noFuzzy: true
                }
            ]
        },
        author_entity: {
            indexType: types.book,
            minimumShouldMatch: '2<75%',
            queryFields: [
                {
                    field: 'creators.creator',
                    nestedPath: 'creators',
                    noFuzzy: true
                }
            ]
        },
        publisher_entity: {
            indexType: types.book,
            minimumShouldMatch: '2<75%',
            queryFields: [
                {
                    field: 'publisher.publisherName',
                    noFuzzy: true
                }
            ]
        },
        book: {
            indexType: types.book,
            minimumShouldMatch: '3<90%',
            queryFields: [
                {
                    field: 'titleUnicode',
                    vernacularOnly: true,
                    weight: 10
                },
                {
                    field: 'title',
                    weight: 9.5
                },
                {
                    field: 'titleTrans',
                    weight: 9.25
                },
                {
                    field: 'creators.creatorUnicode',
                    vernacularOnly: true,
                    nestedPath: 'creators',
                    weight: 10
                },
                {
                    field: 'creators.creator',
                    nestedPath: 'creators',
                    weight: 9.5
                },
                {
                    field: 'creators.creatorTrans',
                    nestedPath: 'creators',
                    weight: 9.25
                },
                {
                    field: 'publisher.publisherName',
                    vernacularOnly: true,
                    weight: 8
                },
                {
                    field: 'publisher.publisherEngName',
                    weight: 7.5
                },
                {
                    field: 'publisher.publisherTransName',
                    weight: 7.25
                },
                {
                    field: 'categories.titleUnicode',
                    vernacularOnly: true,
                    nestedPath: 'categories',
                    weight: 6
                },
                {
                    field: 'categories.title',
                    nestedPath: 'categories',
                    weight: 5.5
                },
                {
                    field: 'categories.titleTrans',
                    nestedPath: 'categories',
                    weight: 5.25
                },
                {
                    field: 'categories.keywords',
                    nestedPath: 'categories',
                    termQuery: true,
                    weight: 3
                },
                {
                    field: 'tags',
                    weight: 2
                },
                {
                    field: 'collections.titleUnicode',
                    vernacularOnly: true,
                    nestedPath: 'collections',
                    weight: 1
                },
                {
                    field: 'collections.title',
                    nestedPath: 'collections',
                    weight: 0.5
                },
                {
                    field: 'collections.titleTrans',
                    nestedPath: 'collections',
                    weight: 0.25
                },
                {
                    field: 'descriptionUnicode',
                    vernacularOnly: true,
                    weight: 0.1
                },
                {
                    field: 'description',
                    weight: 0.05
                },
                {
                    field: 'descriptionTrans',
                    weight: 0.025
                }
            ]
        }
    }
};

function buildViewConfig(indexType) {
    return {
        indexType,
        sort: {unicodeValue: true, order: 'asc'},
        filters: {
            lang: { // default type is query
                field: 'lang',
                termQuery: true
            },
            requireVernacularValue: {
                type: 'post',
                filter: doc => doc.unicodeValue === doc.value
            }
        }
    };
}

export const views = {
    types: {
        author: buildViewConfig(types.authorAutocomplete),
        category: buildViewConfig(types.categoryAutocomplete),
        publisher: buildViewConfig(types.publisherAutocomplete),
        searchQuery: {
            indexType: types.searchQuery,
            sort: {count: true},
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

const beacon = new Beacon();

export const eventHandlers = {
    search: [
        data => beacon.sendSearchQuery(data),
        data => beacon.sendSearchResult(data),
        data => new SearchEventHandler().handle(data)
    ]
};
