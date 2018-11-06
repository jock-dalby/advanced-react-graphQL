import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';

import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import ErrorMessage from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    # mutation take arguments, saves them as typed variables
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem (
      # mutation calls updateItem and defines what properties is passing in and uses
      # the values pulled in from the variables created above
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      # define what properties we want to get back
      id
      title
      description
      price
    }
  }
`;

class UpdateItem extends Component {
  state = {}

  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val })
  }

  updateItem = async (e, updateItemMutation) => {
    e.preventDefault();
    console.log('Updating item', this.state)
    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state
      }
    })
    console.log('updated', res)
  }

  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{
        id: this.props.id
      }}>
        {/* { payload => { */}
        {/* Destructured to */}
        {({ data, error, loading }) => {
          if (loading) return <p>Loading...</p>;
          if (!data.item) return <p>No item found for id '{this.props.id}'</p>
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {/* { (mutationFunction, payload) => { */}
              {/* Destructured and renamed to */}
              {/* {(updateItem, { loading, error, called, data }) => { */}
              {/* called is boolean if has been called */}
              {(updateItem, { loading, error }) => {
                return (
                  <Form onSubmit={e => this.updateItem(e, updateItem)}>
                    <ErrorMessage error={error} />
                    <fieldset disabled={loading} aria-busy={loading}>

                      <label htmlFor="title">
                        Title
                <input type="text"
                          id="title"
                          name="title"
                          placeholder="Title"
                          defaultValue={data.item.title}
                          onChange={this.handleChange}
                          required />
                      </label>

                      <label htmlFor="price">
                        Price
                <input type="number"
                          id="price"
                          name="price"
                          placeholder="Price"
                          defaultValue={data.item.price}
                          onChange={this.handleChange}
                          required />
                      </label>

                      <label htmlFor="description">
                        Description
                <textarea id="description"
                          name="description"
                          placeholder="Description"
                          defaultValue={data.item.description}
                          onChange={this.handleChange}
                          required />
                      </label>

                      <button type="submit">Sav{loading ? 'ing' : 'e'} changes</button>
                    </fieldset>
                  </Form>)
              }}
            </Mutation>
          )
        }}
      </Query>
    );
  }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };