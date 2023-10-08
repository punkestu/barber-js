const Validator = require("validatorjs");

Validator.register("isInteger", (value) => {
    return typeof value === 'number';
}, ":attribute must be integer", null);

Validator.register("exists", (_, requirement) => {
    return requirement;
}, ":attribute is not exists", null);

Validator.register("not_used", (_, requirement)=>{
    return !requirement;
},":attribute is used", null);

Validator.register("after_time", (value, requirement) => {
    return (value - requirement) > 0;
}, ":attribute must after requirement", null);

module.exports = Validator;