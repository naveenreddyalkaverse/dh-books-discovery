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
        id: _mapping_types.$IdentityText,
        lang: _mapping_types.$Keyword,
        value: _mapping_types.$Text,
        unicodeValue: _mapping_types.$VernacularText,
        transValue: _mapping_types.$Text,
        bookCount: _mapping_types.$Long,
        viewCount: _mapping_types.$Long,
        searchResultClickCount: _mapping_types.$Long,
        downloadCount: _mapping_types.$Long,
        buyClickCount: _mapping_types.$Long,
        addToCardCount: _mapping_types.$Long,
        purchasedCount: _mapping_types.$Long,
        rating: _mapping_types.$Double,
        ratingCount: _mapping_types.$Long,
        weight: _mapping_types.$Double
    }
}; // jscs:disable requireCamelCaseOrUpperCaseIdentifiers