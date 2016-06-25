Meteor.publish('trailGuideAllOrders', function (find, limit, sort, fields) {
  check(find, Object);
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
  let findCriteria = _.clone(find);
  findCriteria.shopId = shopId;
  if (findCriteria['billing.address.fullName']) {
    findCriteria['billing.address.fullName'] = new RegExp(findCriteria['billing.address.fullName'], 'i');
  }
  if (Roles.userIsInRole(this.userId, 'trail-guide', ReactionCore.getShopId())) {
    return ReactionCore.Collections.Orders.find(findCriteria, {
      limit: limit,
      sort: sort,
      fields: returnFields
    });
  }
});
