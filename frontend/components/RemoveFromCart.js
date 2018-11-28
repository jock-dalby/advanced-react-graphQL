import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import PropTypes from 'prop-types'
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`

class RemoveFromCart extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  };
  // This gets called as soon as we get a response back from the
  // server after a mutation has been performed. We are manually
  // updating th cache by deleting the item in the client as well
  // as in the db
  update = (cache, payload) => {
    // 1. read the cache
    const data = cache.readQuery({
      query: CURRENT_USER_QUERY
    });
    // 2. remove the item from the car
    const cartItemId = payload.data.removeFromCart.id;
    data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId)
    // 3. write it back to the cache
    cache.writeQuery({
      query: CURRENT_USER_QUERY, data
    })
  }

  render() {
    return (
      <Mutation mutation={REMOVE_FROM_CART_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}
        // Optimistic response is to say what we think the server will respond with.
        // Because we know 99%+ of the time this is going to work so want to have
        // a snappy UI and not wait for server response to come back.
        // The sequence of events is:
        // 1. mutation is sent to server
        // 2. server immediately responds with the optimisticResponse
        // 3. update method is called
        // 4. server responds again when mutation successfully executed
        // 5. update method called again
        // 6. If error with deletion then will be displayed to user
        optimisticResponse={{
          __typename: 'Mutation',
          removeFromCart: {
            __typename: 'CartItem',
            id: this.props.id
          }
        }}
        >
        {(removeFromCart, { loading }) => (
          <BigButton title="Delete Item"
            disabled={loading}
            onClick={() => removeFromCart().catch(err => alert(err.message))}
            >&times;</BigButton>
        )}
      </Mutation>
    )
  }
}

export default RemoveFromCart;