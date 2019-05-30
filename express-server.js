// подключение express
const express = require("express");
// создаем объект приложения
const app = express();
// создаем парсер для данных в формате json
const jsonParser = express.json();
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./farmnet.db', (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the chinook database.');
});

const port = 8800;

// определяем обработчик для маршрута "/"
app.use("/static", express.static(__dirname + "/static"));
app.get("/allpersons", function(request, response) {
	let sql = 'select * from Persons';
	finalObj = [];
	db.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		rows.forEach((row) => {
			finalObj.push(row);
		});
		response.json(JSON.stringify(finalObj));
	});
});
app.get("/", function(request, response){
    // отправляем ответ
    response.sendFile(__dirname + "/static/app/index.html");
});

app.listen(port, function () {
	console.log(`http://localhost:${port}`);
});