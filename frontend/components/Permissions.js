import React, { Component } from 'react';
import { Query } from 'react-apollo';
import ErrorMessage from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

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
                  {possiblePermissions.map(permission => <th key={permission}>{permission}</th>)}
                  <th>👇🏻</th>
                </tr>
              </thead>
              <tbody>{data.users.map(user => <UserPermissions key={user.id} user={user} />)}</tbody>
            </Table>
          </div>
        </div>
      )
    }}
  </Query>
);

class UserPermissions extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array
    }).isRequired,
  };

  state = {
    // populating intial state using props is a no-no in React because if they change
    // at a higher level after component has been created, the state will not be updated.
    // In this situation it is fine because we are seeding the data and then updating
    // when user presses update.
    permissions: this.props.user.permissions,
  }

  handlePermissionChange = e => {
    const checkbox = e.target;
    // take a copy of current permissions
    let updatedPermissions = [...this.state.permissions];

    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value);
    } else {
      updatedPermissions = updatedPermissions.filter(permission => permission !== checkbox.value)
    }
    console.log(updatedPermissions)
    this.setState({
      permissions: updatedPermissions
    })
  }

  render() {
    const user = this.props.user;
    return (
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {possiblePermissions.map(permission => (
          <td key={permission}>
            <label htmlFor={`${user.id}-permission-${permission}`}>
              <input type="checkbox"
                checked={this.state.permissions.includes(permission)}
                value={permission}
                onChange={this.handlePermissionChange}
                />
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