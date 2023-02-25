function get_signupvalue(event) {
    event.preventDefault();
    const fullname = document.getElementById("fullname").value
    const username = document.getElementById("username").value
    const phone = document.getElementById("phone").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
   
    if (fullname == '') demo.showNotification("left", "bottom", "Fullname cant be empty")
    else if(username == '') demo.showNotification("left", "bottom", "Username cant be empty")
    else if (password == '') demo.showNotification("left", "bottom", "Password cant be empty")
    else if (email == '') demo.showNotification("left", "bottom", "Email cant be empty")
    else if (phone == '') demo.showNotification("left", "bottom", "Phone cant be empty")
    else {
      const signupCredentials = {email,  fullname, username, password, phone }
      fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupCredentials)
      })
        .then((response) => response.json())
        .then((response) => {
          console.log(response)
        })
    }
  
  }
  