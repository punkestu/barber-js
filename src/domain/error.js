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

class ErrTooManyReq extends Error {
    retryAfter;
    constructor(retryAfter) {
        super("too many request");
        this.retryAfter = retryAfter;
    }
}

module.exports = {ErrNotFound, ErrSchedule, ErrTooManyReq};