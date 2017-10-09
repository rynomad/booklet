import {createBooklet} from '../../../stores/booklet'

const bk = createBooklet({
    type : 'booklet',
    id : 'booklet',
    title : "Basic",
    children : [
      {
        title : "Introduction",
        type : 'section',
        children : [
          {
            title : "static 1",
            type : "static_page",
            text : [
              "some text"
            ]
          },
          {
            title : "static 2",
            type : "static_page",
            text : [
              "some text"
            ]
          },
          {
            title : "sub 1",
            type : "section",
            children : [
              {
                title : "essay 1",
                type : 'essay',
                cues : [
                  "write some stuff"
                ]
              },
              {
                title : "static 3",
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