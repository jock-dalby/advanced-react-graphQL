import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION(
    $email: String!
  ) {
    requestReset(email: $email) {
      message
    }
  }
`

class RequestReset extends Component {
  state = {
    email: ''
  }

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    return (
      <Mutation
        mutation={REQUEST_RESET_MUTATION}
        variables={this.state}
        >
        {/* called is boolean as to whether to mutation has been called yet */}
        {(requestReset, { error, loading, called }) => {
          return (
            // If do not add method="post" then default is a "get" and js will add to url as query param
            // including the password which could be potantially dangerous as will store password in browser
            // history / server logs etc.
            <Form method="post" onSubmit={async e => {
              e.preventDefault();
              await requestReset();
              this.setState({ email: '' })
            }}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Request a password reset</h2>
              <ErrorMessage error={error}/>
              {!error && !loading && called && <p>Success! Check your email for reset link</p>}
              <label htmlFor="email">
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  value={this.state.email}
                  onChange={this.saveToState}
                  />
              </label>

              <button type="submit">Request reset!</button>
            </fieldset>
          </Form>)
        }}
      </Mutation>
    )
  }
}

export default RequestReset;