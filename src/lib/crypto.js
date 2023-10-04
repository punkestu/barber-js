const bcrypt = require("bcrypt");
const crypto = require('crypto');

const saltRounds = 10;
const algorithm = 'aes-256-cbc';
const key = Buffer.from([0xde, 0xa4, 0xf5, 0x1d, 0x1f, 0x1b, 0x93, 0x41, 0x52, 0x5c, 0xe9, 0x7f, 0xad, 0x43, 0x13, 0xd5, 0x03, 0x25, 0xcb, 0xb2, 0x00, 0xa4, 0x17, 0x02, 0x0b, 0xbe, 0x16, 0xf8, 0x39, 0xe1, 0xd5, 0xbe]);
const iv = Buffer.from([0x2c, 0xb2, 0xfb, 0x46, 0xaa, 0x6d, 0x14, 0x9e, 0xf1, 0xe9, 0x0a, 0x7f, 0xf4, 0xa9, 0x48, 0x29]);

module.exports = {
    Hash: async function (password) {
        return bcrypt.hash(password, saltRounds);
    },
    Verify: async function validateUser(password, hash) {
        return bcrypt.compare(password, hash);
    },
    Encrypt: function (plain) {
        let cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(plain, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    },
    Decrypt: function (chipper) {
        let decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(chipper, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}