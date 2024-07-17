import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import ChatsController from './src/Controllers/chat.controller.js';
import path from 'path';
import {setupSocket} from './src/Repository/chat.repository.js'

const chatsController = new ChatsController();
export const app = express();
app.use(cors());

export const server = http.createServer(app);

app.set('views', path.join(path.resolve(),'src','UI'));

app.use(express.static('src/UI'));

app.get('/', (req, res) => chatsController.displayChats(req, res));

setupSocket(server);