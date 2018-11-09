import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

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
          if(error) return <p>Error!</p>
          if(loading) return <p>Loading...</p>
          return <p>Single item {this.props.id}</p>
        }}
      </Query>
    );
  }
}

export default SingleItem;