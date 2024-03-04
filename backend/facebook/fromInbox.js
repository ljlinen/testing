const get = require('axios')
const url = 'https://graph.facebook.com/v19.0/';
const pageid = '372987323149202';
const accessToken = 'EAAPnvEdmNywBO79Syxi5WYI7V5Afqo4ZCjTzPfDjLGUpV0pZAWg91A13t2kXGVfAdLPMB7ZB9iyjpGV2fcXSvEyKzl0xqvZAzMSz7WmqlppgTGvnGB5zmKWUjANh56yKKzKZAZBrvqVgQjtoqeYHGSAKqHzsmqJ6oSbsglXAoOWmErr9S8LtvGtjgcN5CvYO8cwvEBZBQvt99Mh3Dh5mfUg8HdY';
async function requestData(id, endpoint, data, reqdesc) {

  if (endpoint == undefined ) {
    endpoint = '';
  }

  try {
    const response = await get(
      url + id + endpoint,
      {
        params: { access_token: accessToken }
      });
    if (data == 1) {
      //console.log(reqdesc + ' Success! ' + response.data)

      return response.data;

    } else if (data == 2) {

      //console.log(reqdesc + ' Success! ' + response.data.data)

      return response.data.data;
    }
  } catch (error) {
    console.error(reqdesc + ' ERROR: ' + error);
    throw error;
  }
}

async function addMessages() {

    let convosReq = await convos();
    let convoss = convosReq.convos.reverse();
    let myPageName = convosReq.myPageName;

  const clientMessages = {
    name: [],
    messages: []
  };

  for (let j = 0; j < convoss.length; j++) {
    let messagesIdsRev = convoss[j];
    clientMessages.messages[j] = [];

    for (let i = 0; i < messagesIdsRev.length; i++) {
      const msgid = messagesIdsRev[i].id;
      const message = await requestData(msgid, "?fields=message,from", 1, "req msg");

      if (message.from.name !== myPageName.name) {
        if (clientMessages.name[j] === undefined) {
          clientMessages.name[j] = message.from.name;
        }

        clientMessages.messages[j].push(message.message);
      }
    }
      
  }

  //send message and add to db as sent so it wont get sent twice
  console.log(clientMessages);
  return clientMessages;
}
      const today = new Date().setHours(0,0,0,0)
      const midnight = new Date(today)
      
async function convos() {
  const convosIds = await requestData(pageid, '/conversations?fields=id,unread_count,updated_time', 2, "req convs");

  let convoss = [];

  const requestingMessagesProms = []

  for (let i = 0; i < convosIds.length; i++) { 
      const convoId = convosIds[i].id;
      const updated_times = convosIds[i].updated_time;
      const unread_count = convosIds[i].unread_count;
      const updated_time = new Date(updated_times)

    if (updated_time > midnight && unread_count > 0) {
      requestingMessagesProms.push(requestData(convoId, "/messages?fields=id,from", 2, "req msgs Ids"));  
    }
  }
  let resultsValues;
  let someRequestsFailed = false;
  let failiureReasons;
  let final = { convos: undefined, myPageName: undefined }

  await Promise.all(requestingMessagesProms).then(
    results => {
      resultsValues = results;
    }
  ).catch(
    error => {
      someRequestsFailed = true;
      failiureReasons = error;
    }
  ).finally(async() => {
    if (someRequestsFailed == true) {
        return failiureReasons;
    } else {

      const myPageName = await requestData(pageid, '', 1, 'getting page name');

      for (let i = 0; i < resultsValues.length; i++) {
        let messagesIds = resultsValues[i];
        const messagesIdsRev = messagesIds.reverse();
        convoss.push(messagesIdsRev);
      }

      final.convos = convoss;
      final.myPageName = myPageName;
    }
  })

  return final;

}

module.exports = addMessages;
