const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const httpHeaderNormalizer = require('@middy/http-header-normalizer');
const httpErrorHandler = require('@middy/http-error-handler');
const errorLogger = require('@middy/error-logger'); 
const cors = require('@middy/http-cors');
const createError = require('http-errors');

const baseResponse = require('../common/Response');

const ColumnService = require('../service/ColumnService');
const service = new ColumnService();

class ColumnController {

    async createColumn(event) {

        const columnTitle = event.body.columnTitle;

        if (!columnTitle) {
            throw createError.BadRequest('Column title is required.');
        }

        const operationResponse = await service.createColumn(columnTitle);

        return baseResponse(200, {
            message: 'Successfully added a column.',
            data: operationResponse,
        });
    }

    async getColumn(event) {

        const columnID = event.pathParameters.columnID;

        if (!columnID) {
            throw createError.BadRequest('Column ID is required.');
        }

        const Item = await service.getColumn(columnID);

        return baseResponse(200, {
            message: 'Successfully retrieved a column.',
            data: Item,
        });
    }

    async updateColumn(event) {

        const columnID = event.pathParameters.columnID;
        const columnTitle = event.body.columnTitle;

        if (!columnID || !columnTitle) {
            throw createError.BadRequest('Column ID or Column tilte is missed.');
        }
        const operationResponse = await service.updateColumn(columnID, columnTitle);

        return baseResponse(200, {
            message: 'Successfully updated a column.',
            data: operationResponse,
        });
    }

    async deleteColumn(event) {

        const columnID = event.pathParameters.columnID;

        if (!columnID) {
            throw createError.BadRequest('Column ID is required.');
        }
        const operationResponse = await service.deleteColumn(columnID);

        return baseResponse(200, {
            message: 'Successfully deleted a column.',
            data: operationResponse,
        });
    }

    async getColumns() {

        const Items = await service.getColumns();

        return baseResponse(200, {
            message: 'Successfully retrieved columns.',
            data: Items,
        });
    }

    async getMaxColumnIndex() {

        const columnIndex = await service.getMaxColumnIndex();

        return baseResponse(200, columnIndex > 0 ? {
            message: 'Successfully get MaxColumnIndex.',
            data: columnIndex,
        } : {
            message: 'There are no columns in the table.',
            data: columnIndex,
        });
    }

    
}

const controller = new ColumnController();

controller.createColumn = middy(controller.createColumn)
    .use([
        jsonBodyParser(),
        httpHeaderNormalizer(),
        httpErrorHandler(),
        errorLogger(),
        cors(),
    ]);

controller.getColumn = middy(controller.getColumn)
    .use([
        httpHeaderNormalizer(),
        httpErrorHandler(),
        errorLogger(),
        cors(),
    ]);

controller.updateColumn = middy(controller.updateColumn)
    .use([
        jsonBodyParser(),
        httpHeaderNormalizer(),
        httpErrorHandler(),
        errorLogger(),
        cors(),
    ]);

controller.deleteColumn = middy(controller.deleteColumn)
    .use([
        httpHeaderNormalizer(),
        httpErrorHandler(),
        errorLogger(),
        cors(),
    ]);

controller.getColumns = middy(controller.getColumns)
    .use([
        httpHeaderNormalizer(),
        httpErrorHandler(),
        errorLogger(),
        cors(),
    ]);

controller.getMaxColumnIndex = middy(controller.getMaxColumnIndex)
    .use([
        httpHeaderNormalizer(),
        httpErrorHandler(),
        errorLogger(),
        cors(),
    ]);

module.exports = controller;
