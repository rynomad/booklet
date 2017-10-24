
const bk = {
  type : 'booklet',
  title : "Basic",
  items : [
    {
      title : 'section 1',
      type : 'section',
      items : [
        {
          title : "page 1",
          type : 'page',
          items : [
            {
              type : "text",
              value : "here's some text"
            },
            {
              type : "text",
              value : "here's some more text"
            },
          ]
        },
        {
          title : "page 2",
          type : "page",
          items : [
            {
              type : 'text_input',
              prompt : 'write some stuff',
              placeholder : 'here...'
            },
            {
              type : 'text',
              value : 'good job'
            }
          ]
        }
      ]
    }
  ]
}

export default bk