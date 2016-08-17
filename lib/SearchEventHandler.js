'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _agentkeepalive = require('agentkeepalive');

var _agentkeepalive2 = _interopRequireDefault(_agentkeepalive);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _md = require('md5');

var _md2 = _interopRequireDefault(_md);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Url = process.env.NODE_ENV === 'production' ? 'http://localhost:3000/dhBooks/indexer/api' : 'http://localhost:3000/dhBooks/indexer/api'; // jscs:disable requireCamelCaseOrUpperCaseIdentifiers


var SearchEventHandler = function () {
    function SearchEventHandler() {
        (0, _classCallCheck3.default)(this, SearchEventHandler);

        var keepAliveAgent = new _agentkeepalive2.default({
            maxSockets: 10,
            maxFreeSockets: 5,
            timeout: 60000,
            keepAliveTimeout: 30000
        });

        this.request = _bluebird2.default.promisify(_request2.default.defaults({
            json: true,
            agent: keepAliveAgent,
            baseUrl: Url,
            gzip: true,
            method: 'POST',
            uri: '/searchQuery'
        }));
    }

    (0, _createClass3.default)(SearchEventHandler, [{
        key: 'send',
        value: function send(data) {
            this.request({ body: { doc: data } }).then(function (response) {
                if (_lodash2.default.isArray(response)) {
                    response = response[0];
                }

                var result = response.statusCode === 200 ? response.body : null;
                if (!result) {
                    console.warn('Error while sending search query: ', response.statusCode, response.body);
                }
            }).catch(function (error) {
                console.warn('Error while sending search query: ', error);
            });
        }
    }, {
        key: 'handle',
        value: function handle(data) {
            var _this = this;

            var queryData = data.queryData;
            var queryLanguages = data.queryLanguages;
            var queryResult = data.queryResult;


            var queryTime = Date.now();
            var hasResults = queryResult && queryResult.totalResults || false;
            var query = _lodash2.default.lowerCase(queryData.text);
            var unicodeQuery = null;

            if (queryLanguages && !_lodash2.default.isEmpty(queryLanguages)) {
                unicodeQuery = query;
            }

            var languages = _lodash2.default.union(queryLanguages || [], queryData.filter.lang.primary || [], queryData.filter.lang.secondary || []);
            if (_lodash2.default.isEmpty(languages)) {
                languages = ['en'];
            }

            _lodash2.default.forEach(languages, function (lang) {
                var key = (0, _md2.default)(lang + '/' + query);

                _this.send({ key: key, query: query, unicodeQuery: unicodeQuery, queryTime: queryTime, hasResults: hasResults, lang: lang });
            });
        }
    }]);
    return SearchEventHandler;
}();

exports.default = SearchEventHandler;