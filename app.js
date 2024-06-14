import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import { Connection, Request, TYPES } from 'tedious';
import { promisify } from 'util';
const app = express();

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


const server = http.createServer(app);
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.get("/", (req, res) => {
    res.send("API IS RUNNING");
});

async function importDataToDB(jsonData) {
    return new Promise((resolve, reject) => {
        const connection = new Connection(config);

        connection.on('connect', (err) => {
            if (err) {
                console.error('Connection error:', err.message);
                reject(err);
                return;
            }
            console.log('Connection established');

            (async () => {
                try {
                    for (const data of jsonData) {
                        await new Promise((resolve, reject) => {
                            const request = new Request(`
                                INSERT INTO TableName (ID_Nation, Nation, ID_Year, Year, Population, Slug_Nation)
                                VALUES (@value1, @value2, @value3, @value4, @value5, @value6);
                            `, err => {
                                if (err) {
                                    console.error('Insert error:', err.message);
                                    return;
                                }

                                console.log('Data inserted successfully');
                                connection.close();
                            });

                            request.addParameter('value1', TYPES.VarChar, data["ID Nation"]);
                            request.addParameter('value2', TYPES.VarChar, data["Nation"]);
                            request.addParameter('value3', TYPES.VarChar, data["ID Year"]);
                            request.addParameter('value4', TYPES.VarChar, data["Year"]);
                            request.addParameter('value5', TYPES.VarChar, data["Population"]);
                            request.addParameter('value6', TYPES.VarChar, data["Slug Nation"]);
                            connection.execSql(request);
                        });
                    }
                } catch (error) {
                    console.error('Error during SQL execution:', error.message);
                    reject(error);
                } finally {
                    connection.close();
                    console.log('Connection closed');
                    resolve();
                }
            })();
        });

        connection.on('error', (err) => {
            console.error('SQL connection error:', err.message);
            reject(err);
        });

        connection.connect();
    });
}

app.get('/fetch-and-save', async (req, res) => {
    try {
        const response = await fetch('https://datausa.io/api/data?drilldowns=Nation&measures=Population');
        const jsonData = await response.json();
        // await importDataToDB()
        res.status(200).json({ resutls: jsonData.data, jsonData })
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('An error occurred');
    }
});


app.use(function (req, res, next) {
    next();
});

const port = 3000;
server.listen(port, () => {
    console.log("API Running on port : ", port);
});



