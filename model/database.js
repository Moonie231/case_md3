const mysql = require('mysql');

class database {
    static connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '1234',
        database: 'caseM3',
        charset: 'utf8_general_ci'
    });
    static connect = this.connection.connect(err => {
        if (err) throw err;
        console.log('connected database');
    });
    static run(sql) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, (err, results) => {
                if (err) console.log(err);
                console.log('action success');
                console.log(results);
                resolve(results);
            })
        })
    }

    static async checkUser(email, password) {
        let sql = `select count(email) from user
        where email = "${email}" and password = "${password}"`;
        return await this.run(sql);
    }
}

module.exports = database;