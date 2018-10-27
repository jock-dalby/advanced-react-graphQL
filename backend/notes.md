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

----------------------

### Steps for adding a new piece of data to backend

- Update datamode.graphql with new typings.
- Deploy changes to Prisma to pull down updated schema. Open up prisma.graphql to see newly generated relationships / types / queries / mutations that are required for the underlying CRUD api that sits underneath the GraphQL layer.
- Write any queries and/or mutations to the public facing api in schema.graphql.
- Test new queries and/or mutations in playground.



