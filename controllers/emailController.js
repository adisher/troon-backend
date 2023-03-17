const nodemailer = require('nodemailer');

const from = 'danishsadpara@gmail.com';

async function createTestAccount() {
  const testAccount = await nodemailer.createTestAccount();
  return testAccount;
}

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: from,
//     pass: 'Sadpara3.0',
//   },
// });

const mailOptions = {
  from: from,
  to: '3445royal@gmail.com, mateen@trootechnologies.com',
  subject: 'Sending Email using Node.js',
  html: '<h1>Welcome to Node JS</h1>',
};

function sendEmail(mailingOptions = mailOptions) {
  return new Promise(async (resolve, reject) => {
    const account = await createTestAccount();
    const testigTransport = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: account.user, // generated ethereal user
        pass: account.pass, // generated ethereal password
      },
    });
    testigTransport.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log('Email sent: ' + info.response);
        resolve(nodemailer.getTestMessageUrl(info));
      }
    });
  });
}

module.exports = {
  sendEmail,
};