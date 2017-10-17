export default {
  _store : {
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
}