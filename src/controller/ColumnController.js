const createError = require('http-errors');
const applyMiddlewaresToAllMethods = require('../common/MiddyWrapper');
const baseResponse = require('../common/Response');
const ColumnService = require('../service/ColumnService');
const service = new ColumnService();

class ColumnController {

    async createColumn(event) {

        const columnTitle = event.body.columnTitle;

        if (!columnTitle) {
            throw createError.BadRequest('Column title is required.');
        }

        const column = await service.createColumn(columnTitle);

        return baseResponse(200, {
            message: 'Successfully added a column.',
            data: column,
        });
    }

    async getColumn(event) {

        const columnID = event.pathParameters.columnID;

        if (!columnID) {
            throw createError.BadRequest('Column ID is required.');
        }

        const column = await service.getColumn(columnID);

        return baseResponse(200, {
            message: 'Successfully retrieved a column.',
            data: column,
        });
    }

    async updateColumn(event) {

        const columnID = event.pathParameters.columnID;
        const columnTitle = event.body.columnTitle;

        if (!columnID || !columnTitle) {
            throw createError.BadRequest('Column ID or Column tilte is missed.');
        }
        const column = await service.updateColumn(columnID, columnTitle);

        return baseResponse(200, {
            message: 'Successfully updated a column.',
            data: column,
        });
    }

    async deleteColumn(event) {

        const columnID = event.pathParameters.columnID;

        if (!columnID) {
            throw createError.BadRequest('Column ID is required.');
        }
        const column = await service.deleteColumn(columnID);

        return baseResponse(200, {
            message: 'Successfully deleted a column.',
            data: column,
        });
    }

    async getColumns() {

        const columns = await service.getColumns();

        return baseResponse(200, {
            message: 'Successfully retrieved columns.',
            data: columns,
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

    async moveColumn(event) {

        const columnID = event.pathParameters.columnID;
        const prevColumnIndex = event.pathParameters.prevColumnIndex;
        const nextColumnIndex = event.pathParameters.nextColumnIndex;

        if (!columnID || !prevColumnIndex || !nextColumnIndex) {
            throw createError.BadRequest('Some path parameter is missed.');
        }

        const columnIndex = await service.moveColumn(columnID, prevColumnIndex, nextColumnIndex);

        return baseResponse(200, {
            message: 'Successfully moved a column.',
            data: { 'columnIndex': columnIndex },
        });
    }

    
}

const controller = new ColumnController();

applyMiddlewaresToAllMethods(controller);

module.exports = controller;
