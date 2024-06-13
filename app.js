const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch');
const { Connection, Request } = require('tedious');

const app = express();

// Endpoint to fetch data from API and save as JSON file
app.get('/fetch-and-save', async (req, res) => {
    try {
        // Fetch data from API
        const response = await fetch('https://datausa.io/api/data?drilldowns=Nation&measures=Population');
        const jsonData = await response.json();

        // Save JSON data to a file
        fs.writeFileSync('data.json', JSON.stringify(jsonData));

        res.status(200).send('Data saved as JSON file');
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('An error occurred');
    }
});

// Endpoint to import JSON data into MSSQL table
app.get('/import-to-sql', async (req, res) => {
    try {
        // Read JSON data from file
        const jsonData = JSON.parse(fs.readFileSync('data.json'));

        // Configure SQL Server connection
        const config = {
            authentication: {
                options: {
                    userName: 'API-DBALogin',
                    password: 'API-DBALogin#123'
                },
                type: 'default'
            },
            server: 'BKKSRV20.oceanglass.com',
            options: {
                database: 'API',
                encrypt: true
            }
        };

        // Establish connection to SQL Server
        const connection = new Connection(config);
        await connection.connect();

        // Define SQL query to insert data into table
        const request = new Request('INSERT INTO API (column1,) VALUES (@value1,)', (err) => {
            if (err) {
                console.error('Error:', err.message);
                res.status(500).send('An error occurred');
            } else {
                res.status(200).send('Data imported into MSSQL table');
            }
        });

        // Add parameters and execute query for each record
        jsonData.forEach(data => {
            request.addParameter('value1', TYPES.VarChar, data.property1);
            

            connection.execSql(request);
            request.reset();
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('An error occurred');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
