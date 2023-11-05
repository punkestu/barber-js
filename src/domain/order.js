const {Model} = require("./model");

class Order extends Model{
    client_id;
    barber_id;
    date;
    state;
    client;
    barber;
    shift;
    constructor({id = undefined, client_id, barber_id, date, state, client, barber, shift}) {
        super(id);
        this.client_id = client_id;
        this.barber_id = barber_id;
        this.date = date;
        this.state = state;
        this.client = client;
        this.barber = barber;
        this.shift = shift;
    }
}

module.exports = Order;