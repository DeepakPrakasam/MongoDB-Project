const express = require("express");
const { MongoClient } = require("mongodb"); 
const bodyParser = require("body-parser");

const app = express();
const port = 7777;

app.use(bodyParser.urlencoded({ extended: true }));

const mongoUrl = "mongodb://localhost:27017";
const dbName = "register";
let db; 

MongoClient.connect(mongoUrl)
    .then((client) => {
        db = client.db(dbName); 
        console.log(`Connected to MongoDB: ${dbName}`);
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); 
    });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/mongodbhome.html");
});
app.get("/filmmania2.jpg", (req, res) => {
    res.sendFile(__dirname+'/filmmania2.jpg');
});
app.get("/cresita.jpg", (req, res) => {
    res.sendFile(__dirname+'/cresita.jpg');
});
app.get("/sdc.jpg", (req, res) => {
    res.sendFile(__dirname+'/sdc.jpg');
});

app.get("/mdbcr", (req, res) => {
    res.sendFile(__dirname + "/mongodbcreate.html");
});
app.get("/mdbre", (req, res) => {
    res.sendFile(__dirname + "/mongodbread.html");
});
app.get("/mdbup", (req, res) => {
    res.sendFile(__dirname + "/mongodbupdate.html");
});
app.get("/mdbde", (req, res) => {
    res.sendFile(__dirname + "/mongodbdelete.html");
});

app.post("/create", async (req, res) => {
    const { name, rn, deptname, event } = req.body;
    if (!db) {
        res.status(500).send("Database not initialized"); 
        return;
    }
    try {
        await db.collection("student").insertOne({ name, rn, deptname, event });
        res.redirect("/"); 
    } catch (err) {
        console.error("Error inserting data:", err);
        res.status(500).send("Failed to insert data");
    }
});

app.post("/read", async (req, res) => {
    const {rn} = req.body;
    try {
        const items = await db.collection("student").find({rn}).toArray(); 
        console.log(items);

        let tableContent = "<h1>Report</h1><table border='1'><tr><th>Name</th><th>Roll-number</th><th>Department</th><th>Event-name</th></tr>";
        tableContent += items.map(items => `<tr><td>${items.name}</td><td>${items.rn}</td><td>${items.deptname}</td><td>${items.event}</td></tr>`).join("");
        tableContent += "</table><a href='/'>Back to form</a>"; 
        res.send(tableContent); 
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).send("Failed to fetch data");
    }
});

app.post("/update", async (req, res) => {

    const { rn, event } = req.body;
    try {
        const result = await db.collection("student").updateOne({ rn }, { $set: {event} });
        res.send("Updated");
        //res.redirect("/"); 
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).send("Failed to fetch data");
    }
});

app.post("/delete", async (req, res) => {

    const { rn } = req.body;
    try {
        const result = await db.collection("student").deleteOne({ rn });
        res.send("Deleted");
        //res.redirect("/"); 
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).send("Failed to fetch data");
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});