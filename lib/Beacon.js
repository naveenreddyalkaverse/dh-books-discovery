'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

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

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Config = require('config-boilerplate/lib/Config');

var _Config2 = _interopRequireDefault(_Config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BeaconConfig = new _Config2.default('dh-books/beacon', _path2.default.resolve(__dirname, '../beaconConfig')); // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

var BeaconTypes = BeaconConfig.types;
var BeaconDefaultProperties = BeaconConfig.defaultProperties;
var Url = BeaconConfig.url;

var SEARCH_QUERY_EVENT = 'search_query';
var SEARCH_RESULT_EVENT = 'search_result';

var Beacon = function () {
    function Beacon() {
        (0, _classCallCheck3.default)(this, Beacon);

        var keepAliveAgent = new _agentkeepalive2.default({
            maxSockets: BeaconConfig.maxSockets || 10,
            maxFreeSockets: BeaconConfig.maxFreeSockets || 5,
            timeout: BeaconConfig.timeout || 60000,
            keepAliveTimeout: BeaconConfig.keepAliveTimeout || 30000
        });

        this.request = _bluebird2.default.promisify(_request2.default.defaults({
            json: true,
            agent: keepAliveAgent,
            baseUrl: Url,
            gzip: true,
            headers: {
                'Content-Type': 'application/vnd.kafka.binary.v1+json'
            },
            method: 'POST',
            uri: ''
        }));
    }

    //noinspection JSMethodCanBeStatic


    (0, _createClass3.default)(Beacon, [{
        key: 'wrapEventProperties',
        value: function wrapEventProperties(headers, eventType, event) {
            var headerObj = headers;
            if (!headerObj) {
                headerObj = {};
            }

            var beaconTypeConfig = BeaconTypes[eventType];

            return {
                client_id: headerObj.get('client_id') || Math.round(Math.random() * 1000000000),
                event_section: beaconTypeConfig.event_section,
                event_name: beaconTypeConfig.event_name,
                epoch_time: Date.now(),
                properties: _lodash2.default.extend({
                    session_source: headerObj.get('session_source') || beaconTypeConfig.session_source || BeaconDefaultProperties.session_source,
                    user_handset_maker: headerObj.get('user_handset_maker') || BeaconDefaultProperties.user_handset_maker,
                    user_app_ver: headerObj.get('user_app_ver') || BeaconDefaultProperties.user_app_ver,
                    user_connection: headerObj.get('user_connection') || BeaconDefaultProperties.user_connection,
                    user_os_platform: headerObj.get('user_os_platform') || BeaconDefaultProperties.user_os_platform,
                    user_handset_model: headerObj.get('user_handset_model') || BeaconDefaultProperties.user_handset_model,
                    user_os_ver: headerObj.get('user_os_ver') || BeaconDefaultProperties.user_os_ver,
                    user_os_name: headerObj.get('user_os_name') || BeaconDefaultProperties.user_os_name,
                    event_attribution: headerObj.get('event_attribution') || beaconTypeConfig.event_name || BeaconDefaultProperties.event_attribution,
                    pv_event: beaconTypeConfig.pv_event
                }, event)
            };
        }
    }, {
        key: 'send',
        value: function send(headers, eventType, event) {
            var eventRecord = this.wrapEventProperties(headers, eventType, event);

            var pingObj = {
                records: [{ value: new Buffer((0, _stringify2.default)(eventRecord)).toString('base64') }]
            };

            this.request({ body: pingObj }).then(function (response) {
                var _response = response;
                if (_lodash2.default.isArray(_response)) {
                    _response = response[0];
                }

                var result = _response.statusCode === 200 ? _response.body : null;
                var errorCode = result && result.offsets && result.offsets.length > 0 && result.offsets[0].error_code;
                if (errorCode && !_lodash2.default.isUndefined(errorCode) && !_lodash2.default.isNull(errorCode)) {
                    console.warn('Error while sending beacon: ', errorCode, (0, _stringify2.default)(eventRecord));
                }
            }).catch(function (error) {
                console.warn('Error while sending beacon: ', error, (0, _stringify2.default)(eventRecord));
            });
        }

        //noinspection JSMethodCanBeStatic

    }, {
        key: 'searchQueryEventProperties',
        value: function searchQueryEventProperties(queryData, queryLanguages) {
            return {
                user_language_primary: queryData.filter.lang.primary || null,
                user_language_secondary: queryData.filter.lang.secondary || null,
                filters: _lodash2.default.omit(queryData.filter, 'lang'),
                sort_field: queryData.sort && queryData.sort.field || 'sort',
                sort_order: queryData.sort && queryData.sort.order || 'DESC',
                unicode: queryLanguages && !_lodash2.default.isEmpty(queryLanguages) ? 'yes' : 'no',
                original_search_input: queryData.originalInput,
                original_search_input_length: queryData.originalInput && queryData.originalInput.length,
                search_query: queryData.text,
                search_query_language: queryLanguages || 'en',
                search_query_key: (0, _md2.default)(_lodash2.default.trim(queryData.text)),
                search_mode: queryData.mode,
                search_entity: queryData.type,
                page_num: queryData.page
            };
        }
    }, {
        key: 'sendSearchQuery',
        value: function sendSearchQuery(data) {
            this.send(data.headers, SEARCH_QUERY_EVENT, this.searchQueryEventProperties(data.queryData, data.queryLanguages));
        }
    }, {
        key: 'sendSearchResult',
        value: function sendSearchResult(data) {
            var queryResult = data.queryResult;


            var eventProperties = {
                item_ids: _lodash2.default.map(queryResult && queryResult.results || [], function (result) {
                    return result._id;
                }),
                total_num_of_items: queryResult && queryResult.totalResults || 0
            };

            this.send(data.headers, SEARCH_RESULT_EVENT, _lodash2.default.assign(this.searchQueryEventProperties(data.queryData, data.queryLanguages), eventProperties));
        }
    }]);
    return Beacon;
}();

exports.default = Beacon;