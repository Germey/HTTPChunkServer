var http = require("http");
var fs = require("fs");
const batchBuffer = 10000;

function generateChunk(index, data, response, pieceNumber) {
  setTimeout(() => {
    let start = index * batchBuffer;
    let end = (index + 1) * batchBuffer;
    console.log("index", index, "start", start, "end", end);
    let buffer = data.slice(start, end);
    console.log("buffer", buffer.byteLength);
    // test losing packet
    response.write(buffer);
    if (index == pieceNumber - 1) {
      // end
      console.log("end", end);
      response.end();
    }
  }, index * 1000);
}

function handlerRequest(_request, response) {
  response.setHeader("Content-Type", "image/jpeg");
  response.setHeader("Transfer-Encoding", "chunked");
  var stream = fs.readFile("image.jpeg", (error, data) => {
    if (!error) {
      // response.setHeader("Content-Length", data.byteLength);
      let length = data.byteLength;
      console.log("length", length);
      let pieceNumber = Math.ceil(length / batchBuffer);
      console.log("pieceNumber", pieceNumber);
      let index = 0;
      while (index < pieceNumber) {
        generateChunk(index, data, response, pieceNumber);
        index++;
      }
    }
  });
}

const server = http.createServer(handlerRequest);
server.listen(3000);
console.log("server started at http://localhost:3000");
