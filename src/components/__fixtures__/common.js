
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
              type : 'text',
              header : 'write some stuff',
              value : 'ere...'
            },
            {
              type : 'text',
              value : 'good job'
            }
          ]
        }
      ]
    },
    {
      title : 'section 2',
      type : 'section',
      items : [
        {
          title : "page 3",
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
          title : 'section 3',
          type : 'section',
          items : [
            {
              title : "page 4",
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
              title : "page 5",
              type : "page",
              items : [
                {
                  type : 'text',
                  header : 'write some stuff',
                  value : 'ere...'
                },
                {
                  type : 'text',
                  value : 'good job'
                }
              ]
            }
          ]
        },
        {
          title : "page 6",
          type : "page",
          items : [
            {
              type : 'text',
              header : 'write some stuff',
              value : ''
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