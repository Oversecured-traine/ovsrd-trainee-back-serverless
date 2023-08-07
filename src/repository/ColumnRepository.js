const dynamodb = require('../common/Dynamo');
const { GetItemCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand, ScanCommand, QueryCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const { v4: uuidv4 } = require('uuid');


class ColumnRepository {

    constructor() {
        this.tableName = process.env.COLUMNS_TABLE_NAME;
        this.MIN_INDEX = 3000;
    }

    async createColumn (columnTitle)  {

        const columnID = uuidv4();

        const maxIndex = await this.getMaxColumnIndex();
        const columnIndex = maxIndex + this.MIN_INDEX;

        const params = {
            TableName: this.tableName,
            Item: marshall({ columnID, columnIndex, columnTitle }),
        };

        return await dynamodb.send(new PutItemCommand(params));

    }

    async getColumn (columnID)  {
        
        const params = {
            TableName: this.tableName,
            Key: marshall({ columnID }),
        };

        const { Item } = await dynamodb.send(new GetItemCommand(params));

        return Item;

    }

    async updateColumn (columnID, columnTitle)  {

        const params = {
            TableName: this.tableName,
            Key: marshall({ columnID }),
            UpdateExpression: 'SET #attr = :val',
            ExpressionAttributeNames: { '#attr': 'columnTitle' },
            ExpressionAttributeValues: marshall({ ':val': columnTitle }),
        };

        return await dynamodb.send(new UpdateItemCommand(params));

    }

    async deleteColumn (columnID)  {

        const params = {
            TableName: this.tableName,
            Key: marshall({ columnID }),
        };

        return await dynamodb.send(new DeleteItemCommand(params));

    }

    async getColumns ()  {

        const params = {
            TableName: this.tableName,
        };

        const { Items } = await dynamodb.send(new ScanCommand(params));

        return Items;
    }

    // Колонки сортируются по индексу
    async getSortedColumns ()  {

        const params = {
            TableName: this.tableName,
            IndexName: 'columnsByIndex',
            KeyConditionExpression: 'columnIndex > :startValue',
            ExpressionAttributeValues: {
                ':startValue': marshall({ N: '0' }),
            },
            ScanIndexForward: true,
        };

        try {
            const { Items } = await dynamodb.send(new ScanCommand(params));
            return Items;
        } 

        catch (error) {
            console.error('Error getting columns:', error);
            throw new Error('Failed to get columns from the database');
        }
    }
    
    async  getMaxColumnIndex () {
        const params = {
            TableName: this.tableName,
            ProjectionExpression: 'columnIndex', 
            Limit: 1,
            ScanIndexForward: false, 
            KeyConditionExpression: 'columnID > :startValue', 
            ExpressionAttributeValues: {
                ':startValue': '', 
            },
        };
    
        try {
            const { Items } = await dynamodb.send(new QueryCommand(params));
            if (Items.length > 0) {
                return Items[0].columnIndex;
            } else {
                return 0;
            }
        } catch (error) {
            console.error('Error getting max column index:', error);
            throw new Error('Failed to get max column index from the database');
        }
    }
    

}
module.exports = ColumnRepository;
