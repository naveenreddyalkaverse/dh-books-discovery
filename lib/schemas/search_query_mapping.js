'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mapping_types = require('humane-indexer/lib/schemas/mapping_types');

exports.default = {
    _all: {
        enabled: false
    },
    properties: {
        key: _mapping_types.$IdentityText,
        lang: _mapping_types.$Keyword,
        query: _mapping_types.$Text,
        unicodeQuery: _mapping_types.$VernacularText,
        count: _mapping_types.$Long,
        weight: _mapping_types.$Double,
        hasResults: _mapping_types.$Boolean
    }
}; // jscs:disable requireCamelCaseOrUpperCaseIdentifiers