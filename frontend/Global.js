export const ReqData = {
    update: new Map([]),
    add: new Map([]),
    delete: new Map([])
}


export function SerializeData() {
    let result = {};
    for (let key in ReqData) {
            
            result[key] = Array.from(ReqData[key].values());
    }
    
    return result; 
    
}

export function logReqData(from) {
    console.log(`${from}` + JSON.stringify(SerializeData()))
}

export function makeObject(id, name, email, mail, password) {
        
    return {
        'idteam': `${id}`,
        'name': `${name}`,
        'email': `${email}`,
        'sendmail': `${mail}`,
        'password': `${password}`,
    }
}