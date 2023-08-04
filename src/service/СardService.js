const CardRepository = require('../repository/');

class CardService {

    constructor() {
        this.repository = new CardRepository();
    }

    async createCard (columnID, cardTitle) {

        return await this.repository.createCard(columnID, cardTitle);
    }

    async getCard (cardId) {

        return await this.repository.getCard(cardId);

    }

    async updateCard (cardId, cardTitle) {

        return await this.repository.updateCard(cardId, cardTitle);

    }

    async deleteCard (cardId) {

        return await this.repository.deleteCard(cardId);

    }

    async deleteCardsInBatch (columnID) {
        
        const Items = await this.getCardsByColumnID(columnID);

        return await this.repository.deleteCardsInBatch(Items);

    }

    async getCards () {

        return await this.repository.getCards();

    }

    async getCardsByColumnID (columnID) {

        return await this.repository.getCardsByColumnID(columnID);

    }

    async getSortedCards () {

        return await this.repository.getSortedCards();

    }

    async move (cardID, columnID, prevCardIndex, nextCardIndex) {

        return await this.repository.move(cardID, columnID, prevCardIndex, nextCardIndex);

    }

    async getMaxCardIndex (columnID) {

        return await this.repository.getMaxCardIndex(columnID);
    }

}

module.exports = CardService;