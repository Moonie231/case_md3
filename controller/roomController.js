const BaseController = require('./baseController.js');
const db = require('../model/database.js');
const qs = require('qs');
const url = require('url');
const navbar = require('../view/navbar.js');

class Room extends BaseController {
    static home = async (req, res) => {
        let dataHTML = await this.readFile('./view/room/index.html');
        let roomHTML = '';
        let rooms = await db.getRooms();
        rooms.forEach((item) => {
            roomHTML +=
                `<tr>
                <td> ${item.rID} </td>
                <td> <img class="modal-dialog modal-sm" src="${item.image}"/> </td>
                <td> ${item.status} </td>
                <td> 
                    ${item.checkIn ? item.checkIn.toLocaleTimeString() : ''}<br>
                    ${item.checkIn ? item.checkIn.toLocaleDateString() : ''}
                </td>
                <td> 
                    ${item.checkOut ? item.checkOut.toLocaleTimeString() : ''}<br>
                    ${item.checkOut ? item.checkOut.toLocaleDateString() : ''}
                </td>
                <td>
                    <button type="button" class="btn btn-danger">
                        <a href="edit-room">
                            Edit
                        </a>
                    </button>
                    <button type="button" class="btn btn-danger">
                        <a href="delete?rID=${item.rID}&status=${item.status}">
                            Delete
                        </a>
                    </button>
                </td>
            </tr>`
        });
        res.writeHead(200, 'Content-Type', 'text/html');
        dataHTML = dataHTML.replace('<tbody></tbody>', roomHTML);
        dataHTML = dataHTML.replace('<nav></nav>', navbar);
        res.write(dataHTML);
        res.end();
    }

    static delete = async (req, res) => {
        let data = url.parse(req.url).query;
        console.log(data);
        console.log(qs.parse(data));
        let rID = qs.parse(data).rID;
        let status = qs.parse(data).status;
        if (status) {
            db.deleteRoom(rID);
            res.writeHead(301, { Location: '/home' });
        }
    }

    static add_submit = (req, res) => {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        })
        req.on('end', () => {
            let room = qs.parse(data);
            db.addRoom(room.description, room.type, room.price, room.image);
            res.writeHead(301, { Location: '/home' });
            res.end();
        })
    }
    static add = async (req, res) => {
        let dataHTML = await this.readFile('./view/room/add.html');
        dataHTML = dataHTML.replace('<nav></nav>', navbar);
        res.write(dataHTML);
        res.end();
    }

}

module.exports = Room;