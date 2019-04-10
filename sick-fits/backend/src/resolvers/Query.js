// forwardTo can be used to directly forward the request to prisma from yoga, without any custom authentication handling etc in between
const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.userId) {
      return null;
    }

    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId },
      },
      info
    );
  },

  async users(parent, args, ctx, info) {
    // 0. check if user logged in
    if (!ctx.request.userId) {
      throw new Error('Not logged in.');
    }

    // 1. check if user has permissions to query all the users
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

    // 2. if so, query all users
    return ctx.db.query.users({}, info);
  },

  async order(parent, args, ctx, info) {
    // 1. make sure use is logged in
    if (!ctx.request.userId) {
      throw new Error('Not logged in.');
    }

    // 2. query current order
    const order = await ctx.db.query.order(
      {
        where: { id: args.id },
      },
      info
    );

    if (!order) {
      throw new Error('No order found!');
    }

    // 3. check if they have permissions to see order
    const ownsOrder = order.user.id === ctx.request.userId;
    const hasPermissionsToSeeOrder = ctx.request.user.permissions.includes(
      'ADMIN'
    );

    if (!ownsOrder && !hasPermissionsToSeeOrder) {
      throw new Error("You don't have permission to do this you scoundrel!");
    }

    // 4. return the order
    return order;
  },
};

module.exports = Query;
