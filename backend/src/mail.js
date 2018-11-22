const nodeMailer = require('nodemailer');

// A transport is a way of sending email. Can have multiple transports and can hook up
// to gmail account of a SMTP server.
const transport = nodeMailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  }
});

const makeANiceEmail = text => `
  <div className="email" style="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;
  ">
    <h2>Hello there!</h2>
    <p>${text}</p>

    <p>Cheers, Jock</p>
  </div>
`

exports.transport = transport;
exports.makeANiceEmail = makeANiceEmail;