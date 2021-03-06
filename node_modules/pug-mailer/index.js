
'use strict'

const nodemailer = require('nodemailer')
const pug = require('pug')
const path = require('path')

let settings = null
let transporter = null

/**
 * Automatically set Mailtrap host and port.
 *
 * @return {Void}
 */

let registerMailtrapService = () => {
  if (settings.service === 'Mailtrap') {
    delete settings.service
    settings.host = settings.host || 'smtp.mailtrap.io'
    settings.port = settings.port || 25
  }
}

/**
 * Send an email.
 *
 * @param {Object} options
 *
 * @return {Void}
 */

let sendMail = options => new Promise((resolve, reject) => {
  if (!transporter) return reject(new Error('Mail transporter not created.'))
  transporter.sendMail(options, (err, message) => {
    if (err) return reject(err)
    resolve(message)
  })
})

/**
 * Initiate the module.
 *
 * @param  {Object} config
 *
 * @return {Object}
 */

exports.init = config => {
  if (typeof config === 'object') {
    settings = config
    registerMailtrapService()
    transporter = nodemailer.createTransport(settings)
  } else {
    settings = null
    transporter = null
  }
}

/**
 * Send an email.
 *
 * @param  {Object} options
 *
 * @return {Void}
 */

exports.send = options => new Promise((resolve, reject) => {
  let data = options.data || {}
  let template = options.template

  delete options.data
  delete options.temlpate

  if (!template) {
    sendMail(options).then(resolve).catch(reject)
  } else {
    process.nextTick(() => {
      let file
      if (template.charAt(0) === '/') {
        file = template
      } else {
        file = path.join(process.cwd(), 'mails', 'templates', template + '.pug')
      }
      pug.renderFile(file, data, (err, html) => {
        if (err) return reject(err)
        options.html = html
        sendMail(options).then(resolve).catch(reject)
      })
    })
  }
})
