const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const httpHeaderNormalizer = require('@middy/http-header-normalizer');
const httpErrorHandler = require('@middy/http-error-handler');
const errorLogger = require('@middy/error-logger'); 
const cors = require('@middy/http-cors');
const createError = require('http-errors');

const baseResponse = require('../common/Response');

const CardService = require('../service/CardService');
const service = new CardService();


class CardController {


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

        const operationResponse = await service.createCard(columnID, cardTitle);

        return baseResponse(200, {
            message: 'Successfully added a card.',
            data: operationResponse,
        });
    }

    async getCard(event) {

        const cardID = event.pathParameters.cardID;

        if (!cardID) {
            throw createError.BadRequest('Card ID is required.');
        }
        const Item = await service.getCard(cardID);

        return baseResponse(200, {
            message: 'Successfully retrieved a card.',
            data: Item,
        });
    }

    async updateCard(event) {

        const cardID = event.pathParameters.cardID;
        const cardTitle = event.body.cardTitle;
        const cardDescription = event.body.cardDescription;

        if (!cardID || !cardTitle || !cardDescription) {
            throw createError.BadRequest('Card ID or Card tilte or Card description is missed.');
        }
        const operationResponse = await service.updateCard(cardID, cardTitle, cardDescription);

        return baseResponse(200, {
            message: 'Successfully updated a card.',
            data: operationResponse,
        });
    }

    async deleteCard(event) {

        const cardID = event.pathParameters.cardID;

        if (!cardID) {
            throw createError.BadRequest('Card ID is required.');
        }
        const operationResponse = await service.deleteCard(cardID);

        return baseResponse(200, {
            message: 'Successfully deleted a card.',
            data: operationResponse,
        });
    }

    async getCards(event) {

        const Items = await service.getCards();

        return baseResponse(200, {
            message: 'Successfully get cards.',
            data: Items,
        });
    }

    async getCardsByColumnID(event) {

        const columnID = event.pathParameters.columnID;

        if (!columnID) {
            throw createError.BadRequest('Column ID is required.');
        }
        const Items = await service.getCardsByColumnID(columnID);

        return baseResponse(200, {
            message: Items.length > 0 ? 'Successfully get cards by columnID.' : 'No cards by this columnID.',
            data: Items,
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

        const cardIndex = await service.move(cardID, columnID, prevCardIndex, nextCardIndex);

        return baseResponse(200, {
            message: 'Successfully moved card.',
            data: { 'New card index': cardIndex },
        });
    }

    async getMaxCardIndex(event) {

        const columnID = event.pathParameters.columnID;

        if (!columnID) {
            throw createError.BadRequest('Column ID is required.');
        }
        
        const cardIndex = await service.getMaxCardIndex(columnID);

        return baseResponse(200, {
            message: cardIndex !== 0 ? 'Successfully get MaxCardIndex.' : 'There are no cards in specified column.',
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
