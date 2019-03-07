const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { makeANiceEmail, transport } = require('../mail');
const { hasPermission } = require('../utils');

const oneYear = 1000 * 60 * 60 * 24 * 365;

const mutations = {
  async createItem(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to create a new item');
    }

    const item = await ctx.db.mutation.createItem(
      {
        data: {
          // this is how relationships are create between item and user in prisma
          user: {
            connect: {
              id: ctx.request.userId,
            },
          },
          ...args,
        },
      },
      info
    );

    return item;
  },

  updateItem(parent, args, ctx, info) {
    // first take a copy of the updates
    const updates = { ...args };

    // remove ID from the updates;
    delete updates.id;

    // run the update method
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info
    );
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };

    // find item
    const item = await ctx.db.query.item({ where }, `{id, title, user { id }}`);

    const ownsItem = item.user.id === ctx.request.userId;
    const hasPermissions = ctx.request.user.permissions.some(permission =>
      ['ADMIN', 'ITEMDELETE'].includes(permission)
    );

    if (!ownsItem && !hasPermissions) {
      throw new Error("you don't have permission to delete this item");
    }

    // delete item
    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    args.password = await bcrypt.hash(args.password, 10);

    // create user in DB
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          permissions: { set: ['USER'] },
        },
      },
      info
    );

    // create JWT token for user
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    // set jwt as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: oneYear, // 1 year cookie
    });

    // return user to browser
    return user;
  },

  // async signin(parent, { email, password }, ctx, info) {
  //   const where = {
  //     email: email.toLowerCase(),
  //     password: await bcrypt.hash(password, 10),
  //   };

  //   // get user matching to email
  //   const user = await ctx.db.query.user({ where }, `{id}`);

  //   if (!user) {
  //     throw new Error(`No user found for email ${email}`);
  //   }

  //   // create JWT token for user
  //   const token = jwt.sign({ userID: user.id }, process.env.APP_SECRET);

  //   // set jwt as a cookie on the response
  //   ctx.response.cookie('token', token, {
  //     httpOnly: true,
  //     maxAge: oneYear, // 1 year cookie
  //   });

  //   // return user to browser
  //   return user;
  // },

  async signin(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email } });

    if (!user) {
      throw new Error(`No user found for email ${email}`);
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: oneYear, // 1 year cookie
    });

    return user;
  },

  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');

    return { message: 'Successfully signed out' };
  },

  async requestReset(parent, args, ctx, info) {
    // 1. Check if this is a real user
    const user = await ctx.db.query.user({ where: { email: args.email } });

    if (!user) {
      throw new Error(`No user found for email ${args.email}`);
    }

    // 2. Set a reset token and expiry on the user
    const randomBytesPromisified = promisify(randomBytes);
    const resetToken = (await randomBytesPromisified(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry },
    });

    // 4. Email reset token

    const mailRes = await transport.sendMail({
      from: 'mike@mike.com',
      to: user.email,
      subject: 'Your password reset token',
      html: makeANiceEmail(
        `Your password reset token is here! \n\n <a href="${
          process.env.FRONTEND_URL
        }/reset?resetToken=${resetToken}">Click here to reset</a>`
      ),
    });

    // 4. Email user the reset token
    return { message: 'Successfully sent password reset email' };
  },

  async resetPassword(parent, args, ctx, info) {
    // 1. check if submitted passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error('Passwords do not match!');
    }

    // 2. check if reset token legit
    // 3. check if expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000,
      },
    });

    if (!user) {
      throw new Error('Reset token either not found or expired!');
    }

    // 4. hash new pw
    const password = await bcrypt.hash(args.password, 10);

    // 5. save new pw to user and remove old resetToken fields
    const updatedUser = await ctx.db.mutation.updateUser(
      {
        where: { email: user.email },
        data: {
          password,
          resetToken: null,
          resetTokenExpiry: null,
        },
      },
      info
    );

    // 6. generate jwt
    // create JWT token for user
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);

    // 7. set jwt cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: oneYear,
    });

    // 8. return user
    return updatedUser;
  },

  async updatePermissions(parent, args, ctx, info) {
    // check if logged in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in!');
    }

    // query current user
    const currentUser = await ctx.db.query.user(
      {
        where: {
          id: ctx.request.userId,
        },
      },
      info
    );

    // check if they have permissions to update permissons
    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);

    // update permissions
    return ctx.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions,
          },
        },
        where: {
          id: args.userId,
        },
      },
      info
    );
  },

  async addToCart(parent, args, ctx, info) {
    // 1. Make sure user is signed in
    const { userId } = ctx.request;

    if (!userId) {
      throw new Error('You must be signed in!');
    }

    // 2. Query user's current cart
    // we use query.cartItems() instead of query.cartItem() because the plural query has much more flexible and extensive filtering/searching options - generally singular queries only allow selection via Id
    const [existingCartItem] = await ctx.db.query.cartItems(
      {
        where: {
          user: { id: userId },
          item: { id: args.id },
        },
      },
      info
    );

    // 3. Check if item is already in cart, if so increment by one
    if (existingCartItem) {
      console.log('This item is already in cart');

      return ctx.db.mutation.updateCartItem(
        {
          where: {
            id: existingCartItem.id,
          },
          data: {
            quantity: existingCartItem.quantity + 1,
          },
        },
        info
      );
    }

    // 4. else create a fresh CartItem
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
};

module.exports = mutations;
