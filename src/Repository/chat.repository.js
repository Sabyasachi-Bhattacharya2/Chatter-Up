import cors from "cors";
import {server} from "../../index.js";
import { Server } from "socket.io";
import { ChatModel } from "./chat.schema.js";

export function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', async (socket) => {
        console.log("The Connection is established");

        socket.on("new_join",  (newName) => {
            console.log("socket on new join - server");
            socket.userName = newName;
            
            io.emit("broadcast_join_msg", newName);
        });
        const chatHistory = await ChatModel.find({}).sort({timeStamp: 1});
        socket.emit('chat_history', chatHistory);
        

        socket.on('new_message', async (msgData) => {
            console.log("socket new message server");
            console.log(`${msgData.userName} area of doubt`);
            let userMessage = {
                username: msgData.userName,
                msg: msgData.msg
            }

            const newMessage = new ChatModel({
                userName: msgData.userName,
                message: msgData.msg,
                timeStamp: new Date()
            });
            await newMessage.save();

            socket.broadcast.emit("broadcast_message", userMessage);
        });

        socket.on('disconnect', () => {
            if(socket.userName) {
                console.log("Connection is disconnected");
                socket.broadcast.emit("broadcast_leave_msg", socket.userName);
            }
        });

        socket.on("typing", (typingData) => {
            socket.broadcast.emit("broadcast_typing_msg", typingData);
        });

        socket.on("typing_stopped", (typingData) => {
            socket.broadcast.emit("broadcast_stop_typing_msg", typingData);
        });
    });
}