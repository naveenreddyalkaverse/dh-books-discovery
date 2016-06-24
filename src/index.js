import Path from 'path';

import dataPipelineConfig from './DataPipelineConfig';
import * as indicesConfig from './IndicesConfig';
import * as searchConfig from './SearchConfig';
import * as cockpitConfig from './CockpitConfig';
import Config from 'config-boilerplate/lib/Config';

const instanceName = 'dhBooks';

const envConfig = new Config('dh-books/env', Path.resolve(__dirname, '../envConfig'));

const redisConfig = envConfig.redisConfig;
const redisSentinelConfig = envConfig.redisSentinelConfig;

export {instanceName, dataPipelineConfig, indicesConfig, searchConfig, cockpitConfig, redisConfig, redisSentinelConfig};