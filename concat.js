
// var context = context == null // ? root : _.defaults(root.Object(), context, _.pick(root, contextProps));

/** Built-in constructor references. */


var Array = global.Array
var Symbol = global.Symbol
var isArray = Array.isArray;
var objectProto = Object.prototype;
var nativeObjectToString = objectProto.toString;
var  symToStringTag = Symbol ? Symbol.toStringTag : undefined;
var argsTag = '[object Arguments]'
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined    //  Symbol.isConcatSpreadable 符号用于配置某对象作为Array.prototype.concat()方法的参数时是否展开其数组元素。

/**
* Copies the values of `source` to `array`.
*
* @private
* @param {Array} source The array to copy values from.
* @param {Array} [array=[]] The array to copy values to.
* @returns {Array} Returns `array`.
*/

function copyArray(source, array) {
  var index = -1,
    length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
// 检查 value 是否是一个可以拍平的参数对象或数组, 先通过 isArray 判断是否是一个数组，然后再通过 isArguments 去判断。
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

// Symbol ? Symbol.isConcatSpreadable : undefined

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */

// 检查 value 是否是一个类 arguments 对象
var isArguments = baseIsArguments(function () { return arguments; }()) ? baseIsArguments : function (value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */

 /** `Object#toString` result references. */
var undefinedTag = '[object Undefined]',
    nullTag = '[object Null]'
                                                                                                                                                                                 
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
    tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) { }

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/**
* Converts `value` to a string using `Object.prototype.toString`.
*
* @private
* @param {*} value The value to convert.
* @returns {string} Returns the converted string.
*/
function objectToString(value) {
  return nativeObjectToString.call(value);
}
/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.  //每次迭代被调用的函数
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
    length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}


/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
    length = values.length,
    offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}




// concat方法调用了以上这些方法。
/**
 * Creates a new array concatenating `array` with any additional arrays
 * and/or values.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to concatenate.
 * @param {...*} [values] The values to concatenate.
 * @returns {Array} Returns the new concatenated array.
 * @example
 *
 * var array = [1];
 * var other = _.concat(array, 2, [3], [[4]]);
 *
 * console.log(other);
 * // => [1, 2, 3, [4]]
 *
 * console.log(array);
 * // => [1]
 */
function concat() {
  var length = arguments.length;
  if (!length) {
    return [];
  }
  var args = Array(length - 1),
    array = arguments[0],  // 原数组array
    index = length;

  while (index--) {
    args[index - 1] = arguments[index];
  }
  console.log(args);                                                               
  return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
}

// console.log( concat() )  //返回空数组
// console.log( concat([10], 2, [3], [[4]]) )


// var result = baseFlatten([1, [20,30,40, [150]]], 2)
// console.log(result)
// console.log( isFlattenable(3) )
// console.log(　concat([1,2], [3, [4,5]]) )　


// baseFlatten、isFlattenable、arrayPush 这几个函数比较重要，仔细看看


// baseFlatten改写
// function baseFlatten(array, depth, predicate, result) {
//   let index = -1,
//       length = array.length
//   result || ( result = [] )  //结果数组
//   predicate || ( predicate = isFlattenable)

//   while(++index < length) {
//     let value = array[index]
//     if(depth > 0 && predicate(value) ) {
//       if(depth === 1) {
//         for(let i = 0; i < value.length;i++) {
//           result[result.length] = value[i]
//         }
//       } else {
//         baseFlatten(value, depth - 1, predicate, result)
//       }
//     } else {
//       result[result.length] = value
//     }
//   }
//   return result
// }

console.log( baseFlatten([1, [20,30]]) )      // 返回原数组
console.log( baseFlatten([ 1, [ 20,30, [50,100] ] ], 1) )      // 返回 [1, 20, 30]
console.log( baseFlatten([ 1, [ 20,30, [50,100] ] ], 2) )


// Symbol.isConcatSpreadable符号用于配置某对象作为Array.prototype.concat()方法的参数时是否展开其数组元素。
var test = { 0: 'name', 1: 'age', length: 2 }
test[Symbol.isConcatSpreadable] = true
console.log( baseFlatten([ 1, test], 1) )