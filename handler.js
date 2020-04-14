'use strict';
//require('dotenv').config()
const DAO = require('./DAO');

const responseUtil = (message, statusCode) => (
  {
    statusCode,
    headers: {
        "x-custom-header" : "my custom header value",
        "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(
      {
        message,
      },
      null,
      2
    ),
  }
)

const get = async (event) =>{

  const {Items} =  await DAO.getDynamoByQuery({name:event.pathParameters.val})

  const message ={
    description: 'GET lambda Ok!',
    timeStamp: Date.now(),
    query: Items.length ? Items[0].question : Math.round(Math.random() * 100),
    attempts: Items.length ? Items[0].attempts : 0
  }
  return responseUtil(message, 200) ;
}

const post = async (event) => {
  const ans = Number(event.pathParameters.val)
  const {query, name} = JSON.parse(event.body)
  const stored = await DAO.postDynamo({query, name, ans})
  const latestQuery = stored || query
  console.log(stored)
  const message = {
    description: 'POST lambda Ok!',
    timeStamp: Date.now(),
    query: latestQuery,
    result: ans === Number(latestQuery) * Number(latestQuery),
    ans,
    stored
  }
  return responseUtil(message, 200) ;
}

module.exports = { get, post }