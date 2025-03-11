import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import fs from 'fs';
import path from 'path';

async function globalTeardown() {
  console.log('Starting global teardown...');
  // const reportDirectory = 'playwright-report';
  // const reportFile = 'index.html';
  // const reportPath = path.resolve(process.cwd(), reportDirectory, reportFile);

  // console.log('Report Path:', reportPath);

  // if (!fs.existsSync(reportPath)) {
  //   console.error('Test report not found. Ensure the report is generated before sending.');
  //   return;
  // }
  const transporter = nodemailer.createTransport(
    smtpTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
        user: 'edplusqareports@gmail.com',
        pass: 'cznknqeasxshqepq',
      },
    })
  );

  const mailOptions = {
    from: 'edplusqareports@gmail.com',
    to: 'dyadav22@asu.edu',//, /,dbanala@asu.edu  dummy-testing-aaaalctipo4bizw65k5qbzupxq@asu.org.slack.com',
    subject: 'ASUOnline Automation Test Report',
    text: 'PFA',
    attachments: [
      {
        filename: 'ASUOnlineReport.html',
        path: './playwright-report/index.html',
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Mail sent: ' + info.response);
  } catch (error) {
    console.error('Error while sending email:', error);
  }
  console.log('Global teardown completed.');
}

console.log('Exporting globalTeardown function...');
export default globalTeardown;
