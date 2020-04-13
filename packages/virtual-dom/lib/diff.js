// 参考 https://github.com/Matt-Esch/virtual-dom/blob/master/vtree/diff.js
const _ = require('lodash')
const patch = require('./vpatch.js')

/**
 * 二叉树 diff
 * @param lastVNode
 * @param newVNode
 */
function diff (lastVNode, newVNode) {
  let index = 0
  const patches = {}
  // patches.old = lastVNode
  dftWalk(lastVNode, newVNode, index, patches)
  return patches
}

/**
 * 深入优先遍历算法 (depth-first traversal，DFT)
 * @param {*} lastVNode
 * @param {*} newVNode
 * @param {*} index
 * @param {*} patches
 */
function dftWalk(lastVNode, newVNode, index, patches) {
  if (lastVNode === newVNode) {
    return
  }

  const currentPatch = []

  // Node is removed
  if (newVNode === null) {
    currentPatch.push({ type: patch.REMOVE })

  // diff text
  } else if (_.isString(lastVNode) && _.isString(newVNode)) {
    if (newVNode !== lastVNode) {
      currentPatch.push({ type: patch.TEXT, text: newVNode })
    }

  // same node  此处会出行，parentNode 先 moves 处理，childnode 再做一次处理（替换或修改属性）
  } else if (
    newVNode.tagName === lastVNode.tagName
    // && newVNode.key === lastVNode.key
  ) {
    // newVNode.key === lastVNode.key 才会执行 diffChildren
    if (newVNode.key === lastVNode.key) {
      const propsPatches = diffProps(lastVNode.props, newVNode.props)
      if (Object.keys(propsPatches).length > 0) {
        currentPatch.push({ type: patch.PROPS, props: propsPatches })
      }

      diffChildren(
        lastVNode.children,
        newVNode.children,
        currentPatch,
        index,
        patches,
      )
    } else {
      currentPatch.push({ type: patch.REPLACE, node: newVNode })
    }

  // Nodes are not the same
  } else {
    currentPatch.push({ type: patch.REPLACE, node: newVNode })
  }

  if (currentPatch.length) {
    patches[index] = currentPatch
  }
}

function diffChildren (lastChildren, newChildren, apply, index, patches) {
  const orderedSet = reorder(lastChildren, newChildren)
  let len = lastChildren.length > newChildren.length ? lastChildren.length : newChildren.length
  for (var i = 0; i < len; i++) {
    if (!lastChildren[i]) {

      // insert node
      if (newChildren[i] && !orderedSet.moves) {
        apply.push({ type: patch.INSERT, node: newChildren[i] })
      }

    } else {
      dftWalk(lastChildren[i], newChildren[i], ++index, patches)
    }
  }
  console.error('orderedSet.moves', orderedSet.moves)
  if (orderedSet.moves) {
    apply.push(orderedSet)
  }
}

/**
 * diff vnode props
 * @param {*} lastProps
 * @param {*} newProps
 */
function diffProps (lastProps, newProps) {
  const propsPatches = {}

  // Find out diff props
  for (const key in lastProps) {
    if (newProps[key] !== lastProps[key]) {
      propsPatches[key] = newProps[key]
    }
  }


  // Find out new props
  for (const key in newProps) {
    if (!lastProps.hasOwnProperty(key)) {
      propsPatches[key] = newProps[key]
    }
  }
  return propsPatches
}

/**
 * List diff, naive left to right reordering  https://github.com/Matt-Esch/virtual-dom/blob/947ecf92b67d25bb693a0f625fa8e90c099887d5/vtree/diff.js#L222
 * @param {*} lastChildren
 * @param {*} newChildren
 *
 * 原理利用中间数组 simulate， remove得到子集、insert 插入操作完成
 * 例 oldList [1,4,6,8,9] newList [0,1,3,5,6]
 * 转换拿到中间数组按老数组索引 [1, null, 6, null, null ]
 * remove null 得到子集 [1, 6]
 * insert 插入完成
 */
function reorder(lastChildren, newChildren) {
  const lastMap = keyIndex(lastChildren)
  const lastKeys = lastMap.keys
  const lastFree = lastMap.free

  if(lastFree.length === lastChildren.length){
    return {
      moves: null
    }
  }


  const newMap = keyIndex(newChildren)
  const newKeys = newMap.keys
  const newFree = newMap.free

  if(newFree.length === newChildren.length){
    return {
      moves: null
    }
  }

  // simulate list to manipulate
  const children = []
  let freeIndex = 0

  for (let i = 0 ; i < lastChildren.length; i++) {
    const item = lastChildren[i]
    if(item.key){
      if(newKeys.hasOwnProperty('key')){
        const itemIndex = newKeys[item.key]
        children.push(newChildren[itemIndex])
      } else {
        children.push(null)
      }
    } else {
      const itemIndex = newFree[freeIndex++]
      children.push(newChildren[itemIndex] || null)
    }
  }

  const simulate = children.slice()
  const removes = []
  const inserts = []

  let j = 0

  // remove  value is null and  no key property
  while (j < simulate.length) {
    if (simulate[j] === null || !simulate[j].hasOwnProperty('key')) {
      const patch = remove(simulate, j)
      removes.push(patch)
    } else {
      j++
    }
  }

  console.error('simulate', simulate)
  for (let i = 0 ; i < newChildren.length; i++) {
    const wantedItem = newChildren[i]
    const simulateItem = simulate[i]

    if(wantedItem.key){
      if(simulateItem && wantedItem.key !== simulateItem.key){
        // key property is not equal, insert, simulateItem add placeholder
        inserts.push({
          type: patch.INSERT,
          index: i,
          node: wantedItem,
        })
        simulateItem.splice(i, 1)
      }
    } else {
      // no key property, insert, simulateItem add placeholder
      inserts.push({
        type: patch.INSERT,
        index: i,
        node: wantedItem,
      })
      simulateItem && simulateItem.splice(i, 1)
    }
  }

  return {
    type: patch.REORDER,
    moves: {
      removes: removes,
      inserts: inserts
    }
  }
}

function remove(arr, index) {
  arr.splice(index, 1)

  return {
    type: patch.REMOVE,
    index,
  }
}


/**
 * Convert list to key-item keyIndex object.
 * @param {*} children
 * convert [{id: "a", key: 'a'}, {id: "b", key: 'b'}, {id: "a"}]
 * result { keys: { a: 0, b: 1}, free: [ 2 ] }
 */
function keyIndex(children) {
  var keys = {}
  var free = []
  var length = children.length

  for (var i = 0; i < length; i++) {
      var child = children[i]

      if (child.key) {
          keys[child.key] = i
      } else {
          free.push(i)
      }
  }

  return {
      keys: keys,     // A hash of key name to index
      free: free      // An array of unkeyed item indices
  }
}

module.exports = diff
