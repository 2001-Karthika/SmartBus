<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <link href="login.css" rel="stylesheet" >
    <title>Login Form</title>
  </head>
  <body>
        <div class="container-fluid">
            <form class="mx-auto">
                <h4 class="text-center">LOGIN</h4>
                <div class=" ">
                    <label for="dropdown" class="form-label"></label>
                    <select id="dropdown" name="user-type" class="form-control" required>
                    <option value="" disabled selected hidden>Select User Type</option>
                    <option value="admin">Admin</option>
                    <option value="driver">Driver</option>
                    <option value="user">User</option>
                    </select>
                </div>
                <div class=" ">
                  <label for="exampleInputEmail1" class="form-label"></label>
                  <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Username" required>
                </div>
                <div class=" ">
                  <label for="exampleInputPassword1" class="form-label"></label>
                  <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" required>
                  <div id="emailHelp" class="form-text mt-3">Forgot password ?</div>
                </div>
              
                <button type="submit" class="btn btn-primary mt-3">Login</button>
                <div class="text-center">
                <label class="mt-4"></label>
                <a href="sign-up.html" >Passenger Sign-up</a>
            </div>
              </form>
        </div>


    <!-- Option 1: Bootstrap Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>

  </body>
</html>