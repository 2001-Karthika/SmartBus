function get_value(){
  const userType= document.getElementById("user-type").value
  const username= document.getElementById("username").value
  const password= document.getElementById("password").value
  console.log(userType, username, password)
  alert("hello")
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
})
.then((response) => response.json())
.then((response)=>{
  console.log(response)
  alert("hello world")
})

}
