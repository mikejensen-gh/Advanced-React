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

    // delete
    return ctx.db.mutation.deleteItem({ where }, info);
  },
};

module.exports = mutations;
