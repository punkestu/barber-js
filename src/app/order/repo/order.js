const db = require("../../../lib/db");
const OrderM = require("../../../domain/order");
const PersonM = require("../../../domain/person");
const ShiftM = require("../../../domain/shift");

class Order {
    #cacheMem = {};

    constructor() {
        this.CacheLoadForAdmin().then(() => {
            setInterval(async () => {
                await this.CacheLoadForAdmin();
            }, 30 * 60 * 1000);
        })
    }

    async Save(order) {
        if (!order.id) {
            return db.Insert("`Order`", {
                client_id: order.client_id,
                barber_id: order.barber_id,
                date: order.date
            }).then(order => {
                this.CacheLoadForAdmin().then();
                return new OrderM(order);
            });
        }
        await db.Update("`Order`", {
            client_id: order.client_id,
            barber_id: order.barber_id,
            date: order.date,
            state: order.state
        }, db.Where("id", order.id));
        this.CacheLoadForAdmin().then();
        return order;
    }

    Load({id, date, barber_id, client_id, state}, op = "AND") {
        return db.Query(`SELECT * FROM ${"`Order`"} WHERE ${db.Wheres({
            id, date, barber_id, client_id, state
        }, op)}`).then(orders => orders.map(order => new OrderM(order)));
    }

    LoadOne({id, date, barber_id, client_id, state}, op = "AND") {
        return db.QueryOne(`SELECT * FROM ${"`Order`"} WHERE ${db.Wheres({
            id, date, barber_id, client_id, state
        }, op)}`).then(order => new OrderM(order));
    }

    Ordered({date, barber_id}) {
        return db.QueryOne(
            `SELECT * FROM ${"`Order`"} WHERE barber_id=? AND ${"`date`"}>=?`,
            [barber_id, date]
        ).then(order => order ? new OrderM(order) : null);
    }

    async LoadForAdmin({id}, {start, limit}) {
        if (typeof id !== 'undefined') {
            return this.#cacheMem.LoadForAdmin.filter(c => c.id === parseInt(id)).slice(start, limit);
        }
        return this.#cacheMem.LoadForAdmin.slice(start, limit);
    }

    async CacheLoadForAdmin() {
        const today = new Date();
        today.setHours(0, 0, 0);
        this.#cacheMem.LoadForAdmin = await db.Query(`SELECT o.*, p.name, p.email, pi.nohp FROM ${"`Order`"} o ${"JOIN Person p ON (p.id=o.client_id)"} ${"JOIN PersonInfo pi ON (o.client_id=pi.person_id)"} WHERE o.${"`date`"}>=? ORDER BY o.state, o.${"`date`"}`, [today].filter(c => typeof c !== 'undefined'))
            .then(orders => orders.map(
                order => new OrderM({
                    ...order,
                    client: new PersonM({name: order.name, email: order.email, nohp: order.nohp})
                })
            ));
    }

    LoadOneIsValid(client_id) {
        const today = new Date();
        return db.QueryOne(`SELECT o.*, p.name as c_name, p.email as c_email, pi.alamat as c_alamat, pi.gender as c_gender, pb.name as b_name, pb.email as b_email, ${"s.start"}, s.day FROM ${"`Order`"} o ${"JOIN Person p ON (p.id=o.client_id)"} ${"LEFT JOIN PersonInfo pi ON (p.id=pi.person_id)"} ${"JOIN Barber b ON (o.barber_id=b.id)"} ${"JOIN Person pb ON (pb.id=b.barber_id)"} ${"JOIN Shift s ON (b.shift_id=s.id)"} WHERE o.${"`date`"}>=? AND o.client_id=? AND state='ORDERED' ORDER BY o.${"`date`"}`, [today, client_id])
            .then(order => order ? new OrderM({
                ...order,
                client: new PersonM({
                    name: order.c_name,
                    email: order.c_email,
                    alamat: order.c_alamat,
                    gender: order.c_gender
                }),
                barber: new PersonM({
                    name: order.b_name,
                    email: order.b_email
                }),
                shift: new ShiftM({
                    day: order.day,
                    start: new Date(`2000-01-01T${order.start}.000Z`)
                })
            }) : null);
    }

    ClearMy(client_id) {
        return db.Update("`Order`", {
            state: "ACCEPTED"
        }, db.Where("client_id", client_id))
            .then(() => {
                this.CacheLoadForAdmin().then();
            });
    }
}

module.exports = Order;