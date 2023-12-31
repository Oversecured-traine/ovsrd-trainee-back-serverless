const { unmarshall, marshall } = require('@aws-sdk/util-dynamodb');
const CardRepository = require('../repository/CardRepository');

class CardService {

    constructor() {
        
        this.repository = new CardRepository();
    }

    async createCard (columnID, cardTitle) {

        return await this.repository.createCard(columnID, cardTitle);
    }

    async getCard (cardID) {

        const Item =  await this.repository.getCard(cardID);

        return Item ? unmarshall(Item) : {};

    }

    async updateCard (cardID, cardTitle, cardDescription) {

        return await this.repository.updateCard(cardID, cardTitle, cardDescription);

    }

    async updateCardImage (cardID) {

        return await this.repository.updateCardImage(cardID);

    }

    async deleteCard (cardID) {

        return await this.repository.deleteCard(cardID);

    }

    async deleteCardsInBatch (columnID) {
        
        const Items = await this.getCardsByColumnID(columnID);
        const marshalledItems = Items.map((item) => marshall(item));
        return Items.length > 0 ? await this.repository.deleteCardsInBatch(marshalledItems) : 'No cards to delete';

    }

    async getCards () {

        const Items =  await this.repository.getCards();
        const unmarshalledItems = Items.map((item) => unmarshall(item));

        return unmarshalledItems;

    }

    async getCardsByColumnID (columnID) {

        const Items = await this.repository.getCardsByColumnID(columnID);
        const unmarshalledItems = Items.map((item) => unmarshall(item));

        return unmarshalledItems;

    }

    async moveCard (cardID, columnID, prevCardIndex, nextCardIndex) {

        return await this.repository.moveCard(cardID, columnID, prevCardIndex, nextCardIndex);

    }

    async getMaxCardIndex (columnID) {

        return await this.repository.getMaxCardIndex(columnID);
    }

}

module.exports = CardService;