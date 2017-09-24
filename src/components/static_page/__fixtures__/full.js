import static_page from './../../../stores/static_page/'
const page = static_page.create({type : 'static_page', text : [
  "this is some sample text",
  "it's so... textual",
  "woooooooooooooo"
]})

const fixture = {
  props : {
    static_page : page.toJSON()
  }
}

export default fixture