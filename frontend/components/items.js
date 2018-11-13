import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled, { ThemeProvider } from 'styled-components';
import Item from './Item';
import Pagination from './Pagination';
import { perPage } from '../config';

const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY($skip: Int = 0, $first: Int = ${perPage}) {
    items(first: $first, skip: $skip, orderBy: createdAt_DESC) {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`;

const Center = styled.div`
  text-align: center;
`;

const ItemsList = styled.div`
  display: grid;
  grid-auto-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`;

class items extends Component {
  render() {
    return (
      <Center>
        <Pagination page={this.props.page}></Pagination>
        <Query query={ALL_ITEMS_QUERY} variables={{
            skip: this.props.page * perPage - perPage
          }}
          // network-only disables the cache and fetches from db every time.
          // Only to be used in rare cases as will lose performance benefits.
          // Currently no good way to solve the scenario where a new item is
          // added and the pagination needs updating. Should be added to course
          // soon when apollo introduce a fix. But for now this will work.
          // fetchPolicy="network-only"
        >
          {/* { payload => { */}
          {/* Destructured to */}
          {({data, error, loading}) => {
            if (loading) return <p>Loading...</p>
            if (error) return <p>Error: {error.message}</p>
            return <ItemsList>
              {data.items.map(item => <Item key={item.id} item={item}></Item>)}
            </ItemsList>
          }}
        </Query>
        <Pagination page={this.props.page}></Pagination>
      </Center>
    );
  }
}

export default items;
export { ALL_ITEMS_QUERY };