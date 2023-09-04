const { unmarshall } = require('@aws-sdk/util-dynamodb');
const ColumnRepository = require('../repository/ColumnRepository');
const CardService = require('../service/CardService');

class ColumnService {

    constructor() {
        
        this.repository = new ColumnRepository();
        this.cardService = new CardService();
    }

    async createColumn (columnTitle) {

        return await this.repository.createColumn(columnTitle);
    }

    async getColumn (columnId) {

        const Item = await this.repository.getColumn(columnId);
        return Item ? unmarshall(Item) : {};

    }

    async updateColumn (columnId, columnTitle) {

        return await this.repository.updateColumn(columnId, columnTitle);

    }

    async deleteColumn (columnId) {

        await this.cardService.deleteCardsInBatch(columnId);

        return await this.repository.deleteColumn(columnId);

    }

    async getColumns () {

        const Items =  await this.repository.getColumns();
        const unmarshalledItems = Items.map((item) => unmarshall(item));

        return  unmarshalledItems;

    }

    async getMaxColumnIndex () {

        return await this.repository.getMaxColumnIndex();
    }

    async moveColumn (columnID, prevColumnIndex, nextColumnIndex) {

        return await this.repository.moveColumn(columnID, prevColumnIndex, nextColumnIndex);

    }

}

module.exports = ColumnService;