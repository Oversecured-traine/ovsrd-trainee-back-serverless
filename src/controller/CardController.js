const CardService = require('../service/');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

class CardController {

    constructor() {
        this.service = new CardService();
    }

    async createCard (event) {

        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        };

        try {
            const  cardTitle  = event.pathParameters.cardTitle;
            const  columnID  = event.pathParameters.columnID;
            const operationResponse = await this.service.createCard(columnID, cardTitle);
            response.body = JSON.stringify({
                message: 'Successfully added a card.',
                data: unmarshall(operationResponse),
            });
        } 
        
        catch (error) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                message: 'Failed to add a card.',
                errorMesagge: error.message,
                errorStack: error.stack,
            });
        }

        return response;
    }

    async getCard (event) {

        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        };

        try {
            const  cardId  = event.pathParameters.cardId;
            const Item = await this.service.getCard(cardId);
            response.body = JSON.stringify({
                message: 'Successfully retrieved a card.',
                data: (Item) ? unmarshall(Item) : {} ,
            });
        } 
        
        catch (error) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                message: 'Failed to retrieved a card.',
                errorMesagge: error.message,
                errorStack: error.stack,
            });
        }

        return response;
    }

    async updateCard (event) {

        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        };

        try {
            const  cardId  = event.pathParameters.cardId;
            const  cardTitle  = event.pathParameters.cardTitle;
            const operationResponse = await this.service.updateCard(cardId, cardTitle);
            response.body = JSON.stringify({
                message: 'Successfully updated a card.',
                data: (operationResponse) ? unmarshall(operationResponse) : {} ,
            });
        } 
        
        catch (error) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                message: 'Failed to update a card.',
                errorMesagge: error.message,
                errorStack: error.stack,
            });
        }

        return response;
    }

    async deleteCard (event) {

        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        };

        try {
            const  cardId  = event.pathParameters.cardId;
            const operationResponse = await this.service.deleteCard(cardId);
            response.body = JSON.stringify({
                message: 'Successfully deleted a card.',
                data: (operationResponse) ? unmarshall(operationResponse) : {} ,
            });
        } 
        
        catch (error) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                message: 'Failed to delete a card.',
                errorMesagge: error.message,
                errorStack: error.stack,
            });
        }

        return response;
    }

    async getCards (event) {

        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        };

        try {
            const Items = await this.service.getCards();
            response.body = JSON.stringify({
                message: 'Successfully get cards.',
                data: (Items) ? unmarshall(Items) : {} ,
            });
        } 
        
        catch (error) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                message: 'Failed to get card.',
                errorMesagge: error.message,
                errorStack: error.stack,
            });
        }

        return response;
    }

    async getCardsByColumnID (event) {

        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        };

        try {
            const  columnID  = event.pathParameters.columnID;
            const Items = await this.service.getCardsByColumnID(columnID);
            response.body = JSON.stringify({
                message: 'Successfully get cards by columnID.',
                data: (Items) ? unmarshall(Items) : {} ,
            });
        } 
        
        catch (error) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                message: 'Failed to get card by columnID.',
                errorMesagge: error.message,
                errorStack: error.stack,
            });
        }

        return response;
    }

    async getSortedCards (event) {

        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        };

        try {
            const Items = await this.service.getSortedCards();
            response.body = JSON.stringify({
                message: 'Successfully get sorted cards.',
                data: (Items) ? unmarshall(Items) : {} ,
            });
        } 
        
        catch (error) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                message: 'Failed to get sorted card.',
                errorMesagge: error.message,
                errorStack: error.stack,
            });
        }

        return response;
    }

    async move (event) {

        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        };

        try {
            const cardID = event.pathParameters.cardID;
            const columnID = event.pathParameters.columnID;
            const prevCardIndex = event.pathParameters.prevCardIndex;
            const nextCardIndex = event.pathParameters.nextCardIndex;

            const operationResponse = await this.service.move(cardID, columnID, prevCardIndex, nextCardIndex);
            response.body = JSON.stringify({
                message: 'Successfully get max card index.',
                data: (operationResponse) ? unmarshall(operationResponse) : {} ,
            });
        } 
        
        catch (error) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                message: 'Failed to get max card index.',
                errorMesagge: error.message,
                errorStack: error.stack,
            });
        }

        return response;
    }

    async getMaxCardIndex (event) {

        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        };

        try {
            const columnID = event.pathParameters.columnID;
            const cardIndex = await this.service.getMaxCardIndex(columnID);
            response.body = JSON.stringify({
                message: 'Successfully get max card index.',
                data: (cardIndex) ? unmarshall(cardIndex) : {} ,
            });
        } 
        
        catch (error) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                message: 'Failed to get max card index.',
                errorMesagge: error.message,
                errorStack: error.stack,
            });
        }

        return response;
    }
}

module.exports = CardController;