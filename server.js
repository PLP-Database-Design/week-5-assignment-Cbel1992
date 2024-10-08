// Declare dependencies/variables
const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

app.use(express.json());
app.use(cors());

// Connect to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Check if DB connection works
db.connect((err) => {
    if (err) {
        return console.log('Error connecting to the database:', err);
    }

    console.log('Connection successful as id: ', db.threadId);
    // code goes here 
    // GET METHOD EXAMPLE
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');

// Question 1

    //patient is the name of the file inside view folder
    app.get('/patient', (req,res) => {
     // Retrieve data from the database
     db.query('SELECT * FROM patients', (err, results) => {
        if (err){
            console.error('Error executing query:', err);
            res.status(500).send('Error retrieving data ');
        }else if (results.length === 0){
            res.send('No patients found!');
        }
        else {
            //Display the records to the browser
            res.render('patient', {results: results});
        }
     });
    });

// Question 2

    //provider's data retrieval
    app.get('/provider', (req,res) => {
        db.query('SELECT * FROM providers', (err, results) => {
        if (err){ 
            console.error("Error retrieving provider's information:", err);
            res.status(500).send('Error retrieving data ');
        } else if (results.length === 0){
            res.send('No provider Found');
        }
          else{
            //display the recoder to the browser
            res.render('provider', {results: results});
          } 
        });
    });

// Question 3

app.get('/patients', (req, res) => {
    const firstName = req.query.first_name; // Get the first name from the query parameters

    // Check if first name is provided
    if (!firstName) {
        return res.status(400).send('First name is required.');
    }

    // SQL query to filter patients
    db.query('SELECT * FROM patients WHERE first_name = ?', [firstName], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Error retrieving patients');
        }
        res.json(results);
    });
});

// Question 4

app.get('/providers', (req, res) => {
    const specialty = req.query.specialty; // Get the specialty from the query parameters

    // Check if specialty is provided
    if (!specialty) {
        return res.status(400).send('Specialty is required.');
    }

    // SQL query to retrieve providers by specialty
    db.query('SELECT * FROM providers WHERE provider_specialty = ?', [specialty], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Error retrieving providers');
        }
        res.render('provider', {results: results});
    });
});


    // Start server
    app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`);
    });

    // Send a message to the browser
    console.log('Sending message to the browser...');
    app.get('/', (req, res) => {
        res.send('Server started successfully! Wedding can go on');
    });
});
