const {Model} = require("./model");

class Shift extends Model{
    start;
    end;
    day;
    constructor({id, start, end, day}) {
        super(id);
        this.start = start;
        this.end = end;
        this.day = day;
    }
}

module.exports = Shift;