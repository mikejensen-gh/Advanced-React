const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: check if logged in

    const item = await ctx.db.mutation.createItem(
      {
        data: { ...args },
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
    const item = await ctx.db.query.item({ where }, `{id, title}`);

    // TODO check if item owned/permissions correct

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
    const token = jwt.sign({ userID: user.id }, process.env.APP_SECRET);

    // set jwt as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });

    // return user to browser
    return user;
  },
};

module.exports = mutations;
