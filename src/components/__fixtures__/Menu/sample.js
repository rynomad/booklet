import {createBooklet} from '../../../stores/booklet'

const bk = createBooklet({
    id : 'testbooklet',
    title : "Basic",
    root : { 
      type : 'section',
      children : [
        {
          title : "Introduction",
          type : 'section',
          children : [
            {
              type : "static_page",
              text : [
                "some text"
              ]
            },
            {
              type : "static_page",
              text : [
                "Brainstorm. Write whatever comes to mind.",
              ]
            }
          ]
        }
      ]
    }
  })
console.log(bk.toJSON())
export default {
  _store : bk.toJSON()
}