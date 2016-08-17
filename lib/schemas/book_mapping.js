'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mapping_types = require('humane-indexer/lib/schemas/mapping_types');

var PriceProperties = {
    type: 'nested',
    properties: {
        country: _mapping_types.$NotIndexedText,
        creatorPrice: _mapping_types.$Double,
        currency: _mapping_types.$NotIndexedText,
        currentPrice: _mapping_types.$Double,
        discountPercent: _mapping_types.$Long,
        discounted: _mapping_types.$Boolean,
        originalPrice: _mapping_types.$Double,
        paymentGateway: _mapping_types.$NotIndexedText
    }
}; // jscs:disable requireCamelCaseOrUpperCaseIdentifiers


exports.default = {
    _all: {
        enabled: false
    },
    properties: {
        acquisitionDate: _mapping_types.$Date,
        approvalDate: _mapping_types.$Date,
        approvalStatus: _mapping_types.$Long,
        bookSubType: _mapping_types.$Keyword,
        bookSubTypeOriginal: _mapping_types.$Keyword,
        bookType: _mapping_types.$Keyword,
        categories: {
            type: 'nested',
            properties: {
                id: _mapping_types.$Long,
                keywords: _mapping_types.$Keyword,
                language: _mapping_types.$Keyword,
                title: _mapping_types.$Text,
                titleUnicode: _mapping_types.$VernacularText,
                titleTrans: _mapping_types.$Text
            }
        },
        charges: {
            properties: {
                country: _mapping_types.$NotIndexedText,
                currency: _mapping_types.$NotIndexedText,
                paymentGateway: _mapping_types.$NotIndexedText,
                revenueShare: _mapping_types.$NotIndexedText,
                royalty: _mapping_types.$NotIndexedText
            }
        },
        clickUrl: _mapping_types.$NotIndexedText,
        collections: {
            type: 'nested',
            properties: {
                id: _mapping_types.$Long,
                language: _mapping_types.$Keyword,
                title: _mapping_types.$Text,
                titleUnicode: _mapping_types.$VernacularText,
                titleTrans: _mapping_types.$Text,
                type: _mapping_types.$Keyword,
                viewOrder: _mapping_types.$Long
            }
        },
        coverImage: _mapping_types.$NotIndexedText,
        creators: {
            type: 'nested',
            properties: {
                creator: _mapping_types.$Text,
                creatorUnicode: _mapping_types.$VernacularText,
                creatorTrans: _mapping_types.$Text
            }
        },
        defaultCurrency: _mapping_types.$Keyword,
        description: _mapping_types.$Text,
        descriptionUnicode: _mapping_types.$VernacularText,
        descriptionTrans: _mapping_types.$Text,
        displayMode: _mapping_types.$NotIndexedText,
        downloadRange: _mapping_types.$NotIndexedText,
        embeddedFont: _mapping_types.$Boolean,
        excludePaymentGateway: _mapping_types.$Keyword,
        free: _mapping_types.$Boolean,
        id: _mapping_types.$IdentityText,
        isbn10: _mapping_types.$Long,
        isbn13: _mapping_types.$Long,
        lang: _mapping_types.$Keyword,
        langUnicode: _mapping_types.$VernacularKeyword,
        parentId: _mapping_types.$IdentityText,
        parts: {
            enabled: false,
            properties: {
                displayOrder: _mapping_types.$NotIndexedLong,
                id: _mapping_types.$NotIndexedText,
                parentId: _mapping_types.$NotIndexedText
            }
        },
        partsApiUrl: _mapping_types.$NotIndexedText,
        preOrder: _mapping_types.$Boolean,
        prices: {
            enabled: false,
            type: 'nested',
            properties: {
                country: _mapping_types.$NotIndexedText,
                creatorPrice: _mapping_types.$NotIndexedDouble,
                currency: _mapping_types.$NotIndexedText,
                currentPrice: _mapping_types.$NotIndexedDouble,
                discountPercent: _mapping_types.$NotIndexedLong,
                discounted: _mapping_types.$NotIndexedBoolean,
                originalPrice: _mapping_types.$NotIndexedDouble,
                paymentGateway: _mapping_types.$NotIndexedText
            }
        },
        price_IND: PriceProperties,
        price_INR: PriceProperties,
        price_USD: PriceProperties,
        publisher: {
            properties: {
                excludePaymentGateway: _mapping_types.$IdentityText,
                publisherId: _mapping_types.$IdentityText,
                publisherName: _mapping_types.$VernacularText,
                publisherEngName: _mapping_types.$Text,
                publisherTransName: _mapping_types.$Text
            }
        },
        samples: {
            enabled: false,
            properties: {
                displayOrder: _mapping_types.$NotIndexedLong,
                id: _mapping_types.$NotIndexedText,
                parentId: _mapping_types.$NotIndexedText
            }
        },
        shareUrl: _mapping_types.$NotIndexedText,
        size: _mapping_types.$Long,
        storeType: _mapping_types.$Keyword,
        supportedReadingModes: _mapping_types.$NotIndexedText,
        tags: _mapping_types.$Text,
        title: _mapping_types.$Text,
        titleUnicode: _mapping_types.$VernacularText,
        titleTrans: _mapping_types.$Text,
        type: _mapping_types.$Keyword,
        statsUpdateDate: _mapping_types.$Date,
        viewCount: _mapping_types.$Long,
        searchResultClickCount: _mapping_types.$Long,
        downloadCount: _mapping_types.$Long,
        buyClickCount: _mapping_types.$Long,
        addToCardCount: _mapping_types.$Long,
        purchasedCount: _mapping_types.$Long,
        rating: _mapping_types.$Double,
        ratingCount: _mapping_types.$Long,
        profilerGivenScore: _mapping_types.$Double,
        weight: _mapping_types.$Double
    }
};