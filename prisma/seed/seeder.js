const {PrismaClient} = require("@prisma/client");
const {Hash} = require("../../src/lib/crypto");
const client = new PrismaClient();

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function toTime(time) {
    return new Date("1970-01-01T" + time);
}

async function shift() {
    const shifts = [];
    DAYS.forEach(day => {
        let start = toTime("08:00");
        for (let i = 0; i < 24; i++) {
            const end = new Date(start.toISOString());
            end.setMinutes(end.getMinutes() + 30);
            shifts.push({
                start,
                end,
                day
            });
            start = end;
        }
    })
    await client.shift.createMany({
        data: shifts
    });
    return client.shift.findMany({});
}

async function person() {
    await client.person.createMany({
        data: [
            {
                name: "barber1",
                email: "barber1@mail.com",
                password: await Hash("barber1234"),
                role: "ADMIN"
            },
            {
                name: "barber2",
                email: "barber2@mail.com",
                password: await Hash("barber1234"),
                role: "ADMIN"
            }
        ]
    });
    return client.person.findMany({
        where: {
            role: "ADMIN"
        }
    })
}

async function barber(shifts, admins) {
    const barbers = [];
    admins.forEach(admin => {
        shifts.forEach(shift => {
            barbers.push({
                barber_id: admin.id,
                shift_id: shift.id,
                active: true
            })
        })
    });
    return client.barber.createMany({
        data: barbers
    });
}

async function seed() {
    await client.barber.deleteMany({});
    await client.person.deleteMany({});
    await client.shift.deleteMany({});
    const shifts = await shift();
    const admins = await person();
    await barber(shifts, admins);
}

seed().then(() => console.log("finish seeding"));