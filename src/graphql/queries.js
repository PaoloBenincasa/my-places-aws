/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCollection = /* GraphQL */ `
  query GetCollection($id: ID!) {
    getCollection(id: $id) {
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
export const listCollections = /* GraphQL */ `
  query ListCollections(
    $filter: ModelCollectionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCollections(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        color
        exclusive_with
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getSavedPlace = /* GraphQL */ `
  query GetSavedPlace($id: ID!) {
    getSavedPlace(id: $id) {
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
export const listSavedPlaces = /* GraphQL */ `
  query ListSavedPlaces(
    $filter: ModelSavedPlaceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSavedPlaces(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        latitude
        longitude
        collectionID
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const savedPlacesByCollectionID = /* GraphQL */ `
  query SavedPlacesByCollectionID(
    $collectionID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelSavedPlaceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    savedPlacesByCollectionID(
      collectionID: $collectionID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        latitude
        longitude
        collectionID
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
