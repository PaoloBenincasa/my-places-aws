/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateCollection = /* GraphQL */ `
  subscription OnCreateCollection(
    $filter: ModelSubscriptionCollectionFilterInput
    $owner: String
  ) {
    onCreateCollection(filter: $filter, owner: $owner) {
      id
      name
      color
      exclusive_with
      places {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdateCollection = /* GraphQL */ `
  subscription OnUpdateCollection(
    $filter: ModelSubscriptionCollectionFilterInput
    $owner: String
  ) {
    onUpdateCollection(filter: $filter, owner: $owner) {
      id
      name
      color
      exclusive_with
      places {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeleteCollection = /* GraphQL */ `
  subscription OnDeleteCollection(
    $filter: ModelSubscriptionCollectionFilterInput
    $owner: String
  ) {
    onDeleteCollection(filter: $filter, owner: $owner) {
      id
      name
      color
      exclusive_with
      places {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onCreateSavedPlace = /* GraphQL */ `
  subscription OnCreateSavedPlace(
    $filter: ModelSubscriptionSavedPlaceFilterInput
    $owner: String
  ) {
    onCreateSavedPlace(filter: $filter, owner: $owner) {
      id
      name
      latitude
      longitude
      collectionID
      collection {
        id
        name
        color
        exclusive_with
        createdAt
        updatedAt
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdateSavedPlace = /* GraphQL */ `
  subscription OnUpdateSavedPlace(
    $filter: ModelSubscriptionSavedPlaceFilterInput
    $owner: String
  ) {
    onUpdateSavedPlace(filter: $filter, owner: $owner) {
      id
      name
      latitude
      longitude
      collectionID
      collection {
        id
        name
        color
        exclusive_with
        createdAt
        updatedAt
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeleteSavedPlace = /* GraphQL */ `
  subscription OnDeleteSavedPlace(
    $filter: ModelSubscriptionSavedPlaceFilterInput
    $owner: String
  ) {
    onDeleteSavedPlace(filter: $filter, owner: $owner) {
      id
      name
      latitude
      longitude
      collectionID
      collection {
        id
        name
        color
        exclusive_with
        createdAt
        updatedAt
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
