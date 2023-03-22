var http = require('http');

var fs = require('fs');

http.createServer(function (req, res) {
  console.log(req.method,req.url,req.method === "PUT" , req.url.startsWith("/users/"))
  if (req.method === 'OPTIONS') {
    res.writeHead(204, req.headers);
    res.end();
    return;
  }
 else if (req.url === "/users" && req.method === "GET") {
    fs.readFile('users.txt', function(err, data) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(data);
      res.end();
    })
  }

  else if (req.url === '/users/add' && req.method === 'POST') {

    let body = "";
    req.on("data", (chunk) => {
      
      body += chunk.toString();
      body = JSON.parse(body);
      console.log("chunk", body)
    });

    req.on("end", () => {
      const file = fs.readFileSync('users.txt')
      const json = JSON.parse(file)
      json.push(body);
      var newData2 = JSON.stringify(json);
      console.log(json);
      fs.writeFile("users.txt", newData2, (err) => {
        if (err) throw err;
        console.log('Saved!');
      });
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User created successfully" }));
    });
  }

  else if (req.method === "PUT" && req.url.startsWith("/users/")) {
    const file = fs.readFileSync('users.txt')
    const json = JSON.parse(file)
    const id = parseInt(req.url.split("/")[2]);
    console.log(id);
    const user = Object.values(json).find(user => user.id === id);
    console.log("update ",user);
    

    if (!user) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User not found" }));
    } else {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
        console.log("chunk", body)
      });

      req.on("end", () => {
        const data = JSON.parse(body);
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.email = data.email;
        user.phone = data.phone;
        user.gender = data.gender;
        var newData2 = JSON.stringify(json);
        console.log(json);
        fs.writeFile("users.txt", newData2, (err) => {
          if (err) throw err;
          console.log('Saved!');
        });
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHead(200, { "Content-Type": "application/json" });
        console.log(JSON.stringify(json));
        res.end(JSON.stringify(user));
      });
    } 
  }

  else if (req.method === "DELETE" && req.url.startsWith("/users/")) {
    const file = fs.readFileSync('users.txt')
    const json = JSON.parse(file)
  
    const id = parseInt(req.url.split("/")[2]);
    const user = json.filter(users => {
      return users.id !== id
    });
    console.log("delete ",user);


        fs.writeFile("users.txt", JSON.stringify(user), (err) => {
          if (err) throw err;
          console.log('Saved!');
        });
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHead(200, { "Content-Type": "application/json" });
        console.log(JSON.stringify(user));
        res.end(JSON.stringify(user));
      }
    
}).listen(5080);


// async function fetchData() {
//     fetch("https://dummyjson.com/users?limit=10&select=id,firstName,lastName,email,gender,phone")
//       .then((response) => response.json())
//       .then((data) => {
        
//         fs.writeFile('users.txt', JSON.stringify(data["users"]), function (err) {
//             if (err) throw err;
//             console.log('Saved!');
//           });
//       })
//       .catch((error) => {
//         console.log(error)
//       });
//   }
//   fetchData();

