const {Model} = require("./model");

class Order extends Model{
    client_id;
    barber_id;
    date;
    state;
    constructor({id = undefined, client_id, barber_id, date, state}) {
        super(id);
        this.client_id = client_id;
        this.barber_id = barber_id;
        this.date = date;
        this.state = state;
    }
}

module.exports = Order;