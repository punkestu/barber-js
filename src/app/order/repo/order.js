const {order: db} = require("../../../lib/prisma");
const OrderM = require("../../../domain/order");

class Order {
    Save(order) {
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
}

module.exports = Order;