// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
import {
  $Long,
  $Double,
  $Boolean,
  $Keyword,
  $VernacularText,
  $Text,
  $IdentityText
} from 'humane-indexer/lib/schemas/mapping_types';

export default {
    _all: {
        enabled: false
    },
    properties: {
        key: $IdentityText,
        lang: $Keyword,
        query: $Text,
        unicodeQuery: $VernacularText,
        count: $Long,
        weight: $Double,
        hasResults: $Boolean
    }
};
