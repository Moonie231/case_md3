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
                    <a ${item.status == 'rented' ? '#' : `href="/room/checkin?rID=${item.rID}"`} class="text-white">
                        <button type="button" class="btn btn-success" ${item.status == 'rented' ? 'disabled' : ''}>
                            IN
                        </button>    
                    </a>
                    <a ${item.status == 'available' ? '#' : `href="/room/checkout?rID=${item.rID}"`} class="text-white">
                        <button type="button" class="btn btn-danger" ${item.status == 'available' ? 'disabled' : ''}>
                            OUT
                        </button>
                    </a>
                </button>
                </td>
                <td>
                    <a href="/room/edit?rID=${item.rID}" class="text-white">
                        <button type="button" class="btn btn-success">
                            Edit
                        </button>
                    </a>
                    <a ${item.status == 'rented' ? '#' : `href="/room/delete?rID=${item.rID}&status=${item.status}"`} class="text-white">
                        <button type="button" class="btn btn-danger" ${item.status == 'rented' ? 'disabled' : ''}>
                            Delete
                        </button>
                    </a>
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
        let { rID, status } = qs.parse(data);
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
            });
            req.on('end', () => {
                let room = qs.parse(data);
                RoomModel.addRoom(room.description, room.type, room.price, room.image);
                res.writeHead(301, { Location: '/room' });
                res.end();
            });
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
                res.writeHead(301, { Location: '/room' });
                res.end();
            });
        }

    }

    static checkin = async (req, res) => {
        let rID = qs.parse(url.parse(req.url).query).rID;
        if (req.method == 'GET') {
            let dataHTML = await this.readFile('./view/room/checkin.html');
            dataHTML = dataHTML.replace('<nav></nav>', navbar);
            dataHTML = dataHTML.replace('valueRID', `value="${rID}"`);
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
                let time = qs.parse(data).checkin;
                RoomModel.changeRoomStatus(rID, 'rented');
                RoomModel.checkin(rID, time);
                res.writeHead(301, {Location: '/room'});
                res.end();
            })
        }
    }

    static checkout = async (req, res) => {
        let rID = qs.parse(url.parse(req.url).query).rID;
        if (req.method == 'GET') {
            let dataHTML = await this.readFile('./view/room/checkout.html');
            dataHTML = dataHTML.replace('<nav></nav>', navbar);
            dataHTML = dataHTML.replace('valueRID', `value="${rID}"`);
            res.writeHead(200, 'Content-Type', 'text/html');
            res.write(dataHTML);
            res.end();
        }
        else {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end',async () => {
                let checkout = qs.parse(data).checkout;
                let checkin = await RoomModel.getLatestCheckIn(rID);
                RoomModel.changeRoomStatus(rID, 'available');
                RoomModel.checkout(rID, checkin, checkout);
                res.writeHead(301, {Location: '/room'});
                res.end();
            })
        }
    }
}

module.exports = Room;