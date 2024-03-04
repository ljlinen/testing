require('dotenv').config();
const mysql = require('mysql2');

const myconnection = mysql.createPool({
    host: process.env.HOST,
    port: process.env.DBPORT,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
});

async function dbRequest(sqlQuery) {

    return new Promise((resolve, reject) => {
        return myconnection.execute(sqlQuery, (err, res) => {

            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}


async function fetchData(sqlQuery) {

    return dbRequest(sqlQuery).then(res => {
        return res;
    }).catch(err => {
        throw new Error('error making sql request ' + err)
    })
}

module.exports = { fetchData, dbRequest};