import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Router from 'next/router'
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { CURRENT_USER_QUERY } from '../components/User';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!,
    $password: String!,
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken,
      password: $password,
      confirmPassword: $confirmPassword) {
        id
        email
        name
    }
  }
`

class Reset extends Component {
  
  static propTypes = {
    resetToken: PropTypes.string.isRequired
  }

  state = {
    password: '',
    confirmPassword: ''
  }

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    return (
      <Mutation
        mutation={RESET_MUTATION}
        variables={{
          resetToken: this.props.resetToken,
          ...this.state
        }}
        // when this mutation has finished, this will go into the apollo store and refetch the current user,
        // which will update the UI with the current users details without the need to refresh
        refetchQueries = {[
          { query: CURRENT_USER_QUERY }
        ]}
        >
        {(reset, { error, loading }) => {
          return (
            // If do not add method="post" then default is a "get" and js will add to url as query param
            // including the password which could be potantially dangerous as will store password in browser
            // history / server logs etc.
            <Form method="post" onSubmit={async e => {
              e.preventDefault();
              await reset();
              this.setState({ password: '', confirmPassword: '' })
              // take them to the homepage when password reset and auto logged in
              Router.push({
                pathname: '/items',
              })
            }}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset password</h2>
              <ErrorMessage error={error}/>

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

              <label htmlFor="confirmPassword">
                Confirm password
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="confirmPassword"
                  value={this.state.confirmPassword}
                  onChange={this.saveToState}
                  />
              </label>

              <button type="submit">Reset password!</button>
            </fieldset>
          </Form>)
        }}
      </Mutation>
    )
  }
}

export default Reset;