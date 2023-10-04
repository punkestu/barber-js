const jwt = require("jsonwebtoken");
const {Encrypt, Decrypt} = require("./crypto");
const secret = Buffer.from([0xde, 0xa4, 0xf5, 0x1d, 0x1f, 0x1b, 0x93, 0x41, 0x52, 0x5c, 0xe9, 0x7f, 0xad, 0x43, 0x13, 0xd5, 0x03, 0x25, 0xcb, 0xb2, 0x00, 0xa4, 0x17, 0x02, 0x0b, 0xbe, 0x16, 0xf8, 0x39, 0xe1, 0xd5, 0xbe]);

module.exports = {
    Sign: (payload) => {
        payload = Encrypt(JSON.stringify(payload));
        return jwt.sign({payload}, secret);
    },
    Verify: (token) => {
        let claim;
        try {
            const {payload} = jwt.verify(token, secret);
            claim = JSON.parse(Decrypt(payload));
        } catch (err) {
            throw err;
        }
        return claim;
    }
}