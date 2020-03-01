'use strict'

// 系统函数库
// const user = require.main.require('./user')
// const db = require.main.require('../src/database')
// const meta = require.main.require('./meta')
// const utils = require.main.require('../public/src/utils')

// 常用模块
/* const async = require.main.require("async"); */
// const nconf = require.main.require('nconf')
// const winston = require.main.require('winston')
// const path = require.main.require('path')

/* const { Controllers } = require("./controllers");
 */
const Core = {}
const axios = require('axios')

let app
let today
var interval

Core.getSentence = async function () {
  var res = await axios.get('https://api.ooopn.com/ciba/api.php?type=json')
  today = res.data
}

Core.init = async params => {
  Core.getSentence()
  app = params.app
}

Core.renderSentenceWidget = async function (widget) {
  if (!interval) {
    interval = setInterval(
      Core.getSentence,
      widget.data.interval ? widget.data.interval : 60 * 1000 * 60
    )
  }
  widget.html = await app.renderAsync('widgets/sentence', {
    en: today['ciba-en'],
    cn: today.ciba
  })
  return widget
}

Core.defineWidgets = async function (widgets) {
  const widgetData = [
    {
      widget: 'sentence',
      name: 'Sentence Everyday',
      description: 'show a sentence',
      content: 'admin/sentence'
    }
  ]
  await Promise.all(
    widgetData.map(async function (widget) {
      widget.content = await app.renderAsync(widget.content, {})
    })
  )
  widgets = widgets.concat(widgetData)
  return widgets
}
module.exports = Core
module.exports.Core = Core
