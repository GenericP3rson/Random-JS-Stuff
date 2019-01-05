var n = require("nodemailer");

var t = n.createTransport({
    service: "gmail",
    auth: {
        user: "schaudhary@keystoneschool.org",
        pass: "SuperKeystone"
    }
})

var mo = {
    from: "The Talented Tape Master <schaudhary@keystoneschool.org>",
    to: "Captain Cross <schaudhary@keystoneschool.org>",
    subject: "Captain!",
    html: "Dear Ms. Cross,<br>I'm using nodemailer now. Are you okay?<br>Sincerely,<br>Shreya,<br>The Talented Tape Master."
}

for (var i = 0; i < 100; i++) {
t.sendMail(mo, function (err, info) {
    if (err) {
        console.log(err);
    } else {
        console.log("Email sent:: " + info.response)
    }
})
}