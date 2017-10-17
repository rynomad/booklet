import {createBooklet} from '../../stores/booklet'

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
    },
    {
      title : "Essay Generator",
      type : 'section',
      children : [
        {
          type : "section",
          children : [
            {
              type : `factory`,
              prompt : 'Create an essay and appendix here',
              title_note : {
                value : '',
                placeholder : `what are you creating?`
              },
              template : {
                prompt : "Template prompt",
                type : 'essay',
                cues : [
                  "template cue 1",
                  "template cue 2",
                  "template cue 3"
                ]
              },
              appendix_template : {
                type : 'section',
                children : []
              }
            }
          ]
        },
        {
          type : 'static_page',
          text : [
            "filler"
          ]
        },
        {
          type : 'section',
          children : [

          ]
        }
      ]
    }
  ]
})

export default bk.toJSON()