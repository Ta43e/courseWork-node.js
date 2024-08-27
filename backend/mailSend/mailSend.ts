import * as nodemailer from 'nodemailer';
import { config } from 'dotenv';
config();

export class MailService {
  private sender: string | undefined= process.env.SENDER;
  private pass: string | undefined = process.env.PASS_MAIL;

  async sendMail(message: string, rec?: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: 'smtp.yandex.ru',
      port: 465,
      secure: true,
      auth: {
        user: this.sender,
        pass: this.pass,
      },
    });
    const mailOption: nodemailer.SendMailOptions = {
      from: this.sender,
      to: rec,
      subject: '...OLOLOLOLO...',
      text: message,
      html: `<i>${message}</i>`,
    };

    transporter.sendMail(mailOption, (error: Error | null) => {
      if (error) {
        console.error('Error occurred while sending email:', error);
      } else {
        console.log('Email sent successfully');
      }
    });
  }
}
