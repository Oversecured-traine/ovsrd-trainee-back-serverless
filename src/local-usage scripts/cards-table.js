const AWS = require('aws-sdk');
AWS.config.update({
    region: 'local',
    endpoint: 'http://localhost:8000',
});

const dynamodb = new AWS.DynamoDB();

const params = {
    TableName: 'adavydova-cards',
    KeySchema: [
        { AttributeName: 'cardID', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
        { AttributeName: 'cardID', AttributeType: 'S' },
        { AttributeName: 'cardIndex', AttributeType: 'N' },
        { AttributeName: 'columnID', AttributeType: 'S' },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
    },
    GlobalSecondaryIndexes: [
        {
            IndexName: 'cardsByColumnIdAndIndex',
            KeySchema: [
                { AttributeName: 'columnID', KeyType: 'HASH' },
                { AttributeName: 'cardIndex', KeyType: 'RANGE' }
            ],
            Projection: {
                ProjectionType: 'ALL'
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
            }
        }
    ]
};

dynamodb.createTable(params, (err, data) => {
    if (err) console.error("Ошибка при создании таблицы:", err);
    else console.log("Таблица успешно создана:", data);
});
