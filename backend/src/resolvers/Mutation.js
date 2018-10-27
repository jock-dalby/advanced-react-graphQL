const Mutations = {
  createDog(parent, args, context, info) {
    // Just for example purposes using global to save data.
    // Never to be used in real app.
    global.dogs = global.dogs || [];
    const newDog = { name: args.name }
    global.dogs.push(newDog);
    return newDog;
  }
};

/**
 * Example mutation in playground

 If have more than one query or mutation in playground, can name them to choose which one to run

  mutation createADog {
    createDog(name: "Snickers") {
      name
    }
  }
*/

module.exports = Mutations;
