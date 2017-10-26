import {types, isRoot, isStateTreeNode, walk, getPath, getSnapshot} from 'mobx-state-tree'
import {GetDefinition, AnyMap} from '../Stores.js'

const booklet = {
  name : 'booklet',
  props : {
    type : types.literal('booklet'),
    menu : '#menu',
    viewport : '#viewport',
    nodes : types.optional(AnyMap, {})
  },
  actions : self => ({
    addNode(node, parentId){
      if (!isRoot(self)) throw new Error(`nodes must be added to root only (cwd : ${getPath(self)}):\n${getSnapshot(node)}`);
      if (isStateTreeNode(node)) node = getSnapshot(node)
      self.nodes.set(node.id, node)
    },
    _afterCreate(node){
      if (node === self) console.log("SELF")
      if (node.attachToChildren) node.attachToChildren()
      if (node.replaceChildrenWithReferences) node.replaceChildrenWithReferences()
      if (node._attachToChildren) node._attachToChildren()
      if (node._replaceChildrenWithReferences) node._replaceChildrenWithReferences()
    },
    afterCreate(){
      if (!self.menu) self.menu = {type : 'menu'}
      if (!self.viewport) self.viewport  = {type : 'viewport'}
      walk(self, self._afterCreate)
    }

  }),
  mixins : ['_collection', '_menuItem']
}

export {booklet}