const express = require('express');
const sql = require("./config/db.js");
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const multer = require('multer'); 
const csvParser = require('csv-parser');
const fs = require('fs'); 




const app = express();
const PORT = 3000;

app.use(cors());
// Middleware to parse JSON data
app.use(express.json())

app.get('/', (req, res)=>{
    res.status(200);
    res.send("Welcome to root URL of Server");
});


app.get('/getUsers', (req, res) => {
    const query = 'SELECT * FROM users';

    sql.query(query, (error, results) => {
        if (error) {
            console.error("Error fetching users:", error);
            return res.status(500).json({ message: "Failed to fetch users." });
        }

        // ส่งผลลัพธ์กลับในรูปแบบ JSON
        res.status(200).json({
            message: "Users fetched successfully.",
            results: results.recordset || results, 
        });
    });
});


app.post('/insertUser', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400);
    }
    try {
        const pool = await sql.connect();

        // ตรวจสอบว่า email ซ้ำหรือไม่
        const checkQuery = "SELECT COUNT(*) AS count FROM users WHERE email = @mail";
        const checkResult = await pool.request()
            .input('mail', sql.VarChar, email)
            .query(checkQuery);

        const count = checkResult.recordset[0].count;

        if (count > 0) {
            return res.status(409).json({ message: "Email already exists. Please use a different email." });
        }

         // เข้ารหัสรหัสผ่าน
         const hashedPassword = await bcrypt.hash(password, 10);

        // ถ้า email ไม่ซ้ำ ให้ทำการ insert
        const insertQuery = "INSERT INTO users (full_name, email, password) VALUES (@name, @mail, @pwd)";
        await pool.request()
            .input('name', sql.VarChar, name)
            .input('mail', sql.VarChar, email)
            .input('pwd', sql.VarChar, hashedPassword)
            .query(insertQuery);

        res.status(201).json({
            message: "User inserted successfully.",
        });
    } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).json({ message: "Failed to insert user.", error: error.message });
    }
});


// API สำหรับล็อกอิน
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password." });
    }

    try {
        const pool = await sql.connect();

        // ค้นหาผู้ใช้จากอีเมล
        const query = "SELECT * FROM users WHERE email = @mail";
        const result = await pool.request()
            .input('mail', sql.VarChar, email)
            .query(query);

        const user = result.recordset[0];

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // ตรวจสอบรหัสผ่านที่ผู้ใช้กรอกกับรหัสผ่านที่เข้ารหัสในฐานข้อมูล
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // สร้าง JWT Token
        const token = jwt.sign({ id: user.id, email: user.email }, 'secretkey', { expiresIn: '1h' });

        res.status(200).json({
            message: "Login successful.",
            token: token
        });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Failed to login.", error: error.message });
    }
});




// API อัปโหลด.csv และ เพิ่มข้อมูลลงฐานข้อมูล
const upload = multer({ dest: 'uploads/' });
app.post('/uploadCsv', upload.single('file'), async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: "Please upload a CSV file." });
    }

    const results = [];

    // อ่านไฟล์ CSV และบันทึกข้อมูลลงฐานข้อมูล
    fs.createReadStream(file.path)
        .pipe(csvParser())
        .on('data', (data) => {
            results.push(data);
        })
        .on('end', async () => {
            try {
                const pool = await sql.connect();

                // แทรกข้อมูลแต่ละแถว
                for (const row of results) {
                    const { name, email, password } = row;

                    if (!name || !email || !password) {
                        console.error("Invalid data:", row);
                        continue; 
                    }

                    // ตรวจสอบว่า email ซ้ำหรือไม่
                    const checkQuery = "SELECT COUNT(*) AS count FROM users WHERE email = @mail";
                    const checkResult = await pool.request()
                        .input('mail', sql.VarChar, email)
                        .query(checkQuery);

                    const count = checkResult.recordset[0].count;

                    if (count > 0) {
                        console.log(`Skipping duplicate email: ${email}`);
                        continue;
                    }

                    // เข้ารหัสรหัสผ่าน
                    const hashedPassword = await bcrypt.hash(password, 10);

                    // แทรกข้อมูลลงในฐานข้อมูล
                    const insertQuery = "INSERT INTO users (full_name, email, password) VALUES (@name, @mail, @pwd)";
                    await pool.request()
                        .input('name', sql.VarChar, name)
                        .input('mail', sql.VarChar, email)
                        .input('pwd', sql.VarChar, hashedPassword)
                        .query(insertQuery);
                }

                // ลบไฟล์ที่อัปโหลดออก
                fs.unlinkSync(file.path);

                res.status(201).json({ message: "CSV data inserted successfully." });
            } catch (error) {
                console.error("Error processing CSV file:", error);
                res.status(500).json({ message: "Failed to process CSV file.", error: error.message });
            }
        })
        .on('error', (error) => {
            console.error("Error reading CSV file:", error);
            res.status(500).json({ message: "Failed to read CSV file.", error: error.message });
        });
});


app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server Running on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);