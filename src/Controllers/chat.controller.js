import path from 'path';


export default class ChatsController {
    displayChats(req, res) {
        res.sendFile(path.join(path.resolve(),"src", "UI", "index.html"));
    }
}