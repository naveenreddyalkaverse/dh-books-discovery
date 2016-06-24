// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
import {
  $Long,
  $Double,
  $Keyword,
  $VernacularText,
  $Text,
  $IdentityText
} from 'dh-humane-indexer/lib/schemas/mapping_types';

export default {
    _all: {
        enabled: false
    },
    properties: {
        key: $IdentityText,
        id: $IdentityText,
        lang: $Keyword,
        value: $Text,
        unicodeValue: $VernacularText,
        transValue: $Text,
        bookCount: $Long,
        viewCount: $Long,
        searchResultClickCount: $Long,
        downloadCount: $Long,
        buyClickCount: $Long,
        addToCardCount: $Long,
        purchasedCount: $Long,
        rating: $Double,
        ratingCount: $Long,
        weight: $Double
    }
};