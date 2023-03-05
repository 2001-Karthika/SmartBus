const runQuery  = require('./db/runQuery');
const a = 'INSERT INTO `smartbus`.`admin` (`name`, `username`, `password`, user_type, `email`, `ph_num`) VALUES (?,?,?,?,?,?);'
const b = 'admin D'
const c = 'admind'
const d = 'sffnk'
const e = 'admind@gmail.com'
const f = '987532948'
const g = 0
async function main(a,b,c,d,g,e,f){
    const res = await runQuery(a,[b,c,d,g,e,f])
    console.log(res)
}
main(a,b,c,d,g,e,f)
