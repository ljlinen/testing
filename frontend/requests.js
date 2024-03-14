import { SerializeData } from "./Global.js";

let envport = '';
let envhost = '';

await fetch('./env.json')
   .then(response => {
     if (!response.ok) {
       throw new Error('failed loading env json');
     }
     return response.json();
   })
   .then(data => {

     envport = data.port;
     envhost = data.host;
   })
   .catch(error => {
     console.error('Error:', error);
   });

console.log(`${envhost}:${envport}/home/`);

export async function getData(endpoint) {
alert(`${envhost}:${envport}/home/${endpoint}`);
    let response = await fetch(`${envhost}:${envport}/home/` + endpoint);
    console.log(response);
    if (response.ok) {
        console.log(response.body);
        return response.json();
    } else {
        console.log("HTTP-getData Error: " + response.status);
        return response;
        }
}

export async function postData(endpoint, data) {
    const strdata = JSON.stringify(SerializeData());
    console.log('data before post request' + strdata);
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: strdata,
    };

    try {
    let response = await fetch(`${envhost}:${envport}/home/` + endpoint, options);
    console.log('put response' + response.body);
    
    } catch (error) {
        console.log(error);
        throw new Error('Error updating data' + error); // Re-throw the error for the caller to handle
        }
    
}

export async function putData(endpoint, data) {
    
    let serialized = SerializeData();
    const strdata = JSON.stringify(serialized);

    console.log('data before put request' + strdata);
    const options = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: strdata,
    };

    try {
        let response = await fetch(`${envhost}:${envport}/home/` + endpoint, options);
        console.log('put response' + response.body);

        return response; // Return parsed JSON response
    } catch (error) {
        console.log(error);
        throw new Error('Error updating data' + error); // Re-throw the error for the caller to handle
    }
}
