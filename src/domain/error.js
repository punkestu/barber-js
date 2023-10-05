class ErrNotFound extends Error {
    constructor(attribute) {
        super(`${attribute} is not found`);
        this.name = "Not Found";
    }
}

module.exports = {ErrNotFound};