const {Model} = require("./model");

class Barber extends Model{
    barber_id;
    shift_id
    active
    shift;
    constructor({id, barber_id, shift_id, active, shift}) {
        super(id);
        this.barber_id = barber_id;
        this.shift_id = shift_id;
        this.active = active;
        this.shift = shift;
    }
}

module.exports = Barber;