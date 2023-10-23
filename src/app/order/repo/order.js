const {order: db} = require("../../../lib/prisma");
const OrderM = require("../../../domain/order");

class Order {
    async Save(order) {
        if (!order.id) {
            return db.create({
                data: {
                    ...order, id: undefined
                }
            }).then(order => new OrderM(order));
        }
        return db.update({
            data: order, where: {id: order.id}
        }).then(order => new OrderM(order));
    }

    Load({id, date, barber_id, client_id}, op = null) {
        if (op === "OR") {
            return db.findMany({
                where: {
                    OR: [{id}, {date}, {barber_id}, {client_id}]
                }
            }).then(orders => orders.map(order => new OrderM(order)));
        }
        return db.findMany({
            where: {
                AND: [{id}, {date}, {barber_id}, {client_id}]
            }
        }).then(orders => orders.map(order => new OrderM(order)));
    }

    LoadOne({id, date, barber_id, client_id}, op = null) {
        if (op === "OR") {
            return db.findFirst({
                where: {
                    OR: [{id}, {date}, {barber_id}, {client_id}]
                }
            }).then(order => new OrderM(order));
        }
        return db.findFirst({
            where: {
                AND: [{id}, {date}, {barber_id}, {client_id}]
            }
        }).then(order => new OrderM(order));
    }

    LoadForAdmin() {
        const today = new Date();
        today.setHours(0, 0, 0);
        return db.findMany({
            where: {
                date: {
                    gte: today
                }
            },
            include: {
                client: true
            },
            orderBy: [
                {state: "asc"},
                {date: "asc"},
            ]
        });
    }

    LoadOneIsValid(client_id) {
        const today = new Date();
        return db.findFirst({
                where: {
                    AND: [
                        {
                            date: {gte: today}
                        },
                        {client_id},
                        {state: "ORDERED"}
                    ]
                },
                include: {
                    client: true, barber: {
                        include: {
                            barber: true,
                            shift: true
                        }
                    }
                },
                orderBy: [
                    {
                        date: "asc"
                    }
                ]
            }
        );
    }
}

module.exports = Order;