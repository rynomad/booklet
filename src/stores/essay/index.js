import {types} from 'mobx-state-tree'

import {node} from '../node'

const value = '';
const placeholder = 'Start writing...';
const _essay = types.late(() => types.reference(essay))

const note = node.named('note').props({
  _essay,
  value,
  placeholder
}).views(self => ({
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
      _essay : self.id,
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

export {note, essay, _essay}