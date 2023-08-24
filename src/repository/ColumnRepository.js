const dynamodb = require('../common/Dynamo');
const { GetItemCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand, ScanCommand, QueryCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
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

        await dynamodb.send(new PutItemCommand(params));

        return { columnTitle, columnID, columnIndex };

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

        await dynamodb.send(new UpdateItemCommand(params));

        return {columnID, columnTitle};

    }

    async deleteColumn (columnID)  {

        const params = {
            TableName: this.tableName,
            Key: marshall({ columnID }),
        };

        await dynamodb.send(new DeleteItemCommand(params));

        return columnID;

    }

    async getColumns() {
        
        const params = {
            TableName: this.tableName,
            ScanIndexForward: true,
        };
    
        const { Items } = await dynamodb.send(new ScanCommand(params));
    
        const sortedItems = Items.sort((a, b) => {
            const indexA = unmarshall(a).columnIndex;
            const indexB = unmarshall(b).columnIndex;
            return indexA - indexB;
        });
    
        return sortedItems;
    }
  
    async getMaxColumnIndex() {
        
        const params = {
            TableName: this.tableName,
            ProjectionExpression: 'columnIndex',
        };
      
        const { Items } = await dynamodb.send(new ScanCommand(params));
        
        const maxIndex = Items.length > 0 ? Math.max(...Items.map(item => unmarshall(item).columnIndex)) : 0;
        return maxIndex;
        
    }

    async moveColumn(columnID, prevColumnIndex, nextColumnIndex ) {
        console.log('move f in repository', {columnID, prevColumnIndex, nextColumnIndex});
        let columnIndex = 0;
        if(+prevColumnIndex === 0 && +nextColumnIndex === 0) {
            columnIndex = this.MIN_INDEX;
        }
        else if(+prevColumnIndex === 0){
            columnIndex = +nextColumnIndex / 2;
        }
        else if(+nextColumnIndex === 0) {
            columnIndex = +prevColumnIndex + (+prevColumnIndex / 2);
        }
        else {
            columnIndex = (+prevColumnIndex + +nextColumnIndex) / 2;
        }

        console.log('columnIndex', columnIndex);


        const params = {
            TableName: this.tableName, 
            Key: marshall({ columnID }),
            UpdateExpression: 'SET #colAttr = :colVal, #indAttr = :indVal',
            ExpressionAttributeNames: {
                '#colAttr': 'columnID',
                '#indAttr': 'columnIndex',
            },
            ExpressionAttributeValues: marshall({
                ':colVal': columnID,
                ':indVal': columnIndex,
            }),
        };
        try {
            await dynamodb.send(new UpdateItemCommand(params));
            return columnIndex;
        }
        catch (error) {
            console.error('Error moving column:', error);
            throw new Error('Failed to move a column.');
        }
    }
    
}
module.exports = ColumnRepository;
