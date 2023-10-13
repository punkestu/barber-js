const OrderM = require("../../../domain/order");

class Order {
    #repo;

    constructor(repo) {
        this.#repo = repo;
    }

    CreateOrder(date, client_id, barber_id) {
        return this.#repo.Save(new OrderM({client_id, barber_id, date}));
    }

    GetMyTicket(client_id) {
        return this.#repo.LoadOneIsValid(client_id);
    }

    async UpdateState(id, state) {
        const order = await this.#repo.LoadOne({id});
        if (!order) {
            throw new Error("not found");
        }
        order.state = state;
        return this.#repo.Save(order);
    }

    async GetForAdmin() {
        return this.#repo.LoadForAdmin();
    }
}

module.exports = Order;