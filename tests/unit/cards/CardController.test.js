const lambdaTester = require('lambda-tester');
const expect = require('chai').expect;
const sinon = require('sinon');
const { marshall } = require('@aws-sdk/util-dynamodb');
const createError = require('http-errors');
const CardService = require('../../../src/service/CardService');
const CardRepository = require('../../../src/repository/CardRepository');
const cardController = require('../../../src/controller/CardController');
const { describe, it } = require('mocha');

describe('CardController', () => {
    //CREATE CARD

    it('should create a card', async () => {
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({ cardTitle: 'Test Card Title' }),
            pathParameters: { columnID: 'test' },
            headers: { 'Content-Type': 'application/json' },
        };

        const createCardStub = sinon
            .stub(CardRepository.prototype, 'createCard')
            .resolves({
                cardID: 'mockCardID',
                columnID: 'test',
                cardIndex: 12345,
                cardTitle: 'Test Card Title',
            });

        await lambdaTester(cardController.createCard)
            .event(event)
            .expectResult((result) => {
                expect(result.statusCode).to.equal(200);
                const responseBody = JSON.parse(result.body);
                expect(responseBody.message).to.equal(
                    'Successfully added a card.',
                );
                expect(responseBody.data).to.exist;

                sinon.assert.calledOnceWithExactly(
                    createCardStub,
                    'test',
                    'Test Card Title',
                );
                createCardStub.restore();
            });
    });
    it('should throw an error', async () => {
        const missingParamsEvent = {
            httpMethod: 'POST',
            body: JSON.stringify({ cardTitle: 'Test Card' }),
            pathParameters: {},
            headers: { 'Content-Type': 'application/json' },
        };

        try {
            await lambdaTester(cardController.createCard).event(
                missingParamsEvent,
            );
        } catch (error) {
            expect(error).to.be.instanceOf(createError.BadRequest);
            expect(error.message).to.equal(
                'Column ID or Card tilte is missed.',
            );
        }
    });

    //GET CARD

    it('should get a card', async () => {
        const event = {
            httpMethod: 'GET',
            pathParameters: { cardID: 'test' },
            headers: {},

        };

        const getCardStub = sinon
            .stub(CardRepository.prototype, 'getCard')
            .resolves(marshall({
                cardID: 'test',
                columnID: 'test',
                cardIndex: 12345,
                cardTitle: 'Test Card Title',
            }));

        await lambdaTester(cardController.getCard)
            .event(event)
            .expectResult((result) => {
                expect(result.statusCode).to.equal(200);
                const responseBody = JSON.parse(result.body);
                expect(responseBody.message).to.equal(
                    'Successfully retrieved a card.',
                );
                expect(responseBody.data).to.exist;

                sinon.assert.calledOnceWithExactly(
                    getCardStub,
                    'test',
                );
                getCardStub.restore();
            });
    });
    it('should throw an error', async () => {
        const missingParamsEvent = {
            httpMethod: 'GET',
            pathParameters: {},
            headers: {},
        };

        try {
            await lambdaTester(cardController.getCard).event(
                missingParamsEvent,
            );
        } catch (error) {
            expect(error).to.be.instanceOf(createError.BadRequest);
            expect(error.message).to.equal(
                'Card ID is required.',
            );
        }
    });

    //UPDATE CARD

    it('should update a card', async () => {
        const event = {
            httpMethod: 'PUT',
            pathParameters: { cardID: 'test123' },
            body: JSON.stringify({ cardTitle: 'Test Card', cardDescription: 'Test description' }),
            headers: { 'Content-Type': 'application/json' },
            rawHeaders: { 'Content-Type': 'application/json' },

        };

        const updateCardStub = sinon
            .stub(CardRepository.prototype, 'updateCard')
            .resolves({
                cardID: 'test123',
                cardTitle: 'Test Card Title',
                cardDescription: 'Test description',
            });

        await lambdaTester(cardController.updateCard)
            .event(event)
            .expectResult((result) => {
                expect(result.statusCode).to.equal(200);
                const responseBody = JSON.parse(result.body);
                expect(responseBody.message).to.equal(
                    'Successfully updated a card.',
                );
                expect(responseBody.data).to.exist;

                const expectedArgs = [
                    'test123',
                    'Test Card',
                    'Test description',
                ];

                sinon.assert.calledOnceWithExactly(
                    updateCardStub,
                    ...expectedArgs,
                );
                updateCardStub.restore();
            });
    });
    it('should throw an error', async () => {
        const missingParamsEvent = {
            httpMethod: 'PUT',
            pathParameters: { cardID: 'test123' },
            body: {},
            headers: {},
        };

        try {
            await lambdaTester(cardController.updateCard).event(
                missingParamsEvent,
            );
        } catch (error) {
            expect(error).to.be.instanceOf(createError.BadRequest);
            expect(error.message).to.equal(
                'Card ID or Card tilte or Card description is missed.',
            );
        }
    });

    //DELETE CARD

    it('should delete a card', async () => {
        const event = {
            httpMethod: 'DELETE',
            pathParameters: { cardID: 'test' },
            headers: {},

        };

        const deleteCardStub = sinon
            .stub(CardRepository.prototype, 'deleteCard')
            .resolves(marshall({
                cardID: 'test',
            }));

        await lambdaTester(cardController.deleteCard)
            .event(event)
            .expectResult((result) => {
                expect(result.statusCode).to.equal(200);
                const responseBody = JSON.parse(result.body);
                expect(responseBody.message).to.equal(
                    'Successfully deleted a card.',
                );
                expect(responseBody.data).to.exist;

                sinon.assert.calledOnceWithExactly(
                    deleteCardStub,
                    'test',
                );
                deleteCardStub.restore();
            });
    });
    it('should throw an error', async () => {
        const missingParamsEvent = {
            httpMethod: 'DELETE',
            pathParameters: {},
            headers: {},
        };

        try {
            await lambdaTester(cardController.deleteCard).event(
                missingParamsEvent,
            );
        } catch (error) {
            expect(error).to.be.instanceOf(createError.BadRequest);
            expect(error.message).to.equal(
                'Card ID is required.',
            );
        }
    });

    //GET CARDS

    it('should get cards', async () => {
        const event = {
            httpMethod: 'GET',
            pathParameters: {},
            headers: {},
        };

        const getCardsStub = sinon
            .stub(CardRepository.prototype, 'getCards')
            .resolves([
                {
                    cardID: { S: 'test' },
                    columnID: { S: 'test' },
                    cardIndex: { N: '12345' },
                    cardTitle: { S: 'Test Card Title' },
                },
            ]);

        await lambdaTester(cardController.getCards)
            .event(event)
            .expectResult((result) => {
                expect(result.statusCode).to.equal(200);
                const responseBody = JSON.parse(result.body);
                expect(responseBody.message).to.equal(
                    'Successfully get cards.',
                );
                expect(responseBody.data).to.exist;

                sinon.assert.calledOnceWithExactly(
                    getCardsStub,
                );
                getCardsStub.restore();
            });
    });

    //GET CARDS BY COLUMN ID

    it('should get cards by column id', async () => {
        const event = {
            httpMethod: 'GET',
            pathParameters: { columnID: 'test' },
            headers: {},

        };

        const getCardsByColumnIDStub = sinon
            .stub(CardRepository.prototype, 'getCardsByColumnID')
            .resolves([
                {
                    cardID: { S: 'test' },
                    columnID: { S: 'test' },
                    cardIndex: { N: '12345' },
                    cardTitle: { S: 'Test Card Title' },
                },
            ]);

        await lambdaTester(cardController.getCardsByColumnID)
            .event(event)
            .expectResult((result) => {
                expect(result.statusCode).to.equal(200);
                const responseBody = JSON.parse(result.body);
                expect(responseBody.message).to.equal(
                    'Successfully get cards by columnID.',
                );
                expect(responseBody.data).to.exist;

                sinon.assert.calledOnceWithExactly(
                    getCardsByColumnIDStub,
                    'test',
                );
                getCardsByColumnIDStub.restore();
            });
    });
    it('should throw an error', async () => {
        const missingParamsEvent = {
            httpMethod: 'GET',
            pathParameters: {},
            headers: {},
        };

        try {
            await lambdaTester(cardController.getCardsByColumnID).event(
                missingParamsEvent,
            );
        } catch (error) {
            expect(error).to.be.instanceOf(createError.BadRequest);
            expect(error.message).to.equal(
                'Card ID is required.',
            );
        }
    });

    //MOVE CARD

    it('should move a card', async () => {
        const event = {
            httpMethod: 'PUT',
            pathParameters: { cardID: 'test', columnID: 'testColumn', prevCardIndex: '1', nextCardIndex: '3' },
            headers: {},

        };

        const moveCardStub = sinon
            .stub(CardRepository.prototype, 'moveCard')
            .resolves({
                cardIndex: 4500,
            });

        await lambdaTester(cardController.moveCard)
            .event(event)
            .expectResult((result) => {
                expect(result.statusCode).to.equal(200);
                const responseBody = JSON.parse(result.body);
                expect(responseBody.message).to.equal(
                    'Successfully moved card.',
                );
                expect(responseBody.data).to.exist;

                sinon.assert.calledOnceWithExactly(
                    moveCardStub,
                    'test',
                    'testColumn',
                    '1',
                    '3',
                );
                moveCardStub.restore();
            });
    });
    it('should throw an error', async () => {
        const missingParamsEvent = {
            httpMethod: 'PUT',
            pathParameters: {},
            headers: {},
        };

        try {
            await lambdaTester(cardController.moveCard).event(
                missingParamsEvent,
            );
        } catch (error) {
            expect(error).to.be.instanceOf(createError.BadRequest);
            expect(error.message).to.equal(
                'Some path parameter is missed.',
            );
        }
    });

    //GET MAX CARD INDEX

    it('should get max card index', async () => {
        const event = {
            httpMethod: 'GET',
            pathParameters: { columnID: 'test' },
            headers: {},

        };

        const getMaxCardIndexStub = sinon
            .stub(CardRepository.prototype, 'getMaxCardIndex')
            .resolves({
                columnID: 'test',
            });

        await lambdaTester(cardController.getMaxCardIndex)
            .event(event)
            .expectResult((result) => {
                expect(result.statusCode).to.equal(200);
                const responseBody = JSON.parse(result.body);
                expect(responseBody.message).to.equal(
                    'Successfully get MaxCardIndex.',
                );
                expect(responseBody.data).to.exist;

                sinon.assert.calledOnceWithExactly(
                    getMaxCardIndexStub,
                    'test',
                );
                getMaxCardIndexStub.restore();
            });
    });
    it('should throw an error', async () => {
        const missingParamsEvent = {
            httpMethod: 'GET',
            pathParameters: {},
            headers: {},
        };

        try {
            await lambdaTester(cardController.getMaxCardIndex).event(
                missingParamsEvent,
            );
        } catch (error) {
            expect(error).to.be.instanceOf(createError.BadRequest);
            expect(error.message).to.equal(
                'Column ID is required.',
            );
        }
    });

});

