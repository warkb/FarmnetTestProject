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
});

const port = 8800;

// определяем обработчик для статики
app.use("/static", express.static(__dirname + "/static"));
app.get("/allpersons", function(request, response) {
	// возвращает json со списком всех пользователей
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

app.get("/changeperson", function (request, response) {
	// Создаем или редактируем пользователя
	let id = parseInt(request.query.id);
	let new_first_name = request.query.first_name;
	let new_last_name = request.query.last_name;
	let new_father_name = request.query.father_name;
	let new_unix_time = parseInt(request.query.unix_time);
	let sql = '';
	if (id == 0) {
		sql = 'INSERT INTO Persons (first_name,last_name,father_name,unix_time)' + 
		`VALUES ('${new_first_name}','${new_last_name}','${new_father_name}',${new_unix_time});`
	}
	else {
		sql = 'update Persons set ' +
		`first_name='${new_first_name}', last_name='${new_last_name}', ` +
		`father_name='${new_father_name}', unix_time=${new_unix_time} ` +
		`where id=${id}`
	}
	db.run(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		response.json(JSON.stringify({done: true}));
	});
})


app.get('/delperson', function(request, response) {
	// удаляем пользователя из базы данных
	let sql = 'delete from Persons where id = ' + request.query.id;
	db.run(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		response.json(JSON.stringify({id: request.query.id}));
	});
})

app.get("/", function(request, response){
    // отправляем ответ
    response.sendFile(__dirname + "/static/app/index.html");
});

app.listen(port, function () {
	console.log(`http://localhost:${port}/#!/persons`);
});