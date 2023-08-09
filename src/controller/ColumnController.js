const ColumnService = require('../service/ColumnService');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

class ColumnController {

    constructor() {
        this.service = new ColumnService();
        this.createColumn = this.createColumn.bind(this);
        this.getColumn = this.getColumn.bind(this);
        this.updateColumn = this.updateColumn.bind(this);
        this.deleteColumn = this.deleteColumn.bind(this);
        this.getColumns = this.getColumns.bind(this);
        this.getSortedColumns = this.getSortedColumns.bind(this);
        this.getMaxColumnIndex = this.getMaxColumnIndex.bind(this);
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
            const columnTitle = JSON.parse(event.body).columnTitle;
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
            const  columnID  = event.pathParameters.columnIDVar;
            const Item = await this.service.getColumn(columnID);
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
            const  columnID  = event.pathParameters.columnIDVar;
            const  columnTitle  = JSON.parse(event.body).columnTitle;
            const operationResponse = await this.service.updateColumn(columnID, columnTitle);
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
            const  columnID  = event.pathParameters.columnIDVar;
            const operationResponse = await this.service.deleteColumn(columnID);
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

module.exports = new ColumnController();