const defaultDisplayFields = [
  'orderNumber',
  'customer',
  'contact',
  'total',
  'createdAt',
  'transit',
  'shipping',
  'rentalStart',
  'rentalEnd'
];

// const HumanReadable = {
//   'orderNumber': 'Order Number',
//   'customer': 'Customer',
//   'contact': 'Contact',
//   'billing.invoice.total': 'Total'
// };

// const Sortable = {
//   'orderNumber': true,
//   'customer': false,
//   'contact': false,
//   'billing.invoice.total': true
// };

Template.trailGuideDashboard.onCreated(function () {
  Session.setDefault('sortField', 'orderNumber');
  Session.setDefault('sortOrder', -1);
  Session.setDefault('limit', 20);
  Session.setDefault('customerEnabled', true);
  let displayFields = defaultDisplayFields;
  let defaultDisplay = {};
  _.each(displayFields, function (df) {
    defaultDisplay[df] = true;
  });
  Session.setDefault('enabledFields', defaultDisplay);
  this.autorun(() => {
    let field = Session.get('sortField');
    let order = Session.get('sortOrder');
    let limit = Session.get('limit') || 20;
    let sort = {};
    sort[field] = order;
    this.subscribe('trailGuideAllOrders', limit, sort);
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
  upOrDown: function (field) {
    if (Session.get('sortField') === field && Session.get('sortOrder') === -1) {
      return `<i data-field=${field} class="fa fa-caret-up change" aria-hidden="true"></i>`;
    }
    return `<i data-field="${field}" class="fa fa-caret-down change" aria-hidden="true"></i>`;
  },
  clearDate: function (date) {
    return moment(date).format('M/D/YY');
  },
  region: function (type) {
    return this[type][0].address.region;
  },
  customer: function () {
    return this.billing[0].address.fullName;
  },
  contactInfo: function () {
    let email = this.email;
    let phone = this.billing[0].address.phone;
    return `<p>${email}</p><p>${phone}</p>`;
  },
  humanizeStatus: function () {
    return AdvancedFulfillment.humanOrderStatuses[this.advancedFulfillment.workflow.status];
  },
  total: function () {
    return this.billing[0].invoice.total;
  },
  sortingBy: function (field) {
    if (Session.get('sortField') === field) {
      return 'active';
    }
    return '';
  },
  currentLimit: function () {
    return Session.get('limit');
  },
  customerEnabled: function () {
    return Session.get('customerEnabled');
  },
  fields: function (field) {
    return Session.get('enabledFields')[field];
  },
  displayFields: function () {
    return defaultDisplayFields;
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
  }
});
