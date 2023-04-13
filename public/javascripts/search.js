function get_search(event) {
    event.preventDefault();
    alert("hello")
    const from = document.getElementById("from-location").value
    const to = document.getElementById("to-location").value
    if (from == '') demo.showNotification("left", "bottom", "From location cant be empty")
    else if (to == '') demo.showNotification("left", "bottom", "To location cant be empty")
    else {
      const search = { from, to }
     fetch('/passenger-dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(search)
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.error){
            demo.showNotification("left", "bottom", "Invalid Credentials")
          }
          else{
            window.location.href = '/route-selection'
          }
        })
    }
  
  }