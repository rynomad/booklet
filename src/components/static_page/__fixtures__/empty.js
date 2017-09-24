import static_page from './../../../stores/static_page/'
const page = static_page.create({type : 'static_page', text : []})
console.log(page)
const fixture = {
  props : {
    static_page : page.toJSON()
  }
}

export default fixture