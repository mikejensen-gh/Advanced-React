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
};

module.exports = Query;
