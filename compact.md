## lodash源码分析之compact

`compact:` 将...压实的意思。

`lodash` 中 `compact` 方法用于创建一个新数组，并且把所有的 `falsy` 值过滤掉。


我们先来看看 `MDN` 是如何定义 `falsy` 值的：
> falsy 值 (虚值) 是在 Boolean 上下文中认定为 false 的值。

在 `JavaScript` 中只有8个 `falsy` 值。
> 这意味着当 JavaScript 期望一个布尔值，并被给与下面值中的一个时，它总是会被当做 false。
> 这 8 个值分别为： false、0、-0、0n、""、null、undefined、NaN。0n表示当 BigInt 作为布尔值使用时, 遵从其作为数值的规则. 0n 是 falsy 值。


例如：
```JS
let arr = [10,20,0,false,NaN]
_.compact(arr)  //返回 [10,20]
```


### compact 源码解析

```JS
/**
 * Creates an array with all falsey values removed. The values `false`, `null`,
 * `0`, `""`, `undefined`, and `NaN` are falsey.
 *
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to compact.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * compact([0, 1, false, 2, '', 3])
 * // => [1, 2, 3]
 */
 function compact(array) {
  let resIndex = 0
  const result = []

  if (array == null) {
    return result
  }

  for (const value of array) {
    if (value) {
      result[resIndex++] = value
    }
  }
  return result
}
```

`compact` 源码非常简单, 只有十几行。

首先判断传入的数组是否为 `null` 或 `undefined` ，若是直接返回空数组。
然后使用 `for...of` 去迭代数组，获取数组的 `value` ，注意这里不是 `key` 。如果 `value` 不为 `falsy` 值，则将数组的 `value` 放入到 `result` 中，最后返回 `result` 。



