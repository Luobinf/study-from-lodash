## 从 lodash 源码 slice 方法看稀疏数组与密集数组

`稀疏数组`就是包含从0开始的不连续索引的数组。通常，数组的length属性值代表数组中元素的个数。如果数组是稀疏的，length属性值大于元素的个数。

举个例子说明一下：

```JS
let sparse = new Array(5)  // [empty × 5]
let dense = new Array(5).fill(undefined) // [undefined, undefined, undefined, undefined, undefined]
```

上述代码中，其中 `sparse` 的 `length` 为 5， 但是 `sparse` 数组没有元素，其 `length` 大于数组中元素的个数，为稀疏数组。`dense` 数组的每一个元素值都为 `undefined`，为密集数组。

lodash 中 `slice` 与 `Array.prototype.slice` 方法最大的不同就是 `lodash` 中 `slice` 方法将数组看成是密集数组，数组原生 `slice` 方法则看成是稀疏数组。

**那么稀疏数组与密集数组到底有什么不同呢?**

稀疏数组与密集数组在循环时遍历的次数不同。

```JS
let sparse = new Array(5)
sparse[2] = 'jack'
let dense = new Array(5).fill(undefined)

for(let key in sparse) {
  console.log(sparse[key])  // 'jack'
}


for(let key in dense) {
  console.log(dense[key])  //打印出5个undefined
}

```

以上 `sparse` 数组遍历了一次，`dense` 数组遍历了 5 次。


## slice源码解析

`slice` 方法 与 `Array.prototype.slice` 的规则一样，除了 `slice` 方法使用密集数组来对待数组，`原生 slice` 使用稀疏数组方式来对待数组。

MDN中对原生 slice 方法的描述：
> Array.prototype.slice
>
> slice() 方法返回一个新的数组对象，这一对象是一个由 begin 和 end 决定的原数组的浅拷贝（包括 begin，不包括end）。原始数组不会被改变。

其中 `begin`、 `end` 都是可选的，这一点在 `lodash slice` 方法中也一样。



```JS
/**
 * Creates a slice of `array` from `start` up to, but not including, `end`.
 *
 * **Note:** This method is used instead of
 * [`Array#slice`](https://mdn.io/Array/slice) to ensure dense arrays are
 * returned.
 *
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position. A negative index will be treated as an offset from the end.
 * @param {number} [end=array.length] The end position. A negative index will be treated as an offset from the end.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * var array = [1, 2, 3, 4]
 *
 * _.slice(array, 2)
 * // => [3, 4]
 */
function slice(array, start, end) {
  let length = array == null ? 0 : array.length
  if (!length) {
    return []
  }
  start = start == null ? 0 : start
  end = end === undefined ? length : end

  if (start < 0) {
    start = -start > length ? 0 : (length + start)
  }
  end = end > length ? length : end
  if (end < 0) {
    end += length
  }
  length = start > end ? 0 : ((end - start) >>> 0)
  start >>>= 0

  let index = -1
  const result = new Array(length)
  while (++index < length) {
    result[index] = array[index + start]
  }
  return result
}

export default slice

```

### 1. slice 方法不传递 array 时，返回空数组

```JS
  function slice(array, start, end) {
    let length = array == null ? 0 : array.length
    if (!length) {
      return []
    }
    //.....
  }
```

**当 array 不传递或为 null 或 undefiend 时，length 计算出来为0。**

**那么当array是number、string、boolean、symbol、object（包括array、function等）时为什么取array.length时不报错？**

**基本数据类型 number、string、boolean、symbol，在一定的条件下会被自动转化为对象，也就是原始类型的`"包装对象"`，使得基本类型可以调用一些方法和获取属性。**

1.1.1 当入参 array 为 number 时， array.length 为undefiend， slice方法直接返回空数组。
1.1.2 当入参 array 为 string 时， array.length 则字符数。
1.1.3  当入参 array 为 string 时，array.length 为undefiend， slice方法直接返回空数组。
1.1.4 当入参 array 为 symbol 时，array.length 为undefiend， slice方法直接返回空数组。
1.1.4  当入参 array 为 Object 时，array.length 则需要分别看待了，若对象类型是function时，array.length 为 0， slice方法直接返回空数组；若为其它类型（Date、RegExp等）时，则为undefined，slice方法也直接返回空数组。


### 2. 继续往下解析, 处理 start 、end 参数

```JS
function slice(array, start, end) {
  let length = array == null ? 0 : array.length
  if (!length) {
    return []
  }
  start = start == null ? 0 : start
  end = end === undefined ? length : end

  if (start < 0) {
    start = -start > length ? 0 : (length + start)
  }
  end = end > length ? length : end
  if (end < 0) {
    end += length
  }
  length = start > end ? 0 : ((end - start) >>> 0)
  start >>>= 0

  let index = -1
  const result = new Array(length)
  while (++index < length) {
    result[index] = array[index + start]
  }
  return result
}
```

```JS
 start = start == null ? 0 : start
 end = end === undefined ? length : end

```

当 `start` 参数省略时， 则索引从0开始。
当 `end` 参数省略时， 则直接以 `array.length` 结尾。


```JS
 if (start < 0) {
    start = -start > length ? 0 : (length + start)
  }
  end = end > length ? length : end
  if (end < 0) {
    end += length
  }
  length = start > end ? 0 : ((end - start) >>> 0)
  start >>>= 0
```

当 `start` 参数小于0时， 大于array长度时，直接从索引0位置作为起始值。否则 start 设置为 length + start

`end` 分三种情况: 

1. 当 end 大于 length时，那么结尾的索引直接置为 length。
2. 当 end 小于等于 length时 结尾索引置为 end。
3. 当 end 索引小于 0 时， 结尾索引为 end + length

最终新数组的 `length` 即取决于 `start` 和 `end`。 当 `start > end` 时，新数组的` length` 为 0， 否则为 `end - start`。

那为什么要使用 >>> 呢 ? >>> 是什么意思 ?

MDN >>> 说明:
> 按位无符号右移运算符。

**无符号右移就是在左边填充0，剩余的数字往右移动。无符号左移就是在右边填充0，剩余的数字往左移动。**

```JS
a >>>= 2
// 等同于
a = a >>> 2
```

MDN例子: 
```JS
let a = 5; //  00000000000000000000000000000101

a >>>= 2;  //  00000000000000000000000000000001
console.log(a);
// expected output: 1

let b = -5; // -00000000000000000000000000000101

b >>>= 2;   //  00111111111111111111111111111110
console.log(b);
// expected output: 1073741822
```

lodash中 slice有两处地方使用了 >>> 。

```jS
(end - start) >>> 0
start >>>= 0
```

**使用的目的是为了当 start 、end 参数无意义时，用于确保 start 或 (end - start) 为 0，也使得后续使用while循环时不报错。**

当 start 或 end 为 function(){}等时， 

```JS
start = function() {}
end = function () {}
start >>>= 0   // start 最终为 0

length = end - start >>> 0 // length 最终为 0 
```


### 3. 循环处理，并返回result

```JS
  let index = -1
  const result = new Array(length)
  while (++index < length) {
    result[index] = array[index + start]
  }
  return result
```

上述循环代码中的 `length` 为最终新数组的长度，从 `start` 位置开始获取原数组的值，一次存入到新数组中， 最后返回 `result`。

由于通过索引获取数组，当 `array `是 稀疏数组时，` result[index]` 的值为 `undefiend`,但这并不表示原有的入参数组在该位置处的值为 `undefined` 。










