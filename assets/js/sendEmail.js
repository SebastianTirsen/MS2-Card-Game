function sendMail(contactForm) {
    emailjs.send("service_3521s25", "template_lrqwhtq", {
        "from_name": contactForm.name.value,
        "from_email": contactForm.emailaddress.value,
        "question": contactForm.yourquestion.value,
    })
    .then(
        function(response) {
            document.getElementById('signup').reset();
        },
        function(error) {
        },
    );
    return false;
}

function change() {
    document.getElementById("send-button").innerHTML = "MESSAGE SENT!!!!";
}