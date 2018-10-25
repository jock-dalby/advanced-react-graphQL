mutation {
  createUser(data: {
    name: "Steve Louise",
    email: "wahey@theman.com"
  }) {
    name
    email
  }
}

Above graphQl mutatuon will create a new user and request the new users name and email back once created

---------------

query {
  users(where: {
    name_contains: "Steve"
  }) {
    id
    name
  }
}

Above graphQl query will fetch all users where name contains 'Steve' and will return their name and id.