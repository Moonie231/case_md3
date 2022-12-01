const mysql = require('mysql');

class Database {
    static connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '1234',
        database: 'casem3',
        charset: 'utf8_general_ci'
    })

    static connect = this.connection.connect(err => {
        if (err) throw err;
        console.log('connected database');
    })

    static run(sql) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, (err, results) => {
                if (err) console.log(err);
                resolve(results);
            })
        })
    }
}
module.exports = Database;