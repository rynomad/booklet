import {types, getParent} from 'mobx-state-tree'

import {node, section} from '../booklet'
import {essay, note} from '../essay'
import {static_page} from '../static_page'

const essay_title = note.named('essay_title')
const essay_template = essay.named('essay_template')
const any = types.late(() => types.union(essay, static_page, essay_appendix_template))
const children = types.maybe(types.array(any),[])
const ref = types.reference(essay)
const appendices = section.named('appendix')


const essay_appendix_template = section.named('essay_appendix').props({
  children
})

const factory = node.named('factory').props({
  essay_title,
  essay_template,
  essay_appendix_template
}).actions(self => ({
  createEssay(){
    let essay = self._section.createChild({
      type : 'essay',
      title : self.essay_title.value,
      cues : self.essay_template.cues,
      prompt : self.essay_template.prompt
    })
    self._section._section.children[self._section._section.children.length - 1].fromScaffold(Object.assign({
      ref : essay.id,
    }, self.essay_appendix_template))
  }
}))