const ColumnRepository = require('../repository/');
const CardService = require('../service/');

class ColumnService {

    constructor() {
        this.repository = new ColumnRepository();
        this.cardService = new CardService();
    }

    async createColumn (columnTitle) {

        return await this.repository.createColumn(columnTitle);
    }

    async getColumn (columnId) {

        return await this.repository.getColumn(columnId);

    }

    async updateColumn (columnId, columnTitle) {

        return await this.repository.updateColumn(columnId, columnTitle);

    }

    async deleteColumn (columnId) {

        await this.cardService.deleteCardsInBatch(columnId);

        return await this.repository.deleteColumn(columnId);

    }

    async getColumns () {

        return await this.repository.getColumns();

    }

    async getSortedColumns () {

        return await this.repository.getSortedColumns();

    }

    async getMaxColumnIndex () {

        return await this.repository.getMaxColumnIndex();
    }

}

module.exports = ColumnService;