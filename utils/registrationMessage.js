getRegistrationMessage = (email) => {
    const msgBody = 'Thank you for registering with Quotely.'
    const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL, 
        subject: 'Quotely Registration',
        text: msgBody,
        html: `<strong>${msgBody}</strong>`,
        }
    return msg;
}

module.exports = getRegistrationMessage;