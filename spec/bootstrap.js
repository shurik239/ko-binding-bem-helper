var tests = [];

/* eslint-disable no-underscore-dangle */
Object.keys(window.__karma__.files).forEach(function (file) {
/* eslint-enable no-underscore-dangle */
  if (/Spec\.js$/.test(file)) {
    tests.push(file.replace(/^\/base\//, 'http://localhost:9877/base/'));
  }
});

require(['/base/src/require_config.js'], function () {
  require.config({

    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: 'http://localhost:9877/base/src',

    // dynamically load all test files
    deps: tests,

    // we have to kickoff jasmine, as it is asynchronous
    callback: function () {
      /* eslint-disable no-underscore-dangle */
      window.__karma__.start();
      /* eslint-enable no-underscore-dangle */
    }

  });
});

/* START workaroud for tests in scrits/tests  */

define('loadTemplateForTest', [
  'jquery',
  'utils/date',
  'ko',
  'utils/location',
  'services/featuresAndRemarksService',
  'vendor/ui/widgets/tabs',
  'slick',
  'jqueryMFP'
], function ($, DateUtils, ko, LocationUtils, featuresAndRemarksService) {
  window.$ = $;
  window.DateUtils = DateUtils;
  window.ko = ko;
  window.LocationUtils = LocationUtils;
  window.featuresAndRemarksService = featuresAndRemarksService;

  return function (url, wrapperHtml, appendto) {
    var $module = $(wrapperHtml);

    if (typeof appendto === 'undefined') {
      $module.appendTo('body');
    }

    $.ajax({
      async: false, // must be synchronous to guarantee that no
                    // tests are run before fixture is loaded
      cache: false,
      url: 'base/' + url,
      dataType: 'html',
      success: function (data) {
        $module.append(data);
      }
    });

    return $module;
  };
});

window.DTO = {
  modules: {}
};

/* END workaroud for tests in scrits/tests  */
