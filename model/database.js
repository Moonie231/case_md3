const mysql = require('mysql');

class database {
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

    static async getRooms() {
        let sql = `select room.rID, room.status, room.image, rent.checkIn, rent.checkOut
        from room left join rent on room.rid = rent.rid
        join (select room.rid, max(rent.checkin) checkin
        from room left join rent on room.rid = rent.rid
        group by room.rid) as latest on rent.rid = latest.rid and rent.checkin = latest.checkin
        where room.usable = '1'
        union
        select room.rid, room.status, room.image, rent.checkin, rent.checkout
        from room left join rent on room.rid = rent.rid
        where room.rid not in (select rid from rent) and room.usable = '1'`;
        let result = await this.run(sql);
        console.log(result);
        return result;
    }

    static async getUser(email){
        let sql = `select * from user where email = "${email}";`;
        let response = await this.run(sql);
        console.log(response)
        return response[0];
    }

    static async updateUserInfo(email, name, birthday, telephone, avatar) {
        let sql = `update user 
        set name="${name}", birthday="${birthday}", telephone="${telephone}", avatar="${avatar}"
        where email="${email}"`;
        await this.run(sql);
    }

    static async updateUserPassword(email, password) {
        let sql = `update user set password="${password}" where email="${email}"`;
        await this.run(sql);
    }

    static deleteRoom (rID) {
        let sql= `update room set usable = "0" where rID = ${rID}`;
        this.run(sql);
    }
    static async addRoom (description, type, price, image) {
        let sql = `insert into room (description, type, price, image)
        value ("${description}", "${type}", ${price}, "${image ? image : ''}");`
        await this.run(sql);
    }

    static async getRoomByID (id) {
        let sql =  `select description, type, price, image from room where rID = ${id}`;
        let room = await this.run(sql);
        return room;
    }

    static async updateRoomInfo (rID, description, type, price, image) {
        let sql = `update room set description = "${description}", type = "${type}", price = ${price}, image = "${image}" where rID = ${rID}`;
        await this.run(sql);
    }
}

module.exports = database;