const createElement = require('./lib/createElement')
const diff = require('./lib/diff')

const lastNode = createElement('div', {className: 'one'},
  createElement('li', {className: 'kk'},
    createElement('span', {className: 'txt'}, 'kkk'),
    createElement('li', {className: 'zz'}, 'kkk')
  ),
  createElement('li', {className: 'one'}, 'one')
)

const newNode = createElement('div', {className: 'zz', height: '20px'},
  createElement('li', {className: 'kk'},
    createElement('span', {className: 'teext'}, '哈咯'),
    createElement('li', {className: 'zz'}, '大家好'),
    createElement('li', {className: 'ooo'}, '插入节点')
  ),
  createElement('li', {className: 'one'}, 'one')
)

console.error('newNode', newNode)

const patchs = diff(lastNode, newNode)

console.error(JSON.stringify(patchs, null, 2))
