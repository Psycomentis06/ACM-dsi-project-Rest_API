var mailer = require('../mailer');

mailer.sendMail({
    from: '<cojes49808@ffeast.com>', // sender address
    to: "tesene6460@ffeast.com", // list of receivers
    subject: "Hello ✔", // Subject line
    template: "email_verification",
    context: {
        name: "Amor ali",
        vkey: "5646456",
        mail: "test@mail.com"
    }
}).then(response => {
    console.log(response);
}).catch(err => {
    console.log(err);
})