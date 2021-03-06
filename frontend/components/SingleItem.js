import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Head from 'next/head';

const SingleItemStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  details {
    margin: 3rem;
    font-size: 2rem;
  }
`

import ErrorMessage from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY( $id: ID! ) {
    item(where: { id: $id }) {
      id
      title
      description
      largeImage
    }
  }
`

class SingleItem extends Component {
  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({error, loading, data}) => {
          if (error) return <ErrorMessage error={error} />;
          if (loading) return <p>Loading...</p>;
          if (!data.item) return <p>No item found for id: {this.props.id}</p>
          const item = data.item;
          return <SingleItemStyles>
            {/* This will override what is in the head of the document e.g. change the title of browser tab */}
            {/* The Head tag and it's children will not be rendered out in the DOM */}
            <Head>
              <title>Sick Fits | {item.title}</title>
            </Head>
            <img src={item.largeImage} alt={item.title} />
            <div className="details">
              <h2>Viewing {item.title}</h2>
              <p>{item.description}</p>
            </div>
          </SingleItemStyles>
        }}
      </Query>
    );
  }
}

export default SingleItem;