const lambdaTester = require('lambda-tester');
const sinon = require('sinon');
const { marshall } = require('@aws-sdk/util-dynamodb');
const createError = require('http-errors');
const CardService = require('../../../src/service/CardService');
const ColumnRepository = require('../../../src/repository/ColumnRepository');
const columnController = require('../../../src/controller/ColumnController');
const { describe, it } = require('mocha');
const expect = require('chai').expect;

describe('ColumnController', () => {
    // CREATE COLUMN
    it('should create a column', async () => {
        const event = {
            httpMethod: 'POST',
            body: { columnTitle: 'Test Column Title' },
            headers: { 'Content-Type': 'application/json' },
        };

        const createColumnStub = sinon
            .stub(ColumnRepository.prototype, 'createColumn')
            .resolves({
                columnID: 'mockColumnID',
                columnTitle: 'Test Column Title',
            });

        await lambdaTester(columnController.createColumn)
            .event(event)
            .expectResult((result) => {
                expect(result.statusCode).to.equal(200);
                const responseBody = JSON.parse(result.body);
                expect(responseBody.message).to.equal(
                    'Successfully added a column.',
                );
                expect(responseBody.data).to.exist;

                sinon.assert.calledOnceWithExactly(
                    createColumnStub,
                    'Test Column Title',
                );
                createColumnStub.restore();
            });
    });
    it('should throw an error', async () => {
        const missingParamsEvent = {
            httpMethod: 'POST',
            body: {},
            headers: { 'Content-Type': 'application/json' },
        };

        try {
            await lambdaTester(columnController.createColumn).event(
                missingParamsEvent,
            );
        } catch (error) {
            expect(error).to.be.instanceOf(createError.BadRequest);
            expect(error.message).to.equal('Column title is required.');
        }
    });

    // GET COLUMN
    it('should get a column', async () => {
        const event = {
            httpMethod: 'GET',
            pathParameters: { columnID: 'test' },
            headers: {},
        };

        const getColumnStub = sinon
            .stub(ColumnRepository.prototype, 'getColumn')
            .resolves(marshall({
                columnID: 'test',
                columnTitle: 'Test Column Title',
            }));

        await lambdaTester(columnController.getColumn)
            .event(event)
            .expectResult((result) => {
                expect(result.statusCode).to.equal(200);
                const responseBody = JSON.parse(result.body);
                expect(responseBody.message).to.equal(
                    'Successfully retrieved a column.',
                );
                expect(responseBody.data).to.exist;

                sinon.assert.calledOnceWithExactly(getColumnStub, 'test');
                getColumnStub.restore();
            });
    });
    it('should throw an error', async () => {
        const missingParamsEvent = {
            httpMethod: 'GET',
            pathParameters: {},
            headers: {},
        };

        try {
            await lambdaTester(columnController.getColumn).event(
                missingParamsEvent,
            );
        } catch (error) {
            expect(error).to.be.instanceOf(createError.BadRequest);
            expect(error.message).to.equal('Column ID is required.');
        }
    });

    // UPDATE COLUMN
    it('should update a column', async () => {
        const event = {
            httpMethod: 'PUT',
            pathParameters: { columnID: 'test123' },
            body: { columnTitle: 'Updated Column Title' },
            headers: { 'Content-Type': 'application/json' },
        };

        const updateColumnStub = sinon
            .stub(ColumnRepository.prototype, 'updateColumn')
            .resolves({
                columnID: 'test123',
                columnTitle: 'Updated Column Title',
            });

        await lambdaTester(columnController.updateColumn)
            .event(event)
            .expectResult((result) => {
                expect(result.statusCode).to.equal(200);
                const responseBody = JSON.parse(result.body);
                expect(responseBody.message).to.equal(
                    'Successfully updated a column.',
                );
                expect(responseBody.data).to.exist;

                sinon.assert.calledOnceWithExactly(
                    updateColumnStub,
                    'test123',
                    'Updated Column Title',
                );
                updateColumnStub.restore();
            });
    });
    it('should throw an error', async () => {
        const missingParamsEvent = {
            httpMethod: 'PUT',
            pathParameters: { columnID: 'test123' },
            body: {},
            headers: {},
        };

        try {
            await lambdaTester(columnController.updateColumn).event(
                missingParamsEvent,
            );
        } catch (error) {
            expect(error).to.be.instanceOf(createError.BadRequest);
            expect(error.message).to.equal(
                'Column ID or Column tilte is missed.',
            );
        }
    });

    // // DELETE COLUMN
    it('should delete a column', async () => {
        const event = {
            httpMethod: 'DELETE',
            pathParameters: { columnID: 'test' },
            headers: {},
        };

        const deleteColumnStub = sinon
            .stub(ColumnRepository.prototype, 'deleteColumn')
            .resolves({
                columnID: 'test',
            });

        const deleteCardsInBatchStub = sinon
            .stub(CardService.prototype, 'deleteCardsInBatch')
            .resolves([
                {
                    cardID: '123',
                    columnID: 'test',
                    cardTitle: 'test1',
                }, 
            ]);

        await lambdaTester(columnController.deleteColumn)
            .event(event)
            .expectResult((result) => {
                expect(result.statusCode).to.equal(200);
                const responseBody = JSON.parse(result.body);
                expect(responseBody.message).to.equal(
                    'Successfully deleted a column.',
                );
                expect(responseBody.data).to.exist;

                sinon.assert.calledOnceWithExactly(deleteColumnStub, 'test');
                sinon.assert.calledOnceWithExactly(deleteCardsInBatchStub, 'test');
                deleteColumnStub.restore();
                deleteCardsInBatchStub.restore();
            });
    });
    it('should throw an error', async () => {
        const missingParamsEvent = {
            httpMethod: 'DELETE',
            pathParameters: {},
            headers: {},
        };

        try {
            await lambdaTester(columnController.deleteColumn).event(
                missingParamsEvent,
            );
        } catch (error) {
            expect(error).to.be.instanceOf(createError.BadRequest);
            expect(error.message).to.equal('Column ID is required.');
        }
    });

    // // GET COLUMNS
    it('should get columns', async () => {
        const event = {
            httpMethod: 'GET',
            pathParameters: {},
            headers: {},
        };

        const getColumnsStub = sinon
            .stub(ColumnRepository.prototype, 'getColumns')
            .resolves([
                {
                    columnID: { S: 'test1' },
                    columnTitle: { S: 'Test Column 1' },
                },
                {
                    columnID: { S: 'test2' },
                    columnTitle: { S: 'Test Column 2' },
                },
            ]);

        await lambdaTester(columnController.getColumns)
            .event(event)
            .expectResult((result) => {
                expect(result.statusCode).to.equal(200);
                const responseBody = JSON.parse(result.body);
                expect(responseBody.message).to.equal(
                    'Successfully retrieved columns.',
                );
                expect(responseBody.data).to.exist;

                sinon.assert.calledOnce(getColumnsStub);
                getColumnsStub.restore();
            });
    });

    // // GET MAX COLUMN INDEX
    it('should get max column index', async () => {
        const event = {
            httpMethod: 'GET',
            pathParameters: {},
            headers: {},
        };

        const getMaxColumnIndexStub = sinon
            .stub(ColumnRepository.prototype, 'getMaxColumnIndex')
            .resolves(5);

        await lambdaTester(columnController.getMaxColumnIndex)
            .event(event)
            .expectResult((result) => {
                expect(result.statusCode).to.equal(200);
                const responseBody = JSON.parse(result.body);
                expect(responseBody.message).to.equal(
                    'Successfully get MaxColumnIndex.',
                );
                expect(responseBody.data).to.equal(5); 

                sinon.assert.calledOnce(getMaxColumnIndexStub);
                getMaxColumnIndexStub.restore();
            });
    });
    it('should throw an error', async () => {
        const missingParamsEvent = {
            httpMethod: 'GET',
            pathParameters: {},
            headers: {},
        };

        try {
            await lambdaTester(columnController.getMaxColumnIndex).event(
                missingParamsEvent,
            );
        } catch (error) {
            expect(error).to.be.instanceOf(createError.BadRequest);
            expect(error.message).to.equal(
                'There are no columns in the table.',
            );
        }
    });

    // // MOVE COLUMN
    it('should move a column', async () => {
        const event = {
            httpMethod: 'PUT',
            pathParameters: {
                columnID: 'test',
                prevColumnIndex: '1',
                nextColumnIndex: '3',
            },
            headers: {},
        };

        const moveColumnStub = sinon
            .stub(ColumnRepository.prototype, 'moveColumn')
            .resolves(2);

        await lambdaTester(columnController.moveColumn)
            .event(event)
            .expectResult((result) => {
                expect(result.statusCode).to.equal(200);
                const responseBody = JSON.parse(result.body);
                expect(responseBody.message).to.equal(
                    'Successfully moved a column.',
                );
                expect(responseBody.data).to.eql({ columnIndex: 2 });

                sinon.assert.calledOnceWithExactly(
                    moveColumnStub,
                    'test',
                    '1',
                    '3',
                );
                moveColumnStub.restore();
            });
    });
    it('should throw an error', async () => {
        const missingParamsEvent = {
            httpMethod: 'PUT',
            pathParameters: {},
            headers: {},
        };

        try {
            await lambdaTester(columnController.moveColumn).event(
                missingParamsEvent,
            );
        } catch (error) {
            expect(error).to.be.instanceOf(createError.BadRequest);
            expect(error.message).to.equal('Some path parameter is missed.');
        }
    });
});
