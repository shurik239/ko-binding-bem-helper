define(['knockout'], function(ko) {
  'use strict';

  return ko.bindingHandlers.bemHelper = {
    update: function(element, valueAccessor) {
      if (ko.utils.unwrapObservable(valueAccessor())) {
        //set it to string readonly for consistency with older IE browsers, they report boolean attributes like that anyway
        element.setAttribute('readonly', 'readonly');
      } else {
        element.removeAttribute('readonly');
      }
    }
  };
});