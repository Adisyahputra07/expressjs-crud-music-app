const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "crud",
});

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Database is connected");
  }
});

module.exports = connection;
