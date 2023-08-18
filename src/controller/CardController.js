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

const middyServices = [
    jsonBodyParser(),
    httpHeaderNormalizer(),
    httpErrorHandler(),
    errorLogger(),
    cors(),
    // cors({
    //     origins: [
    //         'https://d1ys6ezlk3fk60.cloudfront.net',
    //         'https://d3vsj6j2m25kwy.cloudfront.net',
    //         'https://d1jl1mdpr1jnx3.cloudfront.net',
    //     ],
    // }),
];

class CardController {
    

    async createCard(event) {

        const cardTitle = event.body.cardTitle;
        const columnID = event.pathParameters.columnID;

        console.log('BODY', event.body);
        console.log('PATH PARAMS', event.pathParameters);


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
    .use(middyServices);

controller.getCard = middy(controller.getCard)
    .use(middyServices);

controller.updateCard = middy(controller.updateCard)
    .use(middyServices);

controller.deleteCard = middy(controller.deleteCard)
    .use(middyServices);

controller.getCards = middy(controller.getCards)
    .use(middyServices);

controller.getCardsByColumnID = middy(controller.getCardsByColumnID)
    .use(middyServices);

controller.move = middy(controller.move)
    .use(middyServices);

controller.getMaxCardIndex = middy(controller.getMaxCardIndex)
    .use(middyServices);

module.exports = controller;
