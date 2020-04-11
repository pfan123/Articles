// https://github.com/Matt-Esch/virtual-dom/blob/master/vnode/vpatch.js

const vpatch = {}
vpatch.REMOVE = 0
vpatch.REPLACE = 1  // node replace
vpatch.TEXT = 2  // text replace
vpatch.PROPS = 3
vpatch.INSERT = 4

// ReactMultiChildUpdateTypes.INSERT_MARKUP
// ReactMultiChildUpdateTypes.MOVE_EXISTING
// ReactMultiChildUpdateTypes.SET_MARKUP
// ReactMultiChildUpdateTypes.TEXT_CONTENT
// ReactMultiChildUpdateTypes.REMOVE_NODE

module.exports = vpatch
