// virtual-dom
function createElement(tagName, props = {}, ...children) {
  let vnode = {}
  if(props.hasOwnProperty('key')){
    vnode.key = props.key
    delete props.key
  }
  return Object.assign(vnode, {
    tagName,
    props,
    children,
  })
}

function addElement () {
  // 创建一个新的 div 元素
  let newDiv = document.createElement("div");
  // 给它一些内容
  let newContent = document.createTextNode("Hi there and greetings!");
  // 添加文本节点 到这个新的 div 元素
  newDiv.appendChild(newContent);

  // 将这个新的元素和它的文本添加到 DOM 中
  let currentDiv = document.getElementById("div1");
  document.body.insertBefore(newDiv, currentDiv);
  let lastContent = document.createTextNode("Hi there and greetings!");
  // 添加文本节点 到这个新的 div 元素
  newDiv.appendChild(lastContent);
}

module.exports = createElement
