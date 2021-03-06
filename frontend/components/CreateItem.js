import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router'

import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import ErrorMessage from './ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    # mutation take arguments, saves them as typed variables
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem (
      # mutation calls createItem and defines what properties is passing in and uses
      # the values pulled in from the variables created above
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      # define what properties we want to get back
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0,
  }

  handleChange = e => {
    const { name, type, value } = e.target;
    // TODO: fix bug with price input, where remove the 0 and throws an error in console
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val })
  }

  uploadFile = async e => {
    console.log('Uploading file');
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'sickfits');

    const response = await fetch(
      'https://api.cloudinary.com/v1_1/duclcz5tg/image/upload',
      {
        method: 'POST',
        body: data
      }
    );

    const file = await response.json();
    console.log(file);
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    })
  }

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {/* { (mutationFunction, payload) => { */}
        {/* Destructured and renamed to */}
        {/* called is boolean if has been called */}
        {(createItem, { loading, error, called, data}) => {
          return (
          // TODO: Stop form from being submitted while image file is being uploaded to cloudinary
          <Form onSubmit={async e => {
              // stop form from submitting
              e.preventDefault();
              // call the mutation
              const response = await createItem();
              // take them to the single item page fro newly created item
              Router.push({
                pathname: '/item',
                query: { id: response.data.createItem.id }
              })
            }}>
            <ErrorMessage error={error}/>
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="file">
                Image
                <input type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an image"
                  // value={this.state.image}
                  onChange={this.uploadFile}
                  required />
                  {this.state.image && <img src={this.state.image} width="200" alt="upload preview" />}
              </label>

              <label htmlFor="title">
                Title
                <input type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  value={this.state.title}
                  onChange={this.handleChange}
                  required />
              </label>
  
              <label htmlFor="price">
                Price
                <input type="number"
                  id="price"
                  name="price"
                  placeholder="Price"
                  value={this.state.price}
                  onChange={this.handleChange}
                  required />
              </label>
  
              <label htmlFor="description">
                Description
                <textarea id="description"
                  name="description"
                  placeholder="Description"
                  value={this.state.description}
                  onChange={this.handleChange}
                  required />
              </label>
              
              <button type="submit">Submit</button>
            </fieldset>
          </Form>)
        }}
      </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };