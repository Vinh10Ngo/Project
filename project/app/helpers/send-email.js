
const nodemailer = require('nodemailer');

function sendEmail(customer, emailInfo) {
  const mailOptions = {
    from: emailInfo.send_email.email,
    to: customer.email,
    subject: `Thân gửi bạn ${customer.name}`,
    text: `Website đã nhận được thông tin liên hệ của bạn với tên của bạn là ${customer.name}, số điện thoại là ${customer.phone}, website là ${customer.website} và nội dung là ${customer.message}. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.`,
    html: `<p>Website đã nhận được thông tin liên hệ của bạn với tên của bạn là ${customer.name}, số điện thoại là ${customer.phone}, website là ${customer.website} và nội dung là ${customer.message}. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.</p>`,
    bcc: [emailInfo.send_email.BCC]
 
  };

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailInfo.send_email.email,
      pass: emailInfo.send_email.password
    }
  });

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        reject(error); // Reject Promise if there's an error
      } else {
        console.log(info);
        resolve(info.response); // Resolve Promise with response
      }
    });
  });
}

module.exports = {
  sendEmail,
}
