import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!,
    $name: String!,
    $password: String!
  ) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`

class Signup extends Component {
  state = {
    email: '',
    name: '',
    password: ''
  }

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    return (
      <Mutation
        mutation={SIGNUP_MUTATION}
        variables={this.state}
        // when this mutation has finished, this will go into the apollo store and refetch the current user,
        // which will update the UI with the current users details without the need to refresh
        refetchQueries = {[
          { query: CURRENT_USER_QUERY }
        ]}
        >
        {(signup, { error, loading }) => {
          return (
            // If do not add method="post" then default is a "get" and js will add to url as query param
            // including the password which could be potantially dangerous as will store password in browser
            // history / server logs etc.
            <Form method="post" onSubmit={async e => {
              e.preventDefault();
              const response = await signup();
              console.log('signup response', response);
              this.setState({
                email: '',
                name: '',
                password: ''
              })
            }}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign up for an account!</h2>
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

              <label htmlFor="name">
                Name
                <input
                  type="text"
                  name="name"
                  placeholder="name"
                  value={this.state.name}
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

              <button type="submit">Sign Up!</button>
            </fieldset>
          </Form>)
        }}
      </Mutation>
    )
  }
}

export default Signup;