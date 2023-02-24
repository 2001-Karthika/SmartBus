const runQuery  = require('./db/runQuery');
const a = 'INSERT INTO `smartbus`.`admin` (`name`, `username`, `password`, user_type, `email`, `ph_num`) VALUES (?,?,?,?,?,?);'
const b = 'ashwin'
const c = 'ashwin'
const d = '123456'
const e = 'test@gmail.com'
const f = '7994771185'
const g = 0
async function main(a,b,c,d,e,f){
    const res = await runQuery(a,[b,c,d,g,e,f])
    console.log(res)
}
main(a,b,c,d,g,e,f)
