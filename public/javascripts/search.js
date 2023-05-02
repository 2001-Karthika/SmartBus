function get_search(event) {
  event.preventDefault();
  const from = document.getElementById("from-location").value
  const to = document.getElementById("to-location").value
  if (from == '') demo.showNotification("left", "bottom", "From location cant be empty")
  else if (to == '') demo.showNotification("left", "bottom", "To location cant be empty")
  else {
    const search = { from, to }
    fetch(`/passenger-bus-details?from=${from}&to=${to}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.error) {
          demo.showNotification("left", "bottom", "Invalid Credentials")
        }
        else {
          try {
            document.getElementById("passenger-bus-list-parent").style.display = "block"
            const busListPassenger = $('#bus-list').DataTable({
              data: response.data,
              stateSave: true,
              pageLength: 25,
              paging: true,
              autoWidth: true,
              deferRender: true,
              stateSave: true,
              order: [[0, "desc"]],
              columns: [
                { data: 'bus_number', title: 'Bus Number' },
                { data: 'busfrom', title: 'From Location' },
                { data: 'busto', title: 'To Location' },
                { data: 'status', title: 'Status',
                  render: function(data, type, row, meta) {
                   return data === 1 ? 'Running' : 'Not Running';
                  } 
                },
                { data: 'crowd', title: 'Density Range',
                  render: function(data, type, row, meta) {
                    if(data>50)
                      return 'High';
                    else if (data>25 && data <40)
                      return 'Medium';
                    else
                      return 'Low';
                 } 
                },
                { data: 'currentLoc', title: 'Current Location' },

              ]
            });
            busListPassenger.destroy();
          }
          catch (error) {
            console.log(error)
          }
        }
      })
  }

}