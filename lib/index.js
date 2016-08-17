'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.redisSentinelConfig = exports.redisConfig = exports.cockpitConfig = exports.searchConfig = exports.indicesConfig = exports.dataPipelineConfig = exports.instanceName = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _DataPipelineConfig = require('./DataPipelineConfig');

var _DataPipelineConfig2 = _interopRequireDefault(_DataPipelineConfig);

var _IndicesConfig = require('./IndicesConfig');

var indicesConfig = _interopRequireWildcard(_IndicesConfig);

var _SearchConfig = require('./SearchConfig');

var searchConfig = _interopRequireWildcard(_SearchConfig);

var _CockpitConfig = require('./CockpitConfig');

var cockpitConfig = _interopRequireWildcard(_CockpitConfig);

var _Config = require('config-boilerplate/lib/Config');

var _Config2 = _interopRequireDefault(_Config);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var instanceName = 'dhBooks';

var envConfig = new _Config2.default('dh-books/env', _path2.default.resolve(__dirname, '../envConfig'));

var redisConfig = envConfig.redisConfig;
var redisSentinelConfig = envConfig.redisSentinelConfig;

exports.instanceName = instanceName;
exports.dataPipelineConfig = _DataPipelineConfig2.default;
exports.indicesConfig = indicesConfig;
exports.searchConfig = searchConfig;
exports.cockpitConfig = cockpitConfig;
exports.redisConfig = redisConfig;
exports.redisSentinelConfig = redisSentinelConfig;