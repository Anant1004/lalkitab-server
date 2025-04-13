import sgMail from '@sendgrid/mail';

export const sendMail = (data: any) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: '<' + data.email +'>',
    from: '<priyansh@support305.com>',
    subject: 'Login Credentials for Standard English Public School',
    text: `Dear ${data.fullName},\n\nYour login credentials for Standard English Public School are as follows:\n\nUsername: ${data.email}\nPassword: ${data.password}\n\nPlease use these credentials to log in to your account.\n\nBest regards,\nThe Standard English Public School Team`,
  };
  sgMail.send(msg);
};
