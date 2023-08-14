const { unmarshall } = require('@aws-sdk/util-dynamodb');
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const httpHeaderNormalizer = require('@middy/http-header-normalizer');
const httpErrorHandler = require('@middy/http-error-handler');
const errorLogger = require('@middy/error-logger'); 
const cors = require('@middy/http-cors');
const createError = require('http-errors');

const CardService = require('../service/CardService');

class CardController {

    constructor() {

        this.service = new CardService();
        this.createCard = this.createCard.bind(this);
        this.getCard = this.getCard.bind(this);
        this.updateCard = this.updateCard.bind(this);
        this.deleteCard = this.deleteCard.bind(this);
        this.getCards = this.getCards.bind(this);
        this.getCardsByColumnID = this.getCardsByColumnID.bind(this);
        this.move = this.move.bind(this);
        this.getMaxCardIndex = this.getMaxCardIndex.bind(this);

    }

    baseResponse(statusCode, data) {

        return {
            statusCode: statusCode,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
    }

    async createCard(event) {

        const cardTitle = event.body.cardTitle;
        const columnID = event.pathParameters.columnID;

        if (!columnID || !cardTitle) {
            throw createError.BadRequest('Column ID or Card tilte is missed.');
        }

        const operationResponse = await this.service.createCard(columnID, cardTitle);

        return this.baseResponse(200, {
            message: 'Successfully added a card.',
            data: operationResponse,
        });
    }

    async getCard(event) {

        const cardID = event.pathParameters.cardID;

        if (!cardID) {
            throw createError.BadRequest('Card ID is required.');
        }
        const Item = await this.service.getCard(cardID);

        return this.baseResponse(200, {
            message: 'Successfully retrieved a card.',
            data: Item ? unmarshall(Item) : {},
        });
    }

    async updateCard(event) {

        const cardID = event.pathParameters.cardID;
        const cardTitle = event.body.cardTitle;
        const cardDescription = event.body.cardDescription;

        if (!cardID || !cardTitle || !cardDescription) {
            throw createError.BadRequest('Card ID or Card tilte or Card description is missed.');
        }
        const operationResponse = await this.service.updateCard(cardID, cardTitle, cardDescription);

        return this.baseResponse(200, {
            message: 'Successfully updated a card.',
            data: operationResponse,
        });
    }

    async deleteCard(event) {

        const cardID = event.pathParameters.cardID;

        if (!cardID) {
            throw createError.BadRequest('Card ID is required.');
        }
        const operationResponse = await this.service.deleteCard(cardID);

        return this.baseResponse(200, {
            message: 'Successfully deleted a card.',
            data: operationResponse,
        });
    }

    async getCards(event) {

        const Items = await this.service.getCards();

        return this.baseResponse(200, {
            message: 'Successfully get cards.',
            data: Items.map((item) => unmarshall(item)),
            rawData: Items,
        });
    }

    async getCardsByColumnID(event) {

        const columnID = event.pathParameters.columnID;

        if (!columnID) {
            throw createError.BadRequest('Column ID is required.');
        }
        const Items = await this.service.getCardsByColumnID(columnID);

        return this.baseResponse(200, Items.length > 0 ? {
            message: 'Successfully get cards by columnID.',
            data: Items.map((item) => unmarshall(item)),
        } : {
            message: 'No cards by this columnID.',
            data: {},
        });
    }

    async move(event) {

        const cardID = event.pathParameters.cardID;
        const columnID = event.pathParameters.columnID;
        const prevCardIndex = event.pathParameters.prevCardIndex;
        const nextCardIndex = event.pathParameters.nextCardIndex;

        if (!columnID || !cardID || !prevCardIndex || !nextCardIndex) {
            throw createError.BadRequest('Some path parameter is missed.');
        }

        const cardIndex = await this.service.move(cardID, columnID, prevCardIndex, nextCardIndex);

        return this.baseResponse(200, {
            message: 'Successfully moved card.',
            data: { 'New card index': cardIndex },
        });
    }

    async getMaxCardIndex(event) {

        const columnID = event.pathParameters.columnID;

        if (!columnID) {
            throw createError.BadRequest('Column ID is required.');
        }
        
        const cardIndex = await this.service.getMaxCardIndex(columnID);

        return this.baseResponse(200, cardIndex > 0 ? {
            message: 'Successfully get MaxCardIndex.',
            data: cardIndex,
        } : {
            message: 'There are no cards in specified column.',
            data: cardIndex,
        });
    }
}

const controller = new CardController();

controller.createCard = middy(controller.createCard)
    .use([
        jsonBodyParser(),
        httpHeaderNormalizer(),
        httpErrorHandler(),
        errorLogger(),
        cors(),
    ]);

controller.getCard = middy(controller.getCard)
    .use([
        httpHeaderNormalizer(),
        httpErrorHandler(),
        errorLogger(),
        cors(),
    ]);

controller.updateCard = middy(controller.updateCard)
    .use([
        httpHeaderNormalizer(),
        httpErrorHandler(),
        errorLogger(),
        cors(),
    ]);

controller.deleteCard = middy(controller.deleteCard)
    .use([
        httpHeaderNormalizer(),
        httpErrorHandler(),
        errorLogger(),
        cors(),
    ]);

controller.getCards = middy(controller.getCards)
    .use([
        httpHeaderNormalizer(),
        httpErrorHandler(),
        errorLogger(),
        cors(),
    ]);

controller.getCardsByColumnID = middy(controller.getCardsByColumnID)
    .use([
        httpHeaderNormalizer(),
        httpErrorHandler(),
        errorLogger(),
        cors(),
    ]);

controller.move = middy(controller.move)
    .use([
        httpHeaderNormalizer(),
        httpErrorHandler(),
        errorLogger(),
        cors(),
    ]);

controller.getMaxCardIndex = middy(controller.getMaxCardIndex)
    .use([
        httpHeaderNormalizer(),
        httpErrorHandler(),
        errorLogger(),
        cors(),
    ]);

module.exports = controller;
