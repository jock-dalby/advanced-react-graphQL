const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeANiceEmail } = require('../mail');
const { hasPermission } = require('../utils');

const Mutations = {
  async createItem(parent, args, context, info) {
    // TODO: Check if they are logged in
    if(!context.request.userId) {
      throw new Error('You need to be logged in');
    }

    // 1. context.db is how to access the prisma DB from withing GraphQL layer.
    // 2. The info arg contains the original query which is passed to the DB
    // to specify which data is returned from the DB when new item is created.
    // 3. The DB will return a Promise so need to make createItem and 'async' method and specify the 'await' keyword
    const item = await context.db.mutation.createItem(
      { 
        data:{
          ...args,
          // This is how to create relationships between the item and the user.
          // Give the item a user property, and then on the connect prop, give another obj
          // where we assign the information we want for that user (in this case id).
          // Now the item will have prop value of user: userId along with other info
          user: {
            connect: {
              id: context.request.userId
            }
          }
        }
      },
      info
    );

    return item;
    // If returning the Promise directly no need to use 'await' keyword. e.g. return context.db.....
    // Good to save off to a variable though so if debugging at a later stage it is easy to log out the item.
  },

  updateItem(parent, args, ctx, info) {
    const updates = { ...args };
    // remove the ID from updates because is not something that can be updated
    delete updates.id
    // run the update method
    // ctx is the context in the request
    // db is how we expose the prisma db within the context
    // access queries or mutations that are generated and available within prisma.graphql i.e. updateItem
    return ctx.db.mutation.updateItem({
      data: updates,
      where: {
        id: args.id
      },
      // pass in info as second arg so updateItem knows what to return
      // as this will include the query which is sent from clientside
      info
    })
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id};
    // find the item. Write raw graphQl for what we want intermediary query to return for our server side checks
    const item = await ctx.db.query.item({ where }, `{ id title user { id } }`)

    // check if user is owner of item, or have permissions
    const ownsItem = item.user.id === ctx.request.userId;
    const hasPermissions = ctx.request.user.permissions.some(
      permission => ['ADMIN', 'ITEMDELETE'].includes(permission)
    )

    // if does not have permission, throw error
    if (!ownsItem && !hasPermissions) {
      throw new Error("You don't have permission to do that")
    }

    // delete item
    // pass in client side graphQl for what we want final query to return to client
    return ctx.db.mutation.deleteItem({ where }, info)
  },

  async signup(parent, args, ctx, info) {
    // lowercase the email
    args.email = args.email.toLowerCase();
    // hash the password
    // can either pass 'SALT' or salt length as second argument
    // the salt helps to make the password unique. Research 'Salt (cryptography)'
    const password = await bcrypt.hash(args.password, 10);
    // create the user in the db
    const user = await ctx.db.mutation.createUser({
      data: {
        // spread the args
        ...args,
        // overwrite the password
        password,
        // set the permissions. Everyone who signs up will be a USER to begin with
        // but can update at later time.
        permissions: { set: ['USER'] }
      }
    // info as second argument so knows what data to return to the client
    }, info);
    // log in user and create JWT
    const token = generateJwtToken(user.id);
    // set JWT as cookie on the response
    ctx.response.cookie('token', token, {
      // httpOnly means cookie cannot be accessed via javascript
      // to stop 3rd-part js or rogue chrome extension from scraping
      // and getting hold of cookie data
      httpOnly: true,
      // how long we want cookie to last
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    });
    // return the user to the browser
    return user;
  },
  // destructure args to pull out the email and password props
  async signin(parent, { email, password }, ctx, info) {
    // check if user exists in db
    const user = await ctx.db.query.user({ where: { email }});
    if (!user) {
      // error will be caught in mutation on frontend and we can display this error message to user
      throwNoUserEmailError(email)
    }
    // check if password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid password!')
    }
    // generate jwt
    const token = generateJwtToken(user.id);
    // set cookie with token
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    });
    // return user
    return user;
  },

  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return { message: 'Sign out successful'}
  },

  async requestReset(parent, { email }, ctx, info) {
    // 1. Check if is a real user
    const user = await ctx.db.query.user({ where: { email }});
    if (!user) {
      throwNoUserEmailError(email)
    }
    // 2. Set a reset token and an expiry on user
    // Asynchronously create a random 20 char length hex string
    const randomBytesPromisified = promisify(randomBytes);
    const resetToken = (await randomBytesPromisified(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000 // 1 hour from now
    const response = await ctx.db.mutation.updateUser({
      where: { email },
      data: { resetToken, resetTokenExpiry }
    })
    // 3. Email the reset token
    const mailRes = await transport.sendMail({
      from: 'jock@hello.com',
      to: user.email,
      subject: 'Your password reset token',
      html: makeANiceEmail(
        `Your password reset token is here!
        \n\n
        <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">
          Click here to reset!
        </a>
        `
      )
    })

    // 4. Return the message
    return { message: "thanks"}
  },

  async resetPassword(parent, args, ctx, info) {
    // 1. check if passwords match
    if(args.password !== args.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    // 2. check if resetToken is valid
    // 3. check if resetToken has expired
    // Querying using prop that is not marked as unique, hitting users with resetToken will return the first user it matches the token to
    const [user] = await ctx.db.query.users({
      where: {
        // find first user with this token
        resetToken: args.resetToken,
        // check resetToken expiry is still valid
        resetTokenExpiry_gte: Date.now()
      }
    })
    if(!user) {
      throw new Error('This token is either invalid or expired');
    }
    // 4. Hash the new password
    const password = await bcrypt.hash(args.password, 10);
    // 5. save new password to user and remove old resetToken fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null
      }
    })
    // 6. generate JWT
    const token = generateJwtToken(updatedUser.id);
    // 7. set JWT cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    });
    // 8. return the new user
    return updatedUser;
  },

  async updatePermissions(parent, args, ctx, info) {
    // 1. check if logged in
    if(!ctx.request.userId) {
      throw new Error('You must be logged in!');
    };

    // 2. Query the current user
    const currentUser = await ctx.db.query.user(
      {
        where: {
          id: ctx.request.userId
        }
      },
      info
    );

    // 3. Check if they have permissions to do this
    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);

    // 4. Update the permissions
    return ctx.db.mutation.updateUser({
      data: {
        permissions: {
          set: args.permissions
        }
      },
      where: {
        id: args.userId
      },
    }, info)
  },

  async addToCart(parent, args, ctx, info) {
    // 1. Make sure they are signed in
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error('You must be signed in soooon');
    }
    // 2. Query the users current cart
    // destructure the array to take first item that comes back, because we do not expect multiple results
    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id },
      },
    });
    // 3. Check if that item is already in their cart and increment by 1 if is
    if (existingCartItem) {
      return ctx.db.mutation.updateCartItem(
        {
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + 1 },
        },
        info
      );
    }
    // 4. If it is not, create a fresh CartItem
    return ctx.db.mutation.createCartItem(
      {
        data: {
          user: {
            connect: { id: userId },
          },
          item: {
            connect: { id: args.id },
          },
        },
      },
      info
    );

  },

  async removeFromCart(parent, args, ctx, info) {
    // 1. Find cart item
    const cartItem = await ctx.db.query.cartItem({
      where: {
        id: args.id
      }
    // The client side only needs the item back but we need
    // to know who owns it and so pass in a manual query in
    // for the id of cartItem and the user id of who owns it
    }, `{ id, user { id }}`)
    // 2. make sure we found an item
    if(!cartItem) {
      throw new Error('No cartItem found!');
    }
    // 3. make sure they own that cart item
    if(cartItem.user.id !== ctx.request.userId) {
      throw new Error('Cheating huuuh?? This item does not belong to your cart!')
    }

    // 4. Delete that cart item
    return ctx.db.mutation.deleteCartItem({
      where: {
        id: args.id
      },
      info
    })
  }
};

const generateJwtToken = userId => {
  return jwt.sign({ userId }, process.env.APP_SECRET);
}

const throwNoUserEmailError = email => {
  throw new Error(`No such user found for email ${email}`)
}

module.exports = Mutations;
