import {createBooklet} from '../../../stores/booklet'

const bk = createBooklet({
    id : 'testbooklet',
    title : "Basic",
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
              "some text"
            ]
          },
          {
            type : "section",
            children : [
              {
                type : 'essay',
                cues : [
                  "write some stuff"
                ]
              },
              {
                type : 'static_page',
                text : [
                  "yoyoyoyoyoy"
                ]
              }
            ]
          }
          
        ]
      }
    ]
  })
console.log(bk.toJSON())
export default {
  _store : bk.toJSON()
}