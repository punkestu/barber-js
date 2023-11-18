const OrderM = require("../../../domain/order");
const {ErrSchedule} = require("../../../domain/error");
const {Mutex} = require("../../../lib/ratelimiter");

class Order {
    #repo;
    #barberRepo;
    #mutex;

    constructor(repo, barberRepo) {
        this.#repo = repo;
        this.#barberRepo = barberRepo;
        this.#mutex = new Mutex();
    }

    async CreateOrder(date, client_id, barber_id) {
        await this.#mutex.Lock();
        const schedule = await this.#barberRepo.LoadOne({id: barber_id});
        date.setHours(schedule.shift.start.getHours(), schedule.shift.start.getMinutes(), 0, 0);
        if (date < new Date()) {
            throw new ErrSchedule("was passed");
        }
        const order = await this.#repo.Ordered({date, barber_id});
        if (order) {
            this.#mutex.Unlock();
            throw new ErrSchedule("was ordered");
        }
        const newOrder = await this.#repo.Save(new OrderM({client_id, barber_id, date}));
        this.#mutex.Unlock();
        this.#barberRepo.CacheLoadByBarber({day: schedule.shift.day}).then();
        return newOrder;
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

    async GetForAdmin({id}, {page}) {
        return this.#repo.LoadForAdmin({id}, {start: page * 10, limit: 10});
    }
}

module.exports = Order;