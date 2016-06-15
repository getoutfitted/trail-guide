Meteor.publish('trailGuideAllOrders', function (sort) {
  check(sort, Object);
  const shopId = ReactionCore.getShopId();
  if (Roles.userIsInRole(this.userId, 'trail-guide', ReactionCore.getShopId())) {
    return ReactionCore.Collections.Orders.find({
      shopId: shopId
    }, {sort: sort});
  }
});
