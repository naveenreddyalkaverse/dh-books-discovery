// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
import {
  $Long,
  $NotIndexedLong,
  $Double,
  $NotIndexedDouble,
  $Boolean,
  $NotIndexedBoolean,
  $Date,
  $Text,
  $VernacularText,
  $Keyword,
  $VernacularKeyword,
  $IdentityText,
  $NotIndexedText
} from 'humane-indexer/lib/schemas/mapping_types';

const PriceProperties = {
    type: 'nested',
    properties: {
        country: $NotIndexedText,
        creatorPrice: $Double,
        currency: $NotIndexedText,
        currentPrice: $Double,
        discountPercent: $Long,
        discounted: $Boolean,
        originalPrice: $Double,
        paymentGateway: $NotIndexedText
    }
};

export default {
    _all: {
        enabled: false
    },
    properties: {
        acquisitionDate: $Date,
        approvalDate: $Date,
        approvalStatus: $Long,
        bookSubType: $Keyword,
        bookSubTypeOriginal: $Keyword,
        bookType: $Keyword,
        categories: {
            type: 'nested',
            properties: {
                id: $Long,
                keywords: $Keyword,
                language: $Keyword,
                title: $Text,
                titleUnicode: $VernacularText,
                titleTrans: $Text
            }
        },
        charges: {
            properties: {
                country: $NotIndexedText,
                currency: $NotIndexedText,
                paymentGateway: $NotIndexedText,
                revenueShare: $NotIndexedText,
                royalty: $NotIndexedText
            }
        },
        clickUrl: $NotIndexedText,
        collections: {
            type: 'nested',
            properties: {
                id: $Long,
                language: $Keyword,
                title: $Text,
                titleUnicode: $VernacularText,
                titleTrans: $Text,
                type: $Keyword,
                viewOrder: $Long
            }
        },
        coverImage: $NotIndexedText,
        creators: {
            type: 'nested',
            properties: {
                creator: $Text,
                creatorUnicode: $VernacularText,
                creatorTrans: $Text
            }
        },
        defaultCurrency: $Keyword,
        description: $Text,
        descriptionUnicode: $VernacularText,
        descriptionTrans: $Text,
        displayMode: $NotIndexedText,
        downloadRange: $NotIndexedText,
        embeddedFont: $Boolean,
        excludePaymentGateway: $Keyword,
        free: $Boolean,
        id: $IdentityText,
        isbn10: $Long,
        isbn13: $Long,
        lang: $Keyword,
        langUnicode: $VernacularKeyword,
        parentId: $IdentityText,
        parts: {
            enabled: false,
            properties: {
                displayOrder: $NotIndexedLong,
                id: $NotIndexedText,
                parentId: $NotIndexedText
            }
        },
        partsApiUrl: $NotIndexedText,
        preOrder: $Boolean,
        prices: {
            enabled: false,
            type: 'nested',
            properties: {
                country: $NotIndexedText,
                creatorPrice: $NotIndexedDouble,
                currency: $NotIndexedText,
                currentPrice: $NotIndexedDouble,
                discountPercent: $NotIndexedLong,
                discounted: $NotIndexedBoolean,
                originalPrice: $NotIndexedDouble,
                paymentGateway: $NotIndexedText
            }
        },
        price_IND: PriceProperties,
        price_INR: PriceProperties,
        price_USD: PriceProperties,
        publisher: {
            properties: {
                excludePaymentGateway: $IdentityText,
                publisherId: $IdentityText,
                publisherName: $VernacularText,
                publisherEngName: $Text,
                publisherTransName: $Text
            }
        },
        samples: {
            enabled: false,
            properties: {
                displayOrder: $NotIndexedLong,
                id: $NotIndexedText,
                parentId: $NotIndexedText
            }
        },
        shareUrl: $NotIndexedText,
        size: $Long,
        storeType: $Keyword,
        supportedReadingModes: $NotIndexedText,
        tags: $Text,
        title: $Text,
        titleUnicode: $VernacularText,
        titleTrans: $Text,
        type: $Keyword,
        statsUpdateDate: $Date,
        viewCount: $Long,
        searchResultClickCount: $Long,
        downloadCount: $Long,
        buyClickCount: $Long,
        addToCardCount: $Long,
        purchasedCount: $Long,
        rating: $Double,
        ratingCount: $Long,
        profilerGivenScore: $Double,
        weight: $Double
    }
};
