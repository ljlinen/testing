const express = require('express')
const routerhome = express.Router()
const path = require('path')
const fs = require('fs')
const fetchData = require('../db')
const { deserializeData } = require('../global')


routerhome.use(express.static(path.join(__dirname, '../../frontend')));
const homepagepath = path.join(__dirname, '../../frontend/index.html')
const homepage = fs.readFileSync(homepagepath, 'utf-8')

let deleteData = null;
let updateData = null;
let addData = null;

routerhome.use(express.json());
routerhome.use(express.urlencoded({ extended: true }));

routerhome.get('/', (req, res) => {
    res.status(200).send(homepage)
})

routerhome.get('/team', async (req, res) => {
    const dbdata = await fetchData.fetchData('SELECT * FROM team');
    res.status(200).send(dbdata)
})

routerhome.get('/admin', async (req, res) => {
    try {
        const dbdata = await fetchData.fetchData('SELECT email, password FROM team WHERE name = "admin"');
        if (dbdata && dbdata.length > 0) {
            console.log('Data fetched:', dbdata);
            res.status(200).json(dbdata[0]);
        } else {
            //console.log(dbdata)
            console.log('No data found for Admin');
            res.status(404).send('No data found for Admin');
        }

    } catch (error) {
        console.error('Error fetching Admin data:', error);
        res.status(500).send('Error fetching Admin data');
    }
});


routerhome.put('/team', async (req, res) => {

    let result = 'members: ';

    let deserialized = deserializeData(req.body);
    try {
        if (deserialized.update.length > 0) {
            result += ' ' + await updateDataToDb(deserialized.update);
        }
        if (deserialized.delete.length > 0) {
            result += ' ' + await deleteFromDb(deserialized.delete);
        }
        if (deserialized.add.length > 0) {
            result += ' ' + await addDataToDb(deserialized.add);
        }
        

        res.status(200).json(result);
    } catch (error) {
        throw new Error('errpr at put func ' + error);
    }
    
})

async function updateDataToDb(updateData) {

    let updatedRows = 0;

    const update = updateData;
        
    for (let i = 0; i < update.length; i++) {
   
        let element = update[i];
        let updatequery = `UPDATE team SET sendmail = '${element.sendmail}'`;
            
            try {
                updatequery += ` WHERE idteam = ${element.idteam}`;
                let results = await fetchData.dbRequest(updatequery);
                updatedRows += results.affectedRows;
            } catch (error) {
                throw new Error('error posting data to team ' + error)
            }
        
        }
        
        console.log(updatedRows + " updated");
        return updatedRows + " updated";
    }


async function addDataToDb(addData) {
  
    const add = addData;
    let addedRows = 0;
  
    for (let i = 0; i < add.length; i++) {



        let addquery = `INSERT INTO team (idteam, name, email, sendmail, password) VALUES(`;    
            addquery += `${add[i].idteam}, '${add[i].name}', '${add[i].email}', '${add[i].sendmail}', null)`;
            try {
                let result = await fetchData.dbRequest(addquery);
                console.log('DATA SHOULD BE INSERTED');
                addedRows += result.affectedRows;
            } catch (error) {
                throw new Error('error posting data to team ' + error)
            }
            
    }

    console.log(addedRows + " added");
    return addedRows + " added";
}


async function deleteFromDb(deleteData) {
    
    let deletedRows = 0;
    const delet = deleteData;

    for (let i = 0; i < delet.length; i++) {
        let id = delet[i];
        let query = `DELETE FROM team WHERE idteam=${id};`
    
        try {
            let result = await fetchData.dbRequest(query);
            console.log('DATA SHOULD BE DELETED');
            deletedRows += result.affectedRows;
        } catch (error) {
            throw new Error('error posting data to team ' + error)
        }
    }

        console.log(deletedRows + " deleted");
        return deletedRows + " deleted";
}

module.exports = routerhome;