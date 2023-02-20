const db = require('../modules/db')
const {log} = require("debug");

function getUser(login ,callback) {
    let sql = `select login, password from users where login like ?`;
    db.get(sql, [login], (err, row) => {
        if(err) {
            console.log("Error: " + err)
        }
        if(row) {
            callback(null, {
                username: row.login,
                password: row.password
            })

        }
        else {
            callback(null, null)
        }

    })

}

function addUser(login, password, callback) {
    let sql = `insert into users (login, password) values (?, ?)`
    db.run(sql, [login, password], (err) => {
        if (err) {
            console.log(err)
        }
    })

    callback(null)
}

function checkIfLoggedIn(req,res, callback) {
    if(req.session.loggedin) {
        callback(null)
    }
    else
    {
        res.redirect('/login')
    }
}

module.exports = {
    getUser,
    checkIfLoggedIn,
    addUser
}