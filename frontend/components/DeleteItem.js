import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ALL_ITEMS_QUERY } from './Items';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`

class DeleteItem extends Component {
  // Apollo will pass in 2 args when the Mutation updates
  // 1. access to the cache
  // 2. payload that came back from the Mutation (e.g. item that was deleted)
  // This enables us to manually update the cache on the client so it matches the server.
  update = (cache, payload) => {
    // read the cache for the items we want
    const cachedItems = cache.readQuery({ query: ALL_ITEMS_QUERY })
    // filter the deleted item out of cache
    const filteredCacheItems = cachedItems.items.filter(item => item.id !== payload.data.deleteItem.id)
    // put filtered items back into cache
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data: { items: filteredCacheItems }})
  }
  render() {
    return (
      <Mutation mutation={DELETE_ITEM_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}
        >
        {(deleteItem, { error }) => (
          <button onClick={() => {
            if (confirm('Are you sure you want to delete this item')) {
              deleteItem();
            }
          }}>{this.props.children}</button>
        )}
      </Mutation>
    );
  }
}

export default DeleteItem;