// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
import _ from 'lodash';
import md5 from 'md5';
import Path from 'path';

import Config from 'config-boilerplate/lib/Config';

import AnalysisSetting from 'humane-indexer/lib/schemas/analysis_setting';
import BookMapping from './schemas/book_mapping';
import AutocompleteMapping from './schemas/autocomplete_mapping';
import SearchQueryMapping from './schemas/search_query_mapping';

const envConfig = new Config('dh-books/env', Path.resolve(__dirname, '../envConfig'));

export const indices = {
    book: {
        store: envConfig.bookStore,
        analysis: AnalysisSetting
    },
    autocomplete: {
        store: envConfig.autocompleteStore,
        analysis: AnalysisSetting
    },
    searchQuery: {
        store: envConfig.searchQueryStore,
        analysis: AnalysisSetting
    }
};

export const types = {
    book: {
        index: indices.book.store,
        type: 'book',
        mapping: BookMapping,
        transform: (doc) => {
            // fix doc view count
            doc.viewCount = (doc.viewCount || 0) <= (doc.downloadCount || 0) ? (doc.downloadCount || 0) * 10 : (doc.viewCount || 0);

            // build per
            _.forEach(doc.prices || [], price => {
                doc[`price_${_.upperCase(price.currency)}`] = price;
            });

            return doc;
        },
        id: (doc) => doc.id,
        filter: (doc) => _.isUndefined(doc.approvalStatus) || doc.approvalStatus === 0,
        weight: (doc) => _.get(doc, 'viewCount', 0)
            + _.get(doc, 'searchResultClickCount', 0)
            + 10 * _.get(doc, 'downloadCount', 0)
            + 25 * _.get(doc, 'addToCardCount', 0)
            + 100 * _.get(doc, 'buyClickCount', 0)
            + 500 * _.get(doc, 'purchasedCount', 0)
            + _.get(doc, 'rating', 0) / 5 * _.get(doc, 'ratingCount', 0)
    },
    authorAutocomplete: {
        index: indices.autocomplete.store,
        type: 'authorAutocomplete',
        mapping: AutocompleteMapping,
        id: (doc) => doc.key,
        filter: (doc) => doc.bookCount > 0,
        child: true
    },
    categoryAutocomplete: {
        index: indices.autocomplete.store,
        type: 'categoryAutocomplete',
        mapping: AutocompleteMapping,
        id: (doc) => doc.key,
        filter: (doc) => doc.bookCount > 0,
        child: true
    },
    publisherAutocomplete: {
        index: indices.autocomplete.store,
        type: 'publisherAutocomplete',
        mapping: AutocompleteMapping,
        id: (doc) => doc.key,
        filter: (doc) => doc.bookCount > 0,
        child: true
    },
    searchQuery: {
        index: indices.searchQuery.store,
        type: 'searchQuery',
        mapping: SearchQueryMapping,
        id: (doc) => doc.key,
        mode: 'aggregate',
        aggregateBuilder: (existingDoc, newDoc) => ({key: newDoc.key, lang: newDoc.lang, query: newDoc.query, unicodeQuery: newDoc.unicodeQuery, hasResults: newDoc.hasResults}),
        measures: [
            {count: 'COUNT'},
            {weight: (doc) => doc.count}
        ]
    }
};

function buildBookData(fieldData) {
    const {value, transValue, id} = fieldData;
    let {unicodeValue, lang} = fieldData;

    if (!unicodeValue) {
        unicodeValue = value;

        if (!lang) {
            lang = 'en';
        }
    }

    if (!lang) {
        lang = 'xx';
    }

    const key = md5(`${lang}.${(unicodeValue || value)}`);

    return {key, value, unicodeValue, transValue, lang, id};
}

export const aggregators = {
    book: {
        measures: [
            'viewCount',
            'searchResultClickCount',
            'downloadCount',
            'addToCardCount',
            'buyClickCount',
            'purchasedCount',
            'ratingCount',
            {
                rating: {type: 'WEIGHTED_AVERAGE', weight: 'ratingCount', round: 1}
            },
            {
                bookCount: 'COUNT'
            },
            {
                weight: (doc) => _.get(doc, 'viewCount', 0)
                    + _.get(doc, 'searchResultClickCount', 0)
                    + 10 * _.get(doc, 'downloadCount', 0)
                    + 25 * _.get(doc, 'addToCardCount', 0)
                    + 100 * _.get(doc, 'buyClickCount', 0)
                    + 500 * _.get(doc, 'purchasedCount', 0)
                    + _.get(doc, 'rating', 0) / 5 * _.get(doc, 'ratingCount', 0)
            }
        ],

        aggregates: {
            publisher: {
                field: 'publisher',
                indexType: types.publisherAutocomplete,
                aggregateBuilder: (doc, field) => buildBookData({
                    id: field.publisherId,
                    value: _.trim(field.publisherEngName),
                    unicodeValue: _.trim(field.publisherName),
                    transValue: _.trim(field.publisherTransName),
                    lang: doc.lang
                })
            },
            author: {
                field: 'creators',
                indexType: types.authorAutocomplete,
                aggregateBuilder: (doc, field) => buildBookData({
                    value: _.trim(field.creator),
                    unicodeValue: _.trim(field.creatorUnicode),
                    transValue: _.trim(field.creatorTrans),
                    lang: doc.lang
                })
            },
            category: {
                field: 'categories',
                indexType: types.categoryAutocomplete,
                aggregateBuilder: (doc, field) => buildBookData({
                    id: field.id,
                    value: _.trim(field.title),
                    unicodeValue: _.trim(field.titleUnicode),
                    transValue: _.trim(field.titleTrans),
                    lang: field.language || doc.lang
                })
            }
        }
    }
};