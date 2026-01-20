const http = require("http");
const app = require("./src/app");
require('dotenv').config({ quiet: true });

const PORT =process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(()=>{
  console.log(process.env.PORT)
  console.log(`🚀 Server running on port ${PORT}`);
});