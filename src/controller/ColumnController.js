const ColumnService = require('../service/');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

class ColumnController {

    constructor() {
        this.service = new ColumnService();
    }

    async createColumn (event) {

        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        };

        try {
            const  columnTitle  = event.pathParameters.columnTitle;
            const operationResponse = await this.service.createColumn(columnTitle);
            response.body = JSON.stringify({
                message: 'Successfully added a column.',
                data: unmarshall(operationResponse),
            });
        } 
        
        catch (error) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                message: 'Failed to add a column.',
                errorMesagge: error.message,
                errorStack: error.stack,
            });
        }

        return response;
    }

    async getColumn (event) {

        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        };

        try {
            const  columnId  = event.pathParameters.columnId;
            const Item = await this.service.getColumn(columnId);
            response.body = JSON.stringify({
                message: 'Successfully retrieved a column.',
                data: (Item) ? unmarshall(Item) : {} ,
            });
        } 
        
        catch (error) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                message: 'Failed to retrieved a column.',
                errorMesagge: error.message,
                errorStack: error.stack,
            });
        }

        return response;
    }

    async updateColumn (event) {

        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        };

        try {
            const  columnId  = event.pathParameters.columnId;
            const  columnTitle  = event.pathParameters.columnTitle;
            const operationResponse = await this.service.updateColumn(columnId, columnTitle);
            response.body = JSON.stringify({
                message: 'Successfully updated a column.',
                data: (operationResponse) ? unmarshall(operationResponse) : {} ,
            });
        } 
        
        catch (error) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                message: 'Failed to update a column.',
                errorMesagge: error.message,
                errorStack: error.stack,
            });
        }

        return response;
    }

    async deleteColumn (event) {

        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        };

        try {
            const  columnId  = event.pathParameters.columnId;
            const operationResponse = await this.service.deleteColumn(columnId);
            response.body = JSON.stringify({
                message: 'Successfully вудуеув a column.',
                data: (operationResponse) ? unmarshall(operationResponse) : {} ,
            });
        } 
        
        catch (error) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                message: 'Failed to update a column.',
                errorMesagge: error.message,
                errorStack: error.stack,
            });
        }

        return response;
    }

    async getColumns (event) {

        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        };

        try {
            const Items = await this.service.getColumns();
            response.body = JSON.stringify({
                message: 'Successfully get columns.',
                data: (Items) ? unmarshall(Items) : {} ,
            });
        } 
        
        catch (error) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                message: 'Failed to get column.',
                errorMesagge: error.message,
                errorStack: error.stack,
            });
        }

        return response;
    }

    async getSortedColumns (event) {

        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        };

        try {
            const Items = await this.service.getSortedColumns();
            response.body = JSON.stringify({
                message: 'Successfully get sorted columns.',
                data: (Items) ? unmarshall(Items) : {} ,
            });
        } 
        
        catch (error) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                message: 'Failed to get sorted column.',
                errorMesagge: error.message,
                errorStack: error.stack,
            });
        }

        return response;
    }

    async getMaxColumnIndex (event) {

        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        };

        try {
            const columnIndex = await this.service.getMaxColumnIndex();
            response.body = JSON.stringify({
                message: 'Successfully get columns.',
                data: (columnIndex) ? unmarshall(columnIndex) : {} ,
            });
        } 
        
        catch (error) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                message: 'Failed to get column.',
                errorMesagge: error.message,
                errorStack: error.stack,
            });
        }

        return response;
    }
}

module.exports = ColumnController;