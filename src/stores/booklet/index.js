import {types, getParent} from 'mobx-state-tree'

const any = types.late(() => types.union(booklet, section, static_page, essay, factory))
const _any = types.union((id) => {
  if (!id) return types.undefined;  
  let parts = id.split(':');
  let last = parts.pop()
  let type = last.split('-')[0]
  switch(type){
    case 'factory': return _factory;
    case 'booklet': return _booklet;
    case 'section': return _section;
    case 'static_page' : return _static_page;
    case 'essay' : return _essay;
    default:
    throw new Error(`type ${type} not in reference dispatcher`)
  }
})

const ids = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1)

const id = types.optional(types.identifier(types.string), () => ids())

const title = types.maybe(types.string)

const _section = types.late(() => types.maybe(types.reference(section)))
const _booklet = types.maybe(types.late(() => types.reference(booklet)))

const node = types.model('node',{
  id,
  _section,
  _booklet,
  title
}).actions(self => ({
  onMenuSelect(){
    self._booklet.onMenuSelect(self.id)
  }
})).views(self => ({
  get depth(){
    if (self === self._booklet) return 1
    let depth = 2;
    let next = self._section;
    while (next && next !== self){
      depth++
      next = next._section
    }
    console.log(self.id,"depth", depth)
    return depth
  },
  get menuIconStyle(){
    return ({ width : `${self.depth}em`, paddingLeft : `${(self.depth - 1)}em` });
  },
  get menuIcon(){
    return 'md-circle'
  },
  get menuBackground(){
    if (self.isSelected){
      console.log(self.id, "grey")
      return "#CCC"
    }
    console.log(self.id,"white")
    return "white"
  },
  get currentSelected(){
    return self._booklet.menuSelected
  },
  get siblingIndex(){
    if (!self._section) return -1;
    return self._section.children.indexOf(self);
  },
  get isRoot(){
    return !self._section
  },
  get isSelected(){
    return self.currentSelected === self
  },
  get isAncestorOfSelected(){
    let next = self.currentSelected._section;
    while (next){
      if (next === self) return true
      next = next._section
    }
    return false;
  },
  get isChildOfSelected(){
    console.log(self.id, self.currentSelected, self.currentSelected._section === self)
    return (self.currentSelected === self._section)
  },
  get isYoungerSiblingOfSelected(){
    let currentSelected = self.currentSelected
    let selectedParent = currentSelected._section

    return self._section === selectedParent && self.siblingIndex >= currentSelected.siblingIndex 
  },
  get menuIsOpen(){
    return self.isRoot || self.isSelected || self.isAncestorOfSelected || self.isChildOfSelected || self.isYoungerSiblingOfSelected
  }
}))

const type = types.literal('section')

const children = types.optional(types.array(_any), [])

const section = node.named('section').props({
  type,
  children
}).views(self => ({
  get menuIcon(){
    if (self.isSelected || self.isAncestorOfSelected){
      return 'md-chevron-down'
    } else {
      return 'md-chevron-right'
    }
  },

  get lineage(){
    return [self].concat(self.children.reduce(this.childReducer, []))
  },

  get posterity(){
    return self.lineage.filter(node => !node.lineage)
  },

  childReducer(items, node){
    if (node.lineage){
      return items.concat(node.lineage);
    } else {
      return items.concat([node]);
    }
  }
})).actions((self) => ({
  createChild(obj, offset){
    offset = offset ? offset < 0 ? (self.children.length + offset - 1) : offset : self.children.length
    let node = {
      id : `${self.id}:${obj.type}-${ids()}`,
      type : obj.type,
      title : obj.title,
      _booklet : self._booklet.id,
      _section : self.id !== self._booklet.id ? self.id : null
    }
    if (obj.type !== 'section'){
      Object.assign(node, obj);
    }
    console.log(node)
    node = self._booklet.addNode(node);
    //console.log("add to children", node.type)
    self.children.splice(offset, 0, node.id);
    return node
  },
  fromScaffold(node, parent){
    parent = parent || self._booklet
    let {type, title, children} = node
    
    if (type === `section`){
      console.log("create?", title)
      node = self._booklet.createChild({
        type,
        title
      })
      children.forEach((next) => processNode(next, node))
    } else {
      parent.createChild(node)
    }
  }
}))


const nodes = types.array(any)

