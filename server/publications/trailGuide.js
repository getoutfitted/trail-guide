Meteor.publish('trailGuideAllOrders', function (limit, sort) {
  check(limit, Number);
  check(sort, Object);
  const shopId = ReactionCore.getShopId();
  if (Roles.userIsInRole(this.userId, 'trail-guide', ReactionCore.getShopId())) {
    return ReactionCore.Collections.Orders.find({
      shopId: shopId
    }, {
      limit: limit,
      sort: sort
    });
  }
});
