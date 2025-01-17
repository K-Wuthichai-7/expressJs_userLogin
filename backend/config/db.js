
const sql = require('mssql/msnodesqlv8');

var config = {
    server: "ACER\\SQLEXPRESS", 
    database: "users_db",         
    options: {
        trustedConnection: true, 
    },
    driver: "msnodesqlv8",      
};

sql.connect(config, function(err) {
    if (err) {
        console.log("Connection Error: ", err);
        return;
    }
    console.log("Connected to SQL Server");

    var request = new sql.Request();
    var query = "SELECT * FROM dbo.users"; // คำสั่ง SQL

    request.query(query, function(err, records) {
        if (err) {
            console.log("Query Error: ", err);
        } else {
            console.log("Query Result: ", records.recordset); // แสดงผลข้อมูล
        }
    });
});

module.exports = sql;
