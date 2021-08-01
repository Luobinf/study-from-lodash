import slice from './slice.js'

/**
 * Creates an array of elements split into groups the length of `size`.
 * If `array` can't be split evenly, the final chunk will be the remaining
 * elements.
 *
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to process.
 * @param {number} [size=1] The length of each chunk
 * @returns {Array} Returns the new array of chunks.
 * @example
 *
 * chunk(['a', 'b', 'c', 'd'], 2)
 * // => [['a', 'b'], ['c', 'd']]
 *
 * chunk(['a', 'b', 'c', 'd'], 3)
 * // => [['a', 'b', 'c'], ['d']]
 */
function chunk(array, size = 1) {
  size = Math.max(size, 0)
  const length = array == null ? 0 : array.length
  if (!length || size < 1) {
    return []
  }
  let index = 0
  let resIndex = 0
  const result = new Array(Math.ceil(length / size))   //length = 4, size = 3

  while (index < length) {
    result[resIndex++] = slice(array, index, (index += size))
  }
  return result
}

export default chunk


// chunk原理：先通过slice方法切割下来，再将它放入到一个新的容器中去。
// size大于数组长度， size为负数, size为正数, size为零，不传默认为1
// function chunLike(array, size = 1) {
 
// }

// var a = chunk([10,20,30] , 0)

// console.log( a )
