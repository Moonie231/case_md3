const BaseController = require('./baseController.js');
const RoomModel = require('../model/roomModel.js');
const qs = require('qs');
const url = require('url');
const navbar = require('../view/navbar.js');

class Room extends BaseController {
    static view = async (req, res) => {
        let dataHTML = await this.readFile('./view/room/index.html');
        let roomHTML = '';
        let rooms = await RoomModel.getRooms();
        rooms.forEach((item) => {
            roomHTML +=
                `<tr>
                <td> ${item.rID} </td>
                <td> <img src="${item.image}" class="modal-sm" alt="image"/> </td>
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
                <button type="button" class="btn btn-success">
                    <a href="edit-room" class="text-white">
                        IN
                    </a>
                </button>
                <button type="button" class="btn btn-danger">
                    <a href="delete?rID=${item.rID}&status=${item.status}" class="text-white">
                        OUT
                    </a>
                </button>
                </td>
                <td>
                    <button type="button" class="btn btn-success">
                        <a href="/room/edit?rID=${item.rID}" class="text-white">
                            Edit
                        </a>
                    </button>
                    <button type="button" class="btn btn-danger ${item.status == 'rented' ? 'disabled' : ''}">
                        <a ${item.status == 'rented' ? '#' : `href="/room/delete?rID=${item.rID}&status=${item.status}"`} class="text-white">
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
        let {rID, status} = qs.parse(data);
        if (status == 'available') {
            RoomModel.deleteRoom(rID);
        }
        res.writeHead(301, { Location: '/room' });
        res.end();
    }

    static add = async (req, res) => {
        if (req.method == "GET") {
            let dataHTML = await this.readFile('./view/room/add.html');
            dataHTML = dataHTML.replace('<nav></nav>', navbar);
            res.write(dataHTML);
            res.end();
        }
        else {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', () => {
                let room = qs.parse(data);
                RoomModel.addRoom(room.description, room.type, room.price, room.image);
                res.writeHead(301, { Location: '/room' });
                res.end();
            })
        }
    }

    static edit = async (req, res) => {
        let rID = qs.parse(url.parse(req.url).query).rID;
        if (req.method == "GET") {

            let room = (await RoomModel.getRoomByID(rID))[0];
            console.log(room);
            let dataHTML = await this.readFile('./view/room/edit-room.html');
            dataHTML = dataHTML.replace('<nav></nav>', navbar);
            dataHTML = dataHTML.replace('valueRID', `value="${rID}"`);
            dataHTML = dataHTML.replace('valueDescription', `value="${room.description}"`);
            dataHTML = dataHTML.replace(`value="${room.type}"`, `value="${room.type}" selected`);
            dataHTML = dataHTML.replace('valuePrice', `value="${room.price}"`);
            dataHTML = dataHTML.replace('valueImage', `value="${room.image}"`);
            res.writeHead(200, 'Content-Type', 'text/html');
            res.write(dataHTML);
            res.end();
        }
        else {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', () => {
                let room = qs.parse(data);
                console.log(room);
                RoomModel.updateRoomInfo(rID, room.description, room.type, room.price, room.image);
                res.writeHead(301, {Location: '/room'});
                res.end();
            })
        }

    }

}

module.exports = Room;