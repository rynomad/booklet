
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
              title : "s1 page 1",
              editable : true,
              value : "here's some text"
            },
            {
              type : "factory",
              title : 'name your goal',
              value : 'some text'
            },
          ]
        },
        {
          title : "page 2",
          type : "page",
          items : [
            {
              type : 'text',
              title : "s1 page 2",
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
          type : 'sorter',
          items : [
            {
              type : "text",
              title : 's2 p3',
              value : "here's some text"
            },
            {
              type : "text",
              value : "here's some more text"
            },
            {
              type : "text",
              title : 's2 p3',
              value : "here's some text"
            },
            {
              type : "text",
              value : "here's some more text"
            },
            {
              type : "text",
              title : 's2 p3',
              value : "here's some text"
            },
            {
              type : "text",
              value : "here's some more text"
            }
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
                  title : "s2s3 page 4",
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
                  title : 's2s3 page 5',
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
              title : 's2s3 page 6',
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