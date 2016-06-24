import _ from 'lodash';
import URL from 'url';

import md5 from 'md5';

const EmptyArray = [];

export default {
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
            fn: (doc) => ({
                id: _.get(doc, 'book_id'),
                statsUpdateDate: _.get(doc, 'lastUpdated'),
                viewCount: _.get(doc, 'detail_views.count'),
                searchResultClickCount: _.get(doc, 'search_result_clicks.count'),
                downloadCount: _.get(doc, 'downloads.count'),
                buyClickCount: _.get(doc, 'buy_clicks.count'),
                addToCardCount: _.get(doc, 'add_to_cart.count'),
                purchasedCount: _.get(doc, 'purchases.count'),
                profilerGivenScore: _.get(doc, 'overall_score')
            })
        },
        output: {
            type: 'indexer',
            handler: 'partialUpdate',
            indexType: 'book',
            concurrency: 1,
            memorySize: 4096,
            gcInterval: 50
        },
        filter: (doc, existingDoc) => existingDoc && (!existingDoc.statsUpdateDate || existingDoc.statsUpdateDate < doc.statsUpdateDate)
    },
    'search-logs': {
        input: {
            source: {
                type: 'file'
            },
            format: {
                type: 'log',
                regex: /([0-9a-f.:]+)\s+(-|.+?)\s+(-|.+?)\s+(-|.+?)\s+(.+?) \[([0-9]{2}\/[a-z]{3}\/[0-9]{4}:[0-9]{2}:[0-9]{2}:[0-9]{2}[^\]]*)] "(\S+?)\s(\S*?)\s?(\S+?)" ([0-9|\-]+) ([0-9|\-]+) (-|.+?) "(.+?)" "(.+?)" "(.+?)"/i,
                fields: [
                    'client_ip',
                    'remote_id',
                    'user',
                    'unknown_1',
                    'time_taken',
                    {ts: {type: 'date', format: 'DD/MMM/YYYY:HH:mm:ss ZZ'}},
                    'method',
                    {path: {transform: (value) => URL.parse(value, true)}},
                    'http_version',
                    'status_code',
                    'size',
                    'unknown_2',
                    'user_agent',
                    'remote_ip',
                    {
                        http_headers: {
                            transform: (value) => {
                                if (!value) {
                                    return null;
                                }

                                const headers = {};
                                const headerStrings = value.split(/;|,/);
                                if (headerStrings && _.isArray(headerStrings) && headerStrings.length > 0) {
                                    _.forEach(headerStrings, pair => {
                                        const values = pair.split('=');
                                        try {
                                            const processedValue = decodeURIComponent(values[1]).replace(/\++/mg, '').replace(/\n/mg, '');
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
                    }
                ],
                transform: (record) => {
                    if (record.user_agent.match(/Pingdom/i) || !_.get(record, 'path.query.q') || _.get(record, 'path.query.start')) {
                        return null;
                    }

                    let languages = _.union(
                      _.get(record, 'lang', '').split(',') || EmptyArray,
                      _.get(record, 'http_headers.nhClientInfoV1.primaryLanguage', '').split(',') || EmptyArray,
                      _.get(record, 'http_headers.nhClientInfoV1.secondaryLanguages', '').split(',') || EmptyArray
                    );

                    languages = _.filter(languages, lang => !_.isEmpty(lang));

                    if (!languages || _.isEmpty(languages)) {
                        languages = ['en'];
                    }

                    const query = _.trim(_.lowerCase(_.get(record, 'path.query.q')));
                    const queryTime = record.ts.getTime();
                    const hasResults = record.size !== 104;

                    return _.map(languages, (lang) => {
                        const key = md5(`${lang}/${query}`);
                        return {key, query, queryTime, hasResults, lang};
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