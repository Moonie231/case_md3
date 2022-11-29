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
        let sql = `select room.rID, room.status, rent.checkIn, rent.checkOut
        from room left join rent on rent.rID = room.rID
        where rent.checkIn >= all (select max(checkIn) from rent group by rID)`;
        let result = await this.run(sql);
        console.log(result);
        return result;
    }

    static async getUser(){
        let sql = 'select * from user limit 1'
        let response = await this.run(sql);
        return response;
    }

    static deleteRoom (rID) {
        let sql = `delete from room where rID = ${rID}`;
        this.run(sql);
    }
}
module.exports = database;