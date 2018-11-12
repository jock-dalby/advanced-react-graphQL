import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Head from 'next/head';
import Link from 'next/link';
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
      const page = props.page;
      return (
        <PaginationStyles>
          <Head>
            <title>
              Sick fits! | Page {page} of {pages} 
            </title>
          </Head>
          {/* prefetch will load link before it needs it so will be super fast for user */}
          {/* can add prefetch to any links and makes website much quicker for user */}
          {/* prefetch does not work in dev mode but will work in prod */}
          <Link 
            prefetch
            href={{
            pathname: 'items',
            query: { page: page - 1 }
          }}>
            <a className="prev" aria-disabled={page <= 1}>&#8592; Prev</a>
          </Link>
          <p>Page {props.page} of {pages}</p>
          <p>Total items: {count}</p>
          <Link 
            prefetch
            href={{
            pathname: 'items',
            query: { page: page + 1 }
          }}>
            <a className="next" aria-disabled={page >= pages}>&#8594; Next</a>
          </Link>
          
        </PaginationStyles>
      );
    }}
  </Query>
);

export default Pagination;
