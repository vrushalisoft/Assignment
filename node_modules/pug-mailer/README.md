
# Pug Mailer

Send HTML emails with SMTP & Mailgun using [PugJS](https://pugjs.org/)
template files.

## Installation

Using npm:

```bash
$ npm install pug-mailer --save
```

Using yarn:

```bash
$ yarn add pug-mailer
```

## Usage

```js
// Load the module.
const mailer = require('pug-mailer')

// Initiate the module and create transporter.
// Note: `pug-mailer` is based on `nodemailer` module,
//       for more details about transporters and configuration
//       please visit: https://nodemailer.com/
mailer.init({
  /* transporter SMTP options */
})

// Send an email.
// Note: `pug-mailer` is based on `nodemailer` module,
//       for more details about messages options
//       please visit: https://nodemailer.com/
mailer.send({
  /* mail options */
})
```

## Examples

Using [Mailtrap](https://mailtrap.io/):

```js
const mailer = require('pug-mailer')

mailer.init({
  service: 'Mailtrap',
  auth: {
    user: 'MAILTRAP_SMTP_USERNAME',
    pass: 'MAILTRAP_SMTP_PASSWORD'
  }
})

mailer.send({
  from: 'foo@example.com',
  to: 'bar@example.com',
  subject: 'Foo Bar',

  // Name of the PugJS template file.
  // PugJS template files should be located at: process.cwd() + '/mails/templates/'
  template: 'foo' // The `.pug` extension is appended automatically.

  // You may also pass the full path to the PugJS template file.
  template: '/full/path/to/foo.pug' // The `.pug` extension is required here.

  // Data to be sent to PugJS template files.
  data: {
    //
  }
})
.then(response => console.log('Message sent!'))
.catch(err => console.log('Something went wrong!'))
```

Using [Mailgun](https://www.mailgun.com/):

```js
const mailer = require('pug-mailer')

mailer.init({
  service: 'Mailgun',
  auth: {
    user: 'MAILGUN_SMTP_USERNAME',
    pass: 'MAILGUN_SMTP_PASSWORD'
  }
})

mailer.send({
  from: 'foo@example.com',
  to: 'bar@example.com',
  subject: 'Foo Bar',
  template: 'foo',
  data: {
    foo: 'bar'
  }
})
.then(response => console.log('Message sent!'))
.catch(err => console.log('Something went wrong!'))
```

## Template Files

You should be already familiar with [PugJS](https://pugjs.org/)
previously known as *Jade*, but if not, read their awesome documentation.
PugJS template files are *the best* and *the fastest* way to write HTML code.

`pug-mailer` compiles the PugJS template files with given `data` and then sends
emails using the defined `nodemailer` transporter.

Template files should be locaded at: `process.cwd() + '/mails/templates/'`
by default, but you may also pass full paths to template files and they
will be loaded from your path.

## License

The MIT License (MIT)

Copyright (c) 2017 Ion Suman <sumanion122@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
