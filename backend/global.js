function deserializeData(obj) {
        let result = {};
    
        // Iterate over the keys of the obj object
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                let map = obj[key];
                let objValues = [];
    
                // Iterate over the entries of the map
                for (let value of map.values()) {
                    objValues.push(value)
                }
    
                // Set the values in the result object
                result[key] = objValues;
            }
        }
        console.log(result);
        return result;
    }

module.exports = { deserializeData }