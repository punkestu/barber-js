class ErrNotFound extends Error {
    constructor(attribute) {
        super(`${attribute} is not found`);
        this.name = "Not Found";
    }
}

class ErrSchedule extends Error{
    constructor(why) {
        super(`schedule ${why}`);
    }
}

module.exports = {ErrNotFound, ErrSchedule};