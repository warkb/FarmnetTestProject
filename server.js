const http = require("http");
const fs = require("fs");
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./farmnet.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the chinook database.');
});


http.createServer(function(request, response){

    console.log(`Запрошенный адрес: ${request.url}`);
    // получаем путь после слеша
    const filePath = request.url.substr(1);
    fs.readFile(filePath, function(error, data){

        if(error){
            // не файл
            // может запрос к api?
            if (request.url === '/api') {
                response.setHeader("Content-Type", "application/json; charset=utf-8;");
                let sql = 'select * from Persons';
                var finalObj = [];
                db.all(sql, [], (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    rows.forEach((row) => {
                        finalObj.push(row);
                    });
                    response.end(JSON.stringify(finalObj));
                });
            }
            else {
                response.statusCode = 404;
                response.end("Resourse not found!");
            }

        }   
        else{
            response.end(data);
        }
    });
}).listen(8800, function(){
    console.log("GoGoGo");
});