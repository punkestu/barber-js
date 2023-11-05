const OrderM = require("../../../domain/order");

class Order {
    #repo;
    #barberRepo;

    constructor(repo, barberRepo) {
        this.#repo = repo;
        this.#barberRepo = barberRepo;
    }

    async CreateOrder(date, client_id, barber_id) {
        const schedule = await this.#barberRepo.LoadOne({id: barber_id});
        date.setHours(schedule.shift.start.getHours(), schedule.shift.start.getMinutes());
        if (date < new Date()) {
            throw new Error("invalid schedule");
        }
        return this.#repo.Save(new OrderM({client_id, barber_id, date}));
    }

    GetMyTicket(client_id) {
        return this.#repo.LoadOneIsValid(client_id);
    }

    GetMyExpiredOrder(client_id) {
        return this.#repo.Load({client_id, state: "EXPIRED"});
    }

    async UpdateState(id, state) {
        const order = await this.#repo.LoadOne({id});
        if (!order) {
            throw new Error("not found");
        }
        order.state = state;
        return this.#repo.Save(order);
    }

    async ClearOrder(client_id) {
        return this.#repo.ClearMy(client_id);
    }

    async GetForAdmin({id}) {
        return this.#repo.LoadForAdmin({id});
    }
}

module.exports = Order;