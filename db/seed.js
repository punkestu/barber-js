const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const ShiftM = require("../src/domain/shift");
const ShiftR = new (require("../src/app/shift/repo/shift"))();
const BarberM = require("../src/domain/barber");
const BarberR = new (require("../src/app/barber/repo/barber"))();
const PersonR = new (require("../src/app/auth/repo/person"))();

require("dotenv").config();
require("../src/lib/db").Init({
    host     : process.env.DB_HOST || 'localhost',
    user     : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME
});

function toTime(time) {
    return new Date("1970-01-01T" + time);
}

async function shift() {
    DAYS.forEach(day => {
        let start = toTime("01:00");
        for (let i = 0; i < 24; i++) {
            const end = new Date(start.toISOString());
            end.setMinutes(end.getMinutes() + 30);
            ShiftR.Save(new ShiftM({
                start,
                end,
                day
            }));
            start = end;
        }
    });
}

async function barber(shifts, barbers) {
    barbers.forEach(barber => {
        shifts.forEach(shift => {
            BarberR.Save(new BarberM({
                barber_id: barber.id,
                shift_id: shift.id,
                active: true
            }));
        });
    });
}

async function main() {
    await BarberR.Delete();
    await ShiftR.Delete();
    await shift();
    const shifts = await ShiftR.Load({});
    const barbers = await PersonR.Load({role: "BARBER"});
    await barber(shifts, barbers);
}

main().then(()=>console.log("OK"));