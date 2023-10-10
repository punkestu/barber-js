class Handler {
    #service;
    constructor(service) {
        this.#service = service;
    }
    CreateOrder = async (req,res) => {
        const client_id = req.user.id;
        const {date, barber_id} = req.body;
        try {
            const order = await this.#service.CreateOrder(date, client_id, barber_id);
            res.status(201).json(order);
        }catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
}

module.exports = Handler;