import React, { Component } from 'react';
import { Query } from 'react-apollo';
import ErrorMessage from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';
import gql from 'graphql-tag';

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE'
]

const ALL_USERS_QUERY = gql`
query {
  users {
    id
    name
    email
    permissions
  }
}`

const Permissions = () => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <p>Loading...</p>
      if (error) return <ErrorMessage error={error} />
      return (
        <div>
          <div>
            <h2>Manage Permissions</h2>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  {possiblePermissions.map(permission => <th>{permission}</th>)}
                  <th>👇🏻</th>
                </tr>
              </thead>
              <tbody>{data.users.map(user => <User user={user} />)}</tbody>
            </Table>
          </div>
        </div>
      )
    }}
  </Query>
);

class User extends React.Component {
  render() {
    const user = this.props.user;
    return (
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {possiblePermissions.map(permission => (
          <td>
            <label htmlFor={`${user.id}-permission-${permission}`}>
              <input type="checkbox" />
            </label>
          </td>
        ))}
        <td>
          <SickButton>Update</SickButton>
        </td>
      </tr>
    );
  }
}

export default Permissions;