/* eslint-disable no-param-reassign */
define(['knockout', 'react-bem-helper'], function (ko, BEMHelper) {
  'use strict';

  ko.bindingHandlers.bemHelper = {
    update: function (element, valueAccessor) {
      var params = valueAccessor() || {};
      var mainClass = (element.className || '').split(/\s+/)[0] || params.name;
      var bemHelper;

      if (!mainClass) {
        throw new Error('component name is not defined');
      }

      bemHelper = new BEMHelper({ name: mainClass, outputIsString: true });
      element.className = bemHelper(params);
    }
  };
});
