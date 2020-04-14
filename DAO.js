const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getDynamoByQuery = async ({name}) => {
    const params = {
        TableName: "Squared",
        KeyConditionExpression: "id = :a and lastpost < :b",
        FilterExpression: "passed = :c",
        ExpressionAttributeValues: {
            ":a": name,
            ":b": Date.now(),
            ":c": false
        }
      };
    
    try {
        const ans = await dynamoDb.query(params).promise();
        return ans
    } catch (error) {
        console.log(error)
    }
}


const getDynamo = async () => {
    const params = {
        TableName: 'NewSquared',
        Key: {
            id: "Timmy",
            timestamp: ''
           },
      };
    
    try {
        const ans = await dynamoDb.get(params).promise();
        return ans
    } catch (error) {
        console.log(error)
    }
}

const postDynamo = async ({query, name, ans}) => {
    const {Items} = await getDynamoByQuery({name})
    const params = Items.length ? 
    {
        TableName : 'Squared',
        Item: {
           id:name,
           lastpost: Items[0].lastpost,
           question: Items[0].question,
           answer: ans,
           passed: ans === Number(Items[0].question) * Number(Items[0].question),
           attempts: Items[0].attempts + 1
        },
      }
    
    :{
        TableName : 'Squared',
        Item: {
           id:name,
           lastpost: Date.now(),
           question: query,
           answer: ans,
           passed: ans === Number(query) * Number(query),
           attempts: 1
        },
      };
    try {
         await dynamoDb.put(params).promise();
        return Items.length ? Items[0].question : null
    } catch (error) {
        console.log(error)
    }
}

module.exports= {getDynamo, postDynamo, getDynamoByQuery}