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

  // same node
  } else if (
    newVNode.tagName === lastVNode.tagName &&
    newVNode.key === lastVNode.key
  ) {
    const propsPatches = diffProps(lastVNode.props, newVNode.props)
    if (Object.keys(propsPatches).length > 0) {
      currentPatch.push({ type: patch.PROPS, props: propsPatches })
    }

    diffChildren(
      lastVNode.children,
      newVNode.children,
      index,
      patches,
    )

  // Nodes are not the same
  } else {
    currentPatch.push({ type: patch.REPLACE, node: newNode })
  }

  if (currentPatch.length) {
    patches[index] = currentPatch
  }
}

function diffChildren (lastChildren, newChildren, index, patches) {
  let len = lastChildren.length > newChildren.length ? lastChildren.length : newChildren.length
  for (var i = 0; i < len; i++) {
    if (!lastChildren[i]) {

      // insert node
      if (newChildren[i]) {
        patches[++index].push({ type: patch.INSERT, node: newChildren[i] })
      }

    } else {
      dftWalk(lastChildren[i], newChildren[i], ++index, patches)
    }
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

module.exports = diff
