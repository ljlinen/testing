import { SerializeData } from "./Global.js";

export async function getData(endpoint) {

    let response = await fetch('http://localhost:3000/home/' + endpoint);

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
    let response = await fetch('http://localhost:3000/home/' + endpoint, options);
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
        let response = await fetch('http://localhost:3000/home/' + endpoint, options);
        console.log('put response' + response.body);

        return response; // Return parsed JSON response
    } catch (error) {
        console.log(error);
        throw new Error('Error updating data' + error); // Re-throw the error for the caller to handle
    }
}
