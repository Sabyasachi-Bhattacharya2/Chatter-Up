import { connect } from "./configuration/config.js";
import { server } from "./index.js";


server.listen(3000, () => {
    console.log("Listening on port 3000");
    connect();
})