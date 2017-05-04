module.exports = function (config) {
  'use strict';

  config.set({
    baseUrl: '/base',
    frameworks: [
      'jasmine-jquery',
      'jasmine',
      'requirejs'
    ],
    // Welche Dateien sollen für die Tests in die Browser geladen werden?
    files: [
      { pattern: 'spec/bootstrap.js', included: true },
      { pattern: 'vendor/**/*.js', included: false },
      { pattern: 'spec/*.*', included: false },
      { pattern: 'src/*.*', included: false },
      { pattern: 'node_modules/knockout/build/output/knockout-latest.js', included: false }
    ],
    browsers: [
      'PhantomJS'
    ],
    reporters: [
      'dots'
    ],
    // Aktiviert/deaktiviert das automatische Ausführen der Tests, wenn sich eine Datei ändert.
    autoWatch: false,
    failOnEmptyTestSuite: false,

    // Aktiviert/deaktiviert Continuous Integration Modus:
    // Tests nur einmal ausführen und dann beenden.
    singleRun: true
  });
};
