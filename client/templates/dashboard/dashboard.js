const DefaultFields = {
  'orderNumber': '#',
  'billing.address.fullName': 'Customer',
  'email': 'Email',
  'billing.address.phone': 'Phone',
  'billing.invoice.total': 'Total',
  'createdAt': 'Created',
  'advancedFulfillment.transitTime': 'Transit',
  'advancedFulfillment.shipmentDate': 'Shipping',
  'startTime': 'Rental Start',
  'endTime': 'Rental End',
  'advancedFulfillment.returnDate': 'Returning',
  'rentalDays': 'Length',
  'shipping.address.region': 'Ship To',
  'billing.address.region': 'Bill To',
  'advancedFulfillment.workflow.status': 'Status',
  'advancedFulfillment.localDelivery': 'Local'
};


Template.trailGuideDashboard.onCreated(function () {
  Session.setDefault('sortField', 'orderNumber');
  Session.setDefault('sortOrder', -1);
  Session.setDefault('limit', 20);
  Session.setDefault('find', {});
  let displayFields = Object.keys(DefaultFields);
  let defaultDisplay = {};
  _.each(displayFields, function (df) {
    const nonDefault = ['email', 'billing.address.phone', 'advancedFulfillment.localDelivery'];
    if (_.contains(nonDefault, df)) {
      defaultDisplay[df] = false;
    } else {
      defaultDisplay[df] = true;
    }
  });
  Session.setDefault('enabledFields', defaultDisplay);
  this.autorun(() => {
    let field = Session.get('sortField');
    let order = Session.get('sortOrder');
    let limit = Session.get('limit') || 20;
    let activeFields = Session.get('enabledFields');
    let find = Session.get('find');
    let sort = {};
    sort[field] = order;
    this.subscribe('trailGuideAllOrders', find, limit, sort, activeFields);
  });
});

Template.trailGuideDashboard.helpers({
  orders: function () {
    let field = Session.get('sortField');
    let order = Session.get('sortOrder');
    let sortOrder = {};
    sortOrder[field] = order;
    return ReactionCore.Collections.Orders.find({}, {
      sort: sortOrder
    });
  },
  currentLimit: function () {
    return Session.get('limit');
  },
  fields: function (field) {
    return Session.get('enabledFields')[field];
  },
  displayFields: function () {
    return Object.keys(DefaultFields);
  },
  humanReadableField: function (field) {
    return DefaultFields[field];
  }
});

Template.trailGuideDashboard.events({
  'click .sortField': function (event) {
    event.preventDefault();
    let selectedField = event.currentTarget.dataset.field;
    let inverseOrder = -Session.get('sortOrder');
    Session.set('sortField', selectedField);
    Session.set('sortOrder', inverseOrder);
  },
  'change .limitFilter': function (event) {
    event.preventDefault();
    const limit = parseInt(event.target.value, 10);
    if (typeof limit === 'number') {
      Session.set('limit', limit);
    }
  },
  'change #customerEnabled': function () {
    Session.set('customerEnabled', event.target.checked);
  },
  'change .toggleDisplayField': function () {
    const field = event.target.name;
    let displaySettings = Session.get('enabledFields');
    displaySettings[field] = !displaySettings[field];
    Session.set('enabledFields', displaySettings);
  },
  'submit .advancedSearchFilters': function (event) {
    event.preventDefault();
    let find = Session.get('find');
    const billingName = event.target.billingName.value;
    if (billingName) {
      find['billing.address.fullName'] = billingName;
    }
    Session.set('find', find);
  }
});

Template.columnGroupHeader.helpers({
  enabled: function () {
    const str = this.valueOf();
    return Session.get('enabledFields')[str];
  },
  active: function () {
    const str = this.valueOf();
    if (Session.get('sortField') === str) {
      return 'active';
    }
    return '';
  }
});

Template.columnMainHeaders.helpers({
  enabled: function () {
    const str = this.valueOf();
    return Session.get('enabledFields')[str];
  },
  label: function () {
    const str = this.valueOf();
    return DefaultFields[str];
  },
  upOrDown: function () {
    const field = this.valueOf();
    if (Session.get('sortField') === field && Session.get('sortOrder') === -1) {
      return 'upArrow';
    }
    return 'downArrow';
  }
});

Template.columnMainRow.helpers({
  enabled: function () {
    const str = this.valueOf();
    return Session.get('enabledFields')[str];
  },
  orderInfo: function () {
    const field = this.valueOf();
    switch (field) {
    case 'billing.address.fullName':
      return Template.parentData().billing[0].address.fullName;
    case 'billing.address.phone':
      return Template.parentData().billing[0].address.phone;
    case 'advancedFulfillment.localDelivery':
    case 'advancedFulfillment.transitTime':
      const afField = field.split('.')[1];
      return Template.parentData().advancedFulfillment[afField];
    // Using Fall through technique which is || in Switch
    case 'createdAt':
    case 'startTime':
    case 'endTime':
      const date = Template.parentData()[this.valueOf()];
      return moment(date).format('M/D/YY');
    case 'advancedFulfillment.shipmentDate':
      const shipDate = Template.parentData().advancedFulfillment.shipmentDate;
      return moment(shipDate).format('M/D/YY');
    case 'advancedFulfillment.returnDate':
      const returnDate = Template.parentData().advancedFulfillment.returnDate;
      return moment(returnDate).format('M/D/YY');
    case 'shipping.address.region':
    case 'billing.address.region':
      const billingOrShipping = field.split('.')[0];
      return Template.parentData()[billingOrShipping][0].address.region;
    case 'billing.invoice.total':
      return `$${Template.parentData().billing[0].invoice.total}`;
    case 'advancedFulfillment.workflow.status':
      const status = Template.parentData().advancedFulfillment.workflow.status;
      return AdvancedFulfillment.humanOrderStatuses[status];
    default:
      return Template.parentData()[this.valueOf()];
    }
  }
});
