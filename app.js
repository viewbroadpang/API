import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import { Connection, Request, TYPES } from 'tedious';
import fetch from 'node-fetch';  // Import fetch library
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
        encrypt: true,
        trustServerCertificate: true
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
                                INSERT INTO Fact (photos, employeeCode, employeeCard, prefix, firstName, lastName, employeeName, prefixAlt, firstNameAlt, lastNameAlt, employeeNameAlt, nickName, joinDate, serviceDate, endProbationDate, endDate, quitReason, companyCode, company, establishmentCode, establishment, positionDate, jobroleCode, jobrole, positionCode, positionName, employeelevelCode, employeelevel, employeelevelNo, locationCode, location, organizationCode, organization, combinationCode, combination,  suppervisorCode, suppervisor, workEmails, workPhones, workAddresses, birthDate, homeEmails, homePhones, mobilePhones, homeAddresses, nationID, expiredate)
                                VALUES (@value1, @value2, @value3, @value4, @value5, @value6, @value7, @value8, @value9, @value10, @value11, @value12, @value13, @valu14, @value15, @value16, @value17, @value18, @value19, @value20, @value21, @value22, @value23, @value24, @value25, @value26, @value27, @value28, @value29, @value30, @value31, @value32, @value33, @value34, @value35, @value36, @value37, @value38, @value39, @value40, @value41, @value42, @value43, @value44, @value45, @value46, @value47);

                            `, err => {
                                if (err) {
                                    console.error('Insert error:', err.message);
                                    reject(err);
                                    return;
                                }
                    
                                console.log('Data inserted successfully');
                                resolve();
                            });
                    
                            request.addParameter('value1', TYPES.Image, data["photos"]);
                            request.addParameter('value2', TYPES.VarChar, data["employeeCode"]);
                            request.addParameter('value3', TYPES.VarChar, data["employeeCard"]);
                            request.addParameter('value4', TYPES.VarChar, data["prefix"]);
                            request.addParameter('value5', TYPES.VarChar, data["firstName"]);
                            request.addParameter('value6', TYPES.VarChar, data["lastName"]);
   			    request.addParameter('value7', TYPES.VarChar, data["employeeName"]);
                            request.addParameter('value8', TYPES.VarChar, data["prefixAlt"]);
                            request.addParameter('value9', TYPES.VarChar, data["firstNameAlt"]);
                            request.addParameter('value10', TYPES.VarChar, data["lastNameAlt"]);
                            request.addParameter('value11', TYPES.VarChar, data["employeeNameAlt"]);
			    request.addParameter('value12', TYPES.VarChar, data["nickName"]);
                            request.addParameter('value13', TYPES.Int, data["joinDate"]);
                            request.addParameter('value14', TYPES.Int, data["serviceDate"]);
                            request.addParameter('value15', TYPES.Int, data["endProbationDate"]);
                            request.addParameter('value16', TYPES.Int, data["endDate"]);
			    request.addParameter('value17', TYPES.VarChar, data["quitReason"]);
                            request.addParameter('value18', TYPES.VarChar, data["companyCode"]);
                            request.addParameter('value19', TYPES.VarChar, data["company"]);
                            request.addParameter('value20', TYPES.VarChar, data["establishmentCode"]);
                            request.addParameter('value21', TYPES.VarChar, data["establishment"]);
			    request.addParameter('value22', TYPES.Int, data["positionDate"]);
                            request.addParameter('value23', TYPES.VarChar, data["jobroleCode"]);
                            request.addParameter('value24', TYPES.VarChar, data["jobrole"]);
                            request.addParameter('value25', TYPES.VarChar, data["positionCode"]);
                            request.addParameter('value26', TYPES.VarChar, data["positionName"]);
			    request.addParameter('value27', TYPES.VarChar, data["employeelevelCode"]);
                            request.addParameter('value28', TYPES.VarChar, data["employeelevel"]);
                            request.addParameter('value29', TYPES.Int, data["employeelevelNo"]);
                            request.addParameter('value30', TYPES.VarChar, data["locationCode"]);
                            request.addParameter('value31', TYPES.VarChar, data["location"]);
			    request.addParameter('value32', TYPES.VarChar, data["organizationCode"]);
                            request.addParameter('value33', TYPES.VarChar, data["organization"]);
                            request.addParameter('value34', TYPES.VarChar, data["combinationCode"]);
                            request.addParameter('value35', TYPES.VarChar, data["combination"]);
                            request.addParameter('value36', TYPES.VarChar, data["suppervisorCode"]);
			    request.addParameter('value37', TYPES.VarChar, data["suppervisor"]);
                            request.addParameter('value38', TYPES.VarChar, data["workEmails"]);
                            request.addParameter('value39', TYPES.Int, data["workPhones"]);
                            request.addParameter('value40', TYPES.VarChar, data["workAddresses"]);
                            request.addParameter('value41', TYPES.Int, data["birthDate"]);
			    request.addParameter('value42', TYPES.VarChar, data["homeEmails"]);
                            request.addParameter('value43', TYPES.Int, data["homePhones"]);
                            request.addParameter('value44', TYPES.Int, data["mobilePhones"]);
                            request.addParameter('value45', TYPES.VarChar, data["homeAddresses"]);
 			    request.addParameter('value46', TYPES.Int, data["nationID"]);
                            request.addParameter('value47', TYPES.VarChar, data["expiredate"]);
                    
                            connection.execSql(request);
                            
                        }); 
                    }
                    
                    // Close connection outside the loop
                    connection.close();
                     
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
        const url = 'https://sabas.eunite.com/eunite/webservices/employees?dateV=01-04-2022&page=1&size=10';
        const username = 'sa.trial_sabas01@eunite.com';  // Replace with your API username
        const password = 'eUniteDemo@2023';  // Replace with your API password
        const encodedCredentials = Buffer.from(`${username}:${password}`).toString('base64');
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Basic ${encodedCredentials}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const jsonData = await response.json();
        await importDataToDB(jsonData.data); // Pass jsonData to importDataToDB function
        res.status(200).json({ results: jsonData });
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
