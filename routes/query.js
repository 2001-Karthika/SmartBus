function addPassenger(){
    return `INSERT INTO smartbus.passenger ( name, username,password, user_type, email, ph_num) VALUES (?,?,?,?,?,?);'`
}
function addPassenger1(){
    return `INSERT INTO smartbus.passenger ( name, username,password, user_type, email, ph_num) VALUES (?,?,?,?,?,?);'`
}
function addPassenger2(){
    return `INSERT INTO smartbus.passenger ( name, username,password, user_type, email, ph_num) VALUES (?,?,?,?,?,?);'`
}
function addPassenger3(){
    return `INSERT INTO smartbus.passenger ( name, username,password, user_type, email, ph_num) VALUES (?,?,?,?,?,?);'`
}

module.exports ={
    addPassenger,
    addPassenger1,
    addPassenger2,
    addPassenger3
}