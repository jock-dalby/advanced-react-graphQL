import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION(
    $email: String!,
    $password: String!
  ) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`

class Signin extends Component {
  state = {
    email: '',
    password: ''
  }

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        // when this mutation has finished, this will go into the apollo store and refetch the current user,
        // which will update the UI with the current users details without the need to refresh
        refetchQueries = {[
          { query: CURRENT_USER_QUERY }
        ]}
        >
        {(signin, { error, loading }) => {
          return (
            // If do not add method="post" then default is a "get" and js will add to url as query param
            // including the password which could be potantially dangerous as will store password in browser
            // history / server logs etc.
            <Form method="post" onSubmit={async e => {
              e.preventDefault();
              const response = await signin();
              this.setState({
                email: '',
                password: ''
              })
            }}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign in!</h2>
              {/* TODO Intercept error message and write more user friendly error */}
              {/* Example: try to add same email twice */}
              <ErrorMessage error={error}/>
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

              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  value={this.state.password}
                  onChange={this.saveToState}
                  />
              </label>

              <button type="submit">Sign in!</button>
            </fieldset>
          </Form>)
        }}
      </Mutation>
    )
  }
}

export default Signin;