Package.describe({
  summary: 'GetOutfitted\'s Order Searching',
  name: 'getoutfitted:trail-guide',
  version: '0.1.0',
  git: 'https://github.com/getoutfitted/trail-guide'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.3');
  api.use('meteor-platform');
  api.use('http');
  api.use('underscore');
  api.use('standard-minifiers');
  api.use('reactioncommerce:core@0.12.0');
  api.use('reactioncommerce:reaction-router');
  api.use('reactioncommerce:reaction-collections');
  api.use('getoutfitted:reaction-advanced-fulfillment');

  api.addFiles([
    'server/registry.js',
    'server/publications/trailGuide.js'
  ], 'server');

  api.addFiles([
    'client/templates/dashboard/dashboard.html',
    'client/templates/dashboard/dashboard.js',
    'client/templates/settings/settings.html',
    'client/templates/settings/settings.js'
  ], 'client');
});
