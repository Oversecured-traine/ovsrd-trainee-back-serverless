const AWS = require('aws-sdk');
AWS.config.update({
    region: 'local', 
    endpoint: 'http://localhost:8000',
});

const dynamodb = new AWS.DynamoDB();

const params = {
    TableName: 'adavydova-columns',
    KeySchema: [
        { AttributeName: 'columnID', KeyType: 'HASH' },
        { AttributeName: 'columnIndex', KeyType: 'RANGE' },
    ],
    AttributeDefinitions: [
        { AttributeName: 'columnID', AttributeType: 'S' },
        { AttributeName: 'columnIndex', AttributeType: 'N' },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
    },
};

dynamodb.createTable(params, (err, data) => {
    if (err) console.error("Ошибка при создании таблицы:", err);
    else console.log("Таблица успешно создана:", data);
});
