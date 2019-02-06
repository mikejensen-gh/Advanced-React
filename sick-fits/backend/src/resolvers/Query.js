// forwardTo can be used to directly forward the request to prisma from yoga, without any custom authentication handling etc in between

const { forwardTo } = require('prisma-binding');

const Query = {
  // async items(parent, args, ctx, info) {
  //   const items = await ctx.db.query.items();

  //   return items;
  // },

  items: forwardTo('db'),
};

module.exports = Query;
