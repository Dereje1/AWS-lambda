'use strict';

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
  const message ={
    description: 'GET lambda Ok!',
    timeStamp: Date.now(),
    query: Math.round(Math.random() * 100)
  }
  return responseUtil(message, 200) ;
}

const post = async (event) => {
  const ans = Number(event.pathParameters.val)
  const question = JSON.parse(event.body).query

  const message = {
    description: 'POST lambda Ok!',
    timeStamp: Date.now(),
    query: question,
    result: ans === Number(question) * Number(question)
  }
  return responseUtil(message, 200) ;
}

module.exports = { get, post }