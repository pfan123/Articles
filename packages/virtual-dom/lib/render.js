function render (vNode) {
  const element = document.createElement(vNode.tagName)
  const props = vNode.props

  for (const key in props) {
    const value = props[key]
    node.setAttribute(key, value)
  }

  vNode.children && vNode.children( child => {
    const childElement = typeof child === 'string' ? document.createTextNode(child) : render(child)
    element.appendChild(childElement)
  })

  return element
}
