const OrderM = require("../../../domain/order");

class Order {
    #repo;
    constructor(repo) {
        this.#repo = repo;
    }
    CreateOrder(date, client_id, barber_id) {
        return this.#repo.Save(new OrderM({client_id, barber_id, date}));
    }
}

module.exports = Order;