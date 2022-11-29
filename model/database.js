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
                resolve(results);
            })
        })
    }

    static async checkUser(email, password) {
        let sql = `select count(email) as count from user
        where email = "${email}" and password = "${password}"`;
        let response = await this.run(sql);
        let result = response[0].count;
        return result;
    }

    static async getRooms (){
        let sql = `select room.rID, room.status, rent.checkIn, rent.checkOut from rent join room on rent.rID = room.rID`;
        let result = await this.run(sql)
        console.log(result)
        return result;
    }
}
module.exports = database;