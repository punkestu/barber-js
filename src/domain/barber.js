const {shift, person} = require("../lib/prisma");
const {Model} = require("./model");

class Barber extends Model{
    barber_id;
    shift_id
    active
    constructor({id, barber_id, shift_id, active}) {
        super(id);
        this.barber_id = barber_id;
        this.shift_id = shift_id;
        this.active = active;
    }
}

module.exports = Barber;