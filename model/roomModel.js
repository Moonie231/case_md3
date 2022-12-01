const Database = require('./database.js');

class RoomModel extends Database {

    static async getRooms() {
        let sql = `select * from roomstatus`;
        let result = await this.run(sql);
        return result;
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

    static async changeRoomStatus (rID, status) {
        let sql = `update room set status = "${status}" where rID = ${rID}`;
        await this.run(sql);
    }

    static async checkin (rID, time) {
        let sql = `insert into rent (rid, checkin) value (${rID}, "${time}")`;
        await this.run(sql);
    }

    static async checkout (rID, checkin, checkout) {
        let sql = `update rent set checkout = "${checkout}" where rid = ${rID} and checkin = "${checkin}"`;
        await this.run(sql);
    }

    static async getLatestCheckIn (rID) {
        let sql = `select checkIn from roomstatus where rid = ${rID}`;
        let result = await this.run(sql);
        let checkIn = result[0].checkIn;
        let timeZone = 7
        checkIn.setHours(checkIn.getHours() + timeZone);
        checkIn = (checkIn.toISOString()).slice(0,-5)
        checkIn = checkIn.replace('T', ' ');
        return checkIn;
    }
}

module.exports = RoomModel;