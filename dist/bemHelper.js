define('object-assign',['require','exports','module'],function (require, exports, module) {/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

});

define('react-bem-helper',['require','exports','module','object-assign'],function (require, exports, module) {var assign = require('object-assign');

function isObject(obj) {
  var type = typeof obj;
  return type === 'function' || (type === 'object' && !!obj);
}

function isString(string) {
  return typeof string === 'string';
}

function isFunction(func) {
  return typeof func === 'function';
}

function stringToArray(string) {
  return string.split(/\s+/g).filter(function(c) {return c.length !== 0});
}

function objectToArray(object) {
  return Object.keys(object).reduce(function(array, key) {
    var predicate = object[key];

    if (isFunction(predicate)) {
      predicate = predicate();
    }

    if (predicate) {
      return array.concat(stringToArray(key));
    } else {
      return array;
    }
  }, []);
}

function listToArray(list) {
  if (isString(list) && list !== '') {
    return stringToArray(list);
  } else if (list && list.length) {
    return list.reduce(function (array, string) {
      return !!string ? array.concat(stringToArray(string)) : array;
    }, []);
  } else if (isObject(list)) {
    return objectToArray(list);
  } else {
    return [];
  }
}

function withDefaults(defaults) {
  return function(options) {
    if (isString(options)) {
      options = { name: options };
    }

    var rootDefaults = {
      prefix: '',
      modifierDelimiter: '--',
      outputIsString: false,
    };

    // Copy options on top of defaults
    options = assign(rootDefaults, defaults, options);

    var blockName         = options.prefix + options.name;
    var modifierDelimiter = options.modifierDelimiter;
    var outputIsString    = options.outputIsString;

    return function(first, modifiers, extraClassNames) {
      var element;

      // This means the first parameter is not the element, but a configuration variable
      if (isObject(first)) {
        element = first.element;
        modifiers = first.modifiers || first.modifier;
        extraClassNames = first.extra;
      } else {
        element = first;
      }

      var rootName = element ? blockName + '__' + element : blockName;
      var className = [rootName]
        .concat(listToArray(modifiers).map(function(modifier) {
          return rootName + modifierDelimiter + modifier;
        }))
        .concat(listToArray(extraClassNames))
        .join(' ')
        .trim();

      if (outputIsString) {
        return className;
      } else {
        return { className: className };
      }
    };
  };
}

var BEMHelper = withDefaults({});

BEMHelper.withDefaults = withDefaults;
module.exports = BEMHelper;

});

/* eslint-disable no-param-reassign */
define('bemHelper',['knockout', 'react-bem-helper'], function (ko, BEMHelper) {
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

