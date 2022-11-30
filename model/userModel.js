const Database = require('./database.js');

class UserModel extends Database {

    static async checkUser(email, password) {
        let sql = `select count(email) as count from user
        where email = "${email}" and password = "${password}"`;
        let response = await this.run(sql);
        let result = response[0].count;
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

}

module.exports = UserModel;