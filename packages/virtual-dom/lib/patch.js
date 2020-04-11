const patch = require('./vpatch.js')

/**
 * 真实的 Dom 打补钉
 * @param {*} rootNode 实际的 DOM
 * @param {*} patches
 */
function patch (rootNode, patches) {
  const walker = { index: 0 }
  dftWalk(rootNode, walker, patches)
}

/**
 * 深入优先遍历算法 (depth-first traversal，DFT)
 * @param {*} node
 * @param {*} walker
 * @param {*} patches
 */
function dftWalk (node, walker, patches) {
  const currentPatches = patches[walker.index]
  node.childNodes && node.childNodes.forEach(child => {
    walker.index++
    dftWalk(child, walker, patches)
  })
  if (currentPatches) {
    applyPatches(node, currentPatches)
  }
}


function applyPatches (node, currentPatches) {
  currentPatches.forEach(currentPatch => {
    switch (currentPatch.type) {
      case patch.REMOVE:
        node.parentNode.removeChild(node)
        break
      case patch.REPLACE:
        const newNode = currentPatch.node
        node.parentNode.replaceChild(newNode, node)
        break
      case patch.TEXT:
        node.textContent = currentPatch.text
        break
      case patch.PROPS:
        const props = currentPatch.props
        setProps(node, props)
        break
      case patch.INSERT:
        // parentNode.insertBefore(newNode, referenceNode)
        const newNode = currentPatch.node
        node.appendChild(newNode)
        break
    }
  })

}

/**
 * 设置真实 Dom 属性值
 * @param {*} node
 * @param {*} props
 */
function setProps (node, props) {
  for (const key in props) {
    // void 666 is undefined
    if (props[key] === void 666) {
      node.removeAttribute(key)
    } else {
      const value = props[key]
      node.setAttribute(key, value)
    }
  }
}
