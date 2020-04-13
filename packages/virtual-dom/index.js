const createElement = require('./lib/createElement')
const diff = require('./lib/diff')

const lastNode = createElement('div', {className: 'one'},
  createElement('li', {className: 'kk', key: 'test'},
    createElement('li', {className: 'txt'}, 'kkk'),
    createElement('li', {className: 'zz', key: '1'}, 'kkk')
  ),
  createElement('li', {className: 'one'}, 'one')
)

const newNode = createElement('div', {className: 'zz', height: '20px'},
  createElement('li', {className: 'kk', key: 'test'},
    createElement('li', {className: 'teext', key: '1'}, '哈咯'),
    createElement('li', {className: 'zz', key: '2'}, '大家好'),
    createElement('li', {className: 'ooo'}, '插入节点')
  ),
  createElement('li', {className: 'one'}, 'one')
)

const patchs = diff(lastNode, newNode)

console.error(JSON.stringify(patchs, null, 2))
