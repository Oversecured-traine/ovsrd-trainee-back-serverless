const dynamodb = require('../common/Dynamo');
const { GetItemCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand, ScanCommand, QueryCommand, BatchWriteItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const { v4: uuidv4 } = require('uuid');


class CardRepository {

    constructor() {
        this.tableName = process.env.CARDS_TABLE_NAME;
        this.MIN_INDEX = 3000;
    }

    async createCard (columnID, cardTitle)  {

        const cardID = uuidv4();

        const maxIndex  = await this.getMaxCardIndex();
        const cardIndex = maxIndex + this.MIN_INDEX;

        const params = {
            TableName: this.tableName,
            Item: marshall({ cardID, columnID, cardIndex, cardTitle }),
        };

        return await dynamodb.send(new PutItemCommand(params));

    }

    async getCard (cardID)  {
        
        const params = {
            TableName: this.tableName,
            Key: marshall({ cardID }),
        };

        const { Item } = await dynamodb.send(new GetItemCommand(params));

        return Item;

    }

    async updateCard (cardID, cardTitle)  {

        const params = {
            TableName: this.tableName,
            Key: marshall({ cardID }),
            UpdateExpression: 'SET #attr = :val',
            ExpressionAttributeNames: { '#attr': 'cardTitle' },
            ExpressionAttributeValues: marshall({ ':val': cardTitle }),
        };

        return await dynamodb.send(new UpdateItemCommand(params));

    }

    async deleteCard (cardID)  {

        const params = {
            TableName: this.tableName,
            Key: marshall({ cardID }),
        };

        return await dynamodb.send(new DeleteItemCommand(params));

    }

    async  getCardsByColumnID (columnID) {

        const params = {
            TableName: this.tableName,
            KeyConditionExpression: 'columnID = :columnID',
            ExpressionAttributeValues: {
                ':columnID': { S: columnID },
            },
        };
      
        try {
            const { Items } = await dynamodb.send(new QueryCommand(params));
            return Items;  
        } 
        catch (error) {
            console.error('Error getting cards:', error);
            throw new Error('Failed to get cards from the database.');
        }
    }

    async deleteCardsInBatch (items) {

        const deleteRequests = items.map((item) => ({
            DeleteRequest: {
                Key: marshall({ columnID: { S: item.columnID.S }, cardID: { S: item.cardID.S } }),
            },
        }));

        if (deleteRequests.length === 0) {
            console.log('No cards to delete.');
            return;
        }
      
        const batchParams = {
            RequestItems: {
                [this.tableName]: deleteRequests,
            },
        };
      
        try {
            await dynamodb.send(new BatchWriteItemCommand(batchParams));
            console.log('All cards deleted successfully.');
        } 
        
        catch (error) {
            console.error('Error deleting cards:', error);
            throw new Error('Failed to delete cards from the database.');
        }
    }

    async getCards ()  {

        const params = {
            TableName: this.tableName,
        };

        const { Items } = await dynamodb.send(new ScanCommand(params));

        return Items;
    }

    // Карточки возвращаються отсортированные по айди колонки и по своему индексу
    async getSortedCards ()  {

        const params = {
            TableName: this.tableName,
            IndexName: 'cardsByColumnIdAndIndex',
            KeyConditionExpression: 'cardIndex > :startValue',
            ExpressionAttributeValues: {
                ':startValue': marshall({ N: '0' }),
            },
            ScanIndexForward: true,
        };
    
        try {
            const { Items } = await dynamodb.send(new QueryCommand(params));
            return Items;
        } 
    
        catch (error) {
            console.error('Error getting cards:', error);
            throw new Error('Failed to get cards from the database');
        }
    }

    async move (cardID, columnID, prevCardIndex, nextCardIndex ) {

        //в карточке поменять columnID на новую
        //задать cardIndex = (prevCardIndex + nextCardIndex) / 2

        let cardIndex = 0;
        if(prevCardIndex && nextCardIndex) {
            cardIndex = (prevCardIndex + nextCardIndex) / 2;
        }
        else if (prevCardIndex) {
            cardIndex = prevCardIndex + (prevCardIndex / 2);
        }
        else if (nextCardIndex) {
            cardIndex = nextCardIndex / 2;
        }

        const params = {
            TableName: this.tableName, 
            Key: marshall({ cardID }),
            UpdateExpression: 'SET #colAttr = :colVal, #indAttr = :indVal',
            ExpressionAttributeNames: {
                '#colAttr': 'columnID',
                '#indAttr': 'cardIndex',
            },
            ExpressionAttributeValues: marshall({
                ':colVal': columnID,
                ':indVal': cardIndex,
            }),
        };
        try {
            await dynamodb.send(new UpdateItemCommand(params));
        }
        catch (error) {
            console.error('Error moving card:', error);
            throw new Error('Failed to move a card.');
        }
    }

    async getMaxCardIndex (columnID) {

        const params = {
            TableName: this.tableName,
            IndexName: 'cardsByColumnIdAndIndex',
            KeyConditionExpression: 'columnID = :columnID',
            ExpressionAttributeValues: { ':columnID': columnID },
            ScanIndexForward: false,
            Limit: 1,
        };

        try {
            const { Items } = await dynamodb.send(new QueryCommand(params));
            if (Items.length > 0) {
                return Items[0].cardIndex;
            }
            return 0;
        }

        catch (error) {
            console.error('Error fetching maximum cardIndex:', error);
            throw new Error('Failed to get maximum cardIndex from the database');
        }
    }

}

module.exports = CardRepository;
