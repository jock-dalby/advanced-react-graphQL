const Query = {
  // parent: the parent schema
  // arguements that have been passed to the query
  // context: way to access the DB and rest of the incoming request (headers, cookies etc.)
  // info: info around GraphQL query coming in
  dogs(parent, args, context, info) {
    // Just for example purposes using global to save data.
    global.dogs = global.dogs || [{ name: 'Alfie' }, { name: 'Mac' }];
    return global.dogs;
  }
};

/**
 * Example query in playground

 If have more than one query or mutation in playground, can name them to choose which one to run
 
 query getAllDogs {
    dogs {
      name
    }
  }
 */

module.exports = Query;
