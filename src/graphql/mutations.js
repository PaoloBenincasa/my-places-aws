/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createCollection = /* GraphQL */ `
  mutation CreateCollection(
    $input: CreateCollectionInput!
    $condition: ModelCollectionConditionInput
  ) {
    createCollection(input: $input, condition: $condition) {
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
export const updateCollection = /* GraphQL */ `
  mutation UpdateCollection(
    $input: UpdateCollectionInput!
    $condition: ModelCollectionConditionInput
  ) {
    updateCollection(input: $input, condition: $condition) {
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
export const deleteCollection = /* GraphQL */ `
  mutation DeleteCollection(
    $input: DeleteCollectionInput!
    $condition: ModelCollectionConditionInput
  ) {
    deleteCollection(input: $input, condition: $condition) {
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
export const createSavedPlace = /* GraphQL */ `
  mutation CreateSavedPlace(
    $input: CreateSavedPlaceInput!
    $condition: ModelSavedPlaceConditionInput
  ) {
    createSavedPlace(input: $input, condition: $condition) {
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
export const updateSavedPlace = /* GraphQL */ `
  mutation UpdateSavedPlace(
    $input: UpdateSavedPlaceInput!
    $condition: ModelSavedPlaceConditionInput
  ) {
    updateSavedPlace(input: $input, condition: $condition) {
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
export const deleteSavedPlace = /* GraphQL */ `
  mutation DeleteSavedPlace(
    $input: DeleteSavedPlaceInput!
    $condition: ModelSavedPlaceConditionInput
  ) {
    deleteSavedPlace(input: $input, condition: $condition) {
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
