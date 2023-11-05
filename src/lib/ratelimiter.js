class Mutex {
    queue = [];

    async Lock() {
        return new Promise(res => {
            this.queue.push(res);
            this.detach();
        })
    }

    detach() {
        if (this.queue[0]) {
            this.queue.shift()();
        }
    }

    Unlock() {
        this.detach();
    }
}

class User {
    id;
    nRequest;

    constructor(id) {
        this.id = id;
        this.nRequest = 0;
    }
}

class Ratelimiter {
    users;
    limit;
    interval;
    mutex;

    constructor(limit, interval) {
        this.users = [];
        this.limit = limit;
        this.interval = interval;
        this.mutex = new Mutex();
    }

    async addUser(id) {
        this.users.push(new User(id));
        setTimeout(async () => {
            await this.mutex.Lock();
            this.users.splice(this.users.length - 1, 1);
            this.mutex.Unlock();
        }, this.interval);
        return this.users[this.users.length - 1];
    }

    async checkUser(id) {
        return this.users.find(user => user.id === id);
    }

    expressMid = async (req, res, next) => {
        await this.mutex.Lock();
        const user = await this.checkUser(req.user.id)
            .then(user => user || this.addUser(req.user.id));
        this.mutex.Unlock();
        if (user.nRequest > this.limit) {
            return res.sendStatus(429);
        }
        next();
    }
}

module.exports = {Ratelimiter, Mutex};