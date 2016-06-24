Meteor.publish('trailGuideAllOrders', function (limit, sort, fields) {
  check(limit, Number);
  check(sort, Object);
  check(fields, Object);
  let returnFields = {};
  _.each(fields, function (value, index) {
    if (value) {
      returnFields[index] = 1;
    }
  });
  const shopId = ReactionCore.getShopId();
  if (Roles.userIsInRole(this.userId, 'trail-guide', ReactionCore.getShopId())) {
    return ReactionCore.Collections.Orders.find({
      shopId: shopId
    }, {
      limit: limit,
      sort: sort,
      fields: returnFields
    });
  }
});
