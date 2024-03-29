function get_value(event) {
  event.preventDefault();
  const userType = document.getElementById("user-type").value
  const username = document.getElementById("username").value
  const password = document.getElementById("password").value
  if (userType == '') demo.showNotification("left", "bottom", "User type cant be empty")
  else if (username == '') demo.showNotification("left", "bottom", "Username cant be empty")
  else if (password == '') demo.showNotification("left", "bottom", "Password cant be empty")
  else {
    const loginCredentials = { userType, username, password }
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginCredentials)
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.error){
          demo.showNotification("left", "bottom", "Invalid Credentials")
        }
        else if(userType == 1)
        {
          window.location.href = '/driver-dashboard'
        }
        else if(userType == 2)
        {
          window.location.href = '/passenger-dashboard'
        }
        else 
        {
          window.location.href = '/analytics'
        }
      })
  }

}
