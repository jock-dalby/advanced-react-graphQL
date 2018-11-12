import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PaginationStyles from './styles/PaginationStyles';
import { perPage } from '../config';

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = props => (
  <Query query={PAGINATION_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <p>Loading...</p>;
      // get number of items in db from db
      const count = data.itemsConnection.aggregate.count;
      // Divide total numbe rof items by items per page (from config file) and round up to nearest whole
      const pages = Math.ceil(count / perPage);
      return (
        <PaginationStyles>
          <p>Page {props.page} of {pages}</p>
        </PaginationStyles>
      );
    }}
  </Query>
);

export default Pagination;
