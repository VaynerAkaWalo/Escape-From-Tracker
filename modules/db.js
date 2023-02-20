const sqlite3 = require('sqlite3').verbose()

module.exports = new sqlite3.Database('./database.db', (err) => {
        if (err) {
            console.log("Error: " + err)
        }

        console.log("Connected to database")
});
