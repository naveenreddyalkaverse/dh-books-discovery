// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
import _ from 'lodash';
import Agent from 'agentkeepalive';
import Promise from 'bluebird';
import Request from 'request';
import md5 from 'md5';

const Url = process.env.NODE_ENV === 'production' ? 'http://localhost:3000/dhBooks/indexer/api' : 'http://localhost/dhBooks/indexer/api';

export default class SearchEventHandler {
    constructor() {
        const keepAliveAgent = new Agent({
            maxSockets: 10,
            maxFreeSockets: 5,
            timeout: 60000,
            keepAliveTimeout: 30000
        });

        this.request = Promise.promisify(Request.defaults({
            json: true,
            agent: keepAliveAgent,
            baseUrl: Url,
            gzip: true,
            method: 'POST',
            uri: '/searchQuery'
        }));
    }

    send(data) {
        this.request({body: {doc: data}})
          .then(response => {
              if (_.isArray(response)) {
                  response = response[0];
              }

              const result = response.statusCode === 200 ? response.body : null;
              if (!result) {
                  console.warn('Error while sending search query: ', response.statusCode, response.body);
              }
          })
          .catch(error => {
              console.warn('Error while sending search query: ', error);
          });
    }

    handle(data) {
        const {queryData, queryLanguages, queryResult} = data;

        const queryTime = Date.now();
        const hasResults = queryResult && queryResult.totalResults || false;
        const query = _.lowerCase(queryData.text);
        let unicodeQuery = null;

        if (queryLanguages && !_.isEmpty(queryLanguages)) {
            unicodeQuery = query;
        }

        let languages = _.union(queryLanguages || [], queryData.filter.lang.primary || [], queryData.filter.lang.secondary || []);
        if (_.isEmpty(languages)) {
            languages = ['en'];
        }

        _.forEach(languages, lang => {
            const key = md5(`${lang}/${query}`);

            this.send({key, query, unicodeQuery, queryTime, hasResults, lang});
        });
    }
}