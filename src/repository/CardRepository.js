const dynamodb = require('../common/Dynamo');
const { GetItemCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand, ScanCommand, QueryCommand, BatchWriteItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const { v4: uuidv4 } = require('uuid');


class CardRepository {

    constructor() {
        
        this.tableName = process.env.CARDS_TABLE_NAME;
        this.MIN_INDEX = 3000;
    }

    async createCard (columnID, cardTitle)  {

        const cardID = uuidv4();

        const maxIndex  = await this.getMaxCardIndex(columnID);
        const cardIndex = maxIndex + this.MIN_INDEX;
        const hasImage = false;

        console.log('cardIndex:', cardIndex);
        console.log('columnID:', columnID);

        const params = {
            TableName: this.tableName,
            Item: marshall({ cardID, columnID, cardIndex, cardTitle, hasImage }),
        };
        await dynamodb.send(new PutItemCommand(params));

        return { cardID, columnID, cardIndex, cardTitle, hasImage };

    }

    async getCard (cardID)  {
        
        const params = {
            TableName: this.tableName,
            Key: marshall({ cardID }),
        };

        const { Item } = await dynamodb.send(new GetItemCommand(params));

        return Item;

    }

    async updateCard (cardID, cardTitle, cardDescription)  {

        console.log('updateCard', {cardID, cardTitle, cardDescription});

        const params = {
            TableName: this.tableName,
            Key: marshall({ cardID }),
            UpdateExpression: 'SET #attr = :val, #descAttr = :descVal', 
            ExpressionAttributeNames: { '#attr': 'cardTitle', '#descAttr': 'cardDescription' },
            ExpressionAttributeValues: marshall({
                ':val': cardTitle,
                ':descVal': cardDescription,
            }),
        };
        await dynamodb.send(new UpdateItemCommand(params));

        return { cardID, cardTitle, cardDescription };

    }

    async updateCardImage (cardID)  {

        const params = {
            TableName: this.tableName,
            Key: marshall({ cardID }),
            UpdateExpression: 'SET #attr = :val', 
            ExpressionAttributeNames: { '#attr': 'hasImage' },
            ExpressionAttributeValues: marshall({
                ':val': true,
            }),
        };
        await dynamodb.send(new UpdateItemCommand(params));

        return { cardID };

    }

    async deleteCard (cardID)  {

        const params = {
            TableName: this.tableName,
            Key: marshall({ cardID }),
        };
        await dynamodb.send(new DeleteItemCommand(params));

        return cardID;

    }

    async getCardsByColumnID(columnID) {
        const params = {
            TableName: this.tableName,
            IndexName: 'cardsByColumnIdAndIndex',
            KeyConditionExpression: 'columnID = :columnID',
            ExpressionAttributeValues: { ':columnID': { S: columnID } },
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

        console.log('deleteCardsInBatch', items);

        const deleteRequests = items.map((item) => ({
            DeleteRequest: {
                Key: {
                    cardID: { S: item.cardID.S },
                },
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
            return items;
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

    async moveCard (cardID, columnID, prevCardIndex, nextCardIndex ) {
        console.log('move f in repository', {cardID, columnID, prevCardIndex, nextCardIndex});
        let cardIndex = 0;
        if(+prevCardIndex === 0 && +nextCardIndex === 0) {
            cardIndex = this.MIN_INDEX;
        }
        else if(+prevCardIndex === 0){
            cardIndex = +nextCardIndex / 2;
        }
        else if(+nextCardIndex === 0) {
            cardIndex = +prevCardIndex + (+prevCardIndex / 2);
        }
        else {
            cardIndex = (+prevCardIndex + +nextCardIndex) / 2;
        }

        console.log('cardIndex', cardIndex);


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
            return cardIndex;
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
            ExpressionAttributeValues: marshall({ ':columnID':  columnID }),
            ScanIndexForward: false,
            Limit: 1,
        };

        try {
            const { Items } = await dynamodb.send(new QueryCommand(params));
            return Items && Items.length > 0 ? unmarshall(Items[0]).cardIndex : 0;
        }
        

        catch (error) {
            console.error('Error fetching maximum cardIndex:', error);
            throw new Error('Failed to get maximum cardIndex from the database');
        }
    
    }
}

module.exports = CardRepository;
