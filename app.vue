<template>
  <div>
    <h1>Asset</h1>
    <h1>
      {{ title }}
    </h1>
  </div>
</template>

<script lang="ts" setup>
const query = `
query AssetQuery(
    $id: String!
    $tokenAccountsAddress: String
) {
    result: tokenById(id: $id) {
        __typename
        id
        tokenId
        createdAt
        supply
        unitPrice
        listingForbidden
        isFrozen
        nonFungible
        minimumBalance
        infusion
        anyoneCanInfuse
        rarity {
            rank
        }
        behavior {
            ... on TokenBehaviorIsCurrency {
                __typename
                type
            }
            ... on TokenBehaviorHasRoyalty {
                __typename
                royalty {
                    percentage
                    beneficiary {
                        address
                    }
                }
            }
        }
        cap {
            ... on TokenCapSingleMint {
                __typename
                type
            }
            ... on TokenCapSupply {
                __typename
                supply
                type
            }
        }
        collection {
            __typename
            id
            totalDeposit
            createdAt
            marketPolicy {
                royalty {
                    percentage
                }
            }
            mintPolicy {
                # forceCollapsingSupply
                maxTokenCount
                maxTokenSupply
            }
            metadata {
                __typename
                name
                description
                media {
                    alt
                    type
                    url
                }
                fallbackImage
                externalUrl
            }
            verifiedAt
            owner {
                id
                username
                verifiedAt
            }
            attributes(where: { token_isNull: true }) {
                key
                value
            }
            transferPolicy {
                isFrozen
            }
            collectionAccounts(limit: 1, where: { account: { id_eq: $tokenAccountsAddress } }) {
                isFrozen
            }
            tokenAccounts(limit: 1, where: { account: { id_eq: $tokenAccountsAddress } }) {
                isFrozen
            }
            explicitRoyaltyCurrencies {
                collection {
                    id
                }
                token {
                    id
                }
            }
            stats {
                floorPrice
                highestSale
                lastSale
                marketCap
                salesCount
                tokenCount
                volume
                supply
            }
        }
        metadata {
            __typename
            name
            description
            media {
                alt
                type
                url
            }
            fallbackImage
            externalUrl
            attributes
            keywords
        }
        attributes {
            key
            value
        }
        traits {
            trait {
                count
                traitType
                value
            }
        }
        bestListing {
            highestPrice
        }
        tokenAccounts(limit: 1, orderBy: createdAt_DESC) {
            account {
                id
                username
                verifiedAt
            }
            balance
            isFrozen
        }
        owner: tokenAccounts(limit: 1, orderBy: createdAt_DESC, where: { account: { id_eq: $tokenAccountsAddress } }) {
            account {
                id
                username
                verifiedAt
            }
            balance
            isFrozen
        }
    }
    tokenAccounts: tokenAccountsConnection(orderBy: id_ASC, where: { token: { id_eq: $id } }) {
        totalCount
    }
    listings: listingsConnection(
        orderBy: id_ASC
        where: { makeAssetId: { id_eq: $id }, isActive_eq: true, takeAssetId: { id_in: "0-0" } }
    ) {
        totalCount
    }
}
`;

const generateHeadMeta = ({
  title,
  description = "The most powerful NFTs in the world.",
  image,
}: {
  title?: string;
  description?: string;
  image?: string;
}) => {
  let metaTags: { [key: string]: string | undefined } = {
    title: title,
    ogTitle: title,
    twitterTitle: title,
  };

  if (description) {
    metaTags = {
      ...metaTags,
      description,
      ogDescription: description,
      twitterDescription: description,
    };
  }

  if (image) {
    metaTags = {
      ...metaTags,
      ogImage: image,
      twitterImage: image,
      twitterCard: "summary_large_image",
    };
  }

  return metaTags;
};

const payload = {
  query,
  variables: {
    id: "80297-6",
    tokenAccountAddress: "cxKnfok66R8BAuzGcypxqirYcqW7E9Spn4z5UZSVRuUHAcrTQ",
  },
};

const { data } = await useFetch(
  "https://canary-matrix-indexer.prod.enjops.com/graphql",
  {
    method: "POST",
    body: payload,
    headers: {
      "Content-Type": "application/json",
    },
  }
);

const asset = computed(() => data.value?.data.result);

const title = computed(() => asset.value?.metadata?.name ?? "Asset name");
const image = computed(
  () =>
    asset.value?.metadata?.media[0].url ??
    "https://cdn.nft.io/images/branding/og-banner.jpg"
);

useSeoMeta(
  generateHeadMeta({
    title: title.value,
    image: image.value,
  })
);

// const loadAsset = async () => {
//   const data = {
//     query,
//     variables: {
//       id: "80297-6",
//       tokenAccountAddress: "cxKnfok66R8BAuzGcypxqirYcqW7E9Spn4z5UZSVRuUHAcrTQ",
//     },
//   };

//   const body = JSON.stringify(data);

//   const response = await fetch(
//     "https://canary-matrix-indexer.prod.enjops.com/graphql",
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body,
//     }
//   );

//   asset.value = (await response.json()).data.result;
// };

// const loadAsset = async () => {
//   if (error.value) {
//     console.error(error.value);
//     return;
//   }

//   return asset.value?.data?.result;
// };

// (() => {
//   loadAsset();
// })();
</script>
