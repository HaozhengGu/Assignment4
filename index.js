const fs = require("fs");
const http = require("http");

const welcomePage = `<html>
    <head><title>Welcome Page</title></head>
    <body>
        <h1>Welcome to the homepage</h1>
        <h2>Please enter player name</h2>
        <form action="/create-player" method="POST">
            <div>
                <input type="text" name="input" autofocus/>
            </div>
            <div>
                <button type="submit">Create</button>
            </div>
        </form>
        <h3>To <a href="/players">Players</a></h3>
    </body>
</html>`;

const playersPage = `<html>
    <head><title>Players</title></head>
    <body>
        <h1>List of Players</h1>
        <h2>Back to <a href="/index.html">homepage</a></h2>
        <ul>
            LIST
        </ul>
    </body>
</html>`;

let datas = [];
let connect = [];
let filename = 'players.txt';
let playername = '';

/* Create a http server */
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");

    if (req.url === "/") {
        res.writeHead(301, {
            Location: "/index.html"
        });
        return res.end();
    }

    if (req.url === "/index.html") {
        return res.end(welcomePage);
    }

    if (req.url === "/players") {
        const filecontent = fs.readFileSync(filename,"utf-8").split("\n");
        for (let i = 0; i < filecontent.length; i++) {
            playername += '<li>' + filecontent[i] + '</li>\n';
        }
        
        return res.end(playersPage.replace("LIST", playername));
    }

    if (req.url === "/create-player" && req.method === "POST") {
        let data = '';

        req.on("data", function(chunk) {
            data = chunk.toString();
            data = data.replace("input=","").replace("+"," ");
            console.log(data);
        });

        req.on("end", function() {
            datas.push(data);
            connect = datas.join("\n");
            fs.writeFileSync(filename, connect);
        });

        res.writeHead(302, {
            Location: "/index.html"
        });
        return res.end();
    }

});

const hostname = "127.0.0.1";
const port = 3000;

/* Bind server to a port */
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});