const booklet = section.named('booklet').props({
  type : types.literal('booklet'),
  _menuSelected : _any,
  _menuOpen : false,
  nodes
}).views(self => ({
  get menuSelected(){
    return self._menuSelected || self
  },
  get viewPage(){
    let index = self.lineage.indexOf(self.menuSelected);
    while(self.lineage[index].lineage) index++
    return self.lineage[index]
  },
  get viewIndex(){
    return self.posterity.indexOf(self.viewPage)
  }
})).actions(self => ({
  addNode(obj){
    self.nodes.push(obj)
    return self.nodes[self.nodes.length - 1]
  },
  onMenuSelect(id){
    self._menuSelected = id;
  },
  onViewOverscroll(){

  },
  onViewPostChange(evt){
    let id = self.posterity[evt.activeIndex].id
    self.onMenuSelect(id)
  },
  showMenu(){
    self._menuOpen = true;
  },
  hideMenu(){
    self._menuOpen = false;
  }
}))

const processNode = (node, parent) => {
  let {type, title, children} = node
  
  if (type === `section`){
    console.log("create?", title)
    node = parent.createChild({
      type,
      title
    })
    children.forEach((next) => processNode(next, node))
  } else {
    parent.createChild(node)
  }
} 

const createBooklet = ({id, title, type, children}) => {
  let _booklet = booklet.create({ id, type, _menuSelected : id, title, nodes : [], _booklet : id })
  children.forEach(_booklet.fromScaffold)
  console.log(_booklet.lineage)
  return _booklet
}

const value = '';
const placeholder = 'Start writing...';
const _essay = types.late(() => types.reference(essay))

const note = node.named('note').props({
  value,
  placeholder
}).views(self => ({
  get _essay(){
    return getParent(self, 2)
  },
  get isEditing(){
    console.log("isEditing")
    return (self._essay.editing === self.id)
  },
  get isOpen(){
    let essay = self._essay
    let editing = essay.editing;

    return (!editing || editing === self)
  }
})).actions(self => ({
  afterCreate(){
    console.log("note created", self.isOpen);
  },
  onEdit(){
    console.log("onEdit")
    self._essay.onEdit(self)
  },
  onChange(value){
    self.value = value
  },
  onConfirm(){
    console.log("onConfirm")
    self._essay.onEdit(null)
    self._essay.maybeCreateNote()
  }
}))

const static_page = node.named('static_page').props({
  type : types.literal('static_page'),
  text : types.optional(types.array(types.string), [])
})

const _static_page = types.reference(static_page)

const notes = types.optional(types.array(note), []);

const prompt = types.optional(types.string, '')

const cues = types.optional(types.array(types.string), [])

const editing = types.maybe(types.reference(note))

const essay = node.named('essay').props({
  type : types.literal('essay'),
  prompt,
  notes,
  cues,
  editing
}).views(self => ({
  get fresh_cues(){
    if (!self.notes.length) return self.cues;
    
    let cues = self.cues.filter(cue => self.notes.map(({placeholder}) => placeholder).indexOf(cue) === -1)
    if (!cues.length) return self.cues;
    return cues;
  },
  get placeholder(){
    return self.fresh_cues[self.notes.length % self.fresh_cues.length];
  }
})).actions(self => ({
  afterCreate(){
    console.log("afterCreate(")
    self.maybeCreateNote()
  },

  createNote(){
    self.notes = self.notes.concat([{
      placeholder : self.placeholder
    }])
  },

  deleteNote(note){
    let index = self.notes.indexOf(note);
    self.notes = self.notes.slice(0, index).concat(self.notes.slice(index + 1))
  },

  onEdit(id){
    self.editing = id;
  },

  maybeCreateNote(){
    if (self.notes.filter(note => !note.value).length === 0){
      console.log("create")
      self.createNote();
    }
  },

  onConfirm(note){
    self.editing = null;

    if (!note.value) {
      self.deleteNote(note);
    }

    self.maybeCreateNote();
  }
}))

const title_note = note.named('title_note')
.views(self => ({
  get _essay(){return {}}
}))
.actions(self => ({
  onEdit(){},
  onConfirm(){}
}))

const factory = node.named('factory').props({
  type : types.literal('factory'),
  prompt,
  title_note,
  template : essay,
  appendix_template : section
}).actions(self => ({
  createEssay(){
    console.log(self)
    let essay = self._section.createChild({
      type : 'essay',
      title : self.title_note.value,
      cues : JSON.parse(JSON.stringify(self.template.cues)),
      prompt : self.template.prompt + ''
    }, -1)
    console.log(self.appendix_template);
    self._section._section.children[self._section._section.children.length - 1].fromScaffold(Object.assign({
      ref : essay.id,
    }, self.appendix_template))

  }
}))

const _factory = types.reference(factory)

export {node, any, _any, booklet, _booklet, section, _section, createBooklet, factory}