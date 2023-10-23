const state = {
    schedulePill: null
};

function toggleSchedulePill(id) {
    const schedule = document.getElementById(`schedule-${id}`);
    if (!schedule) {
        return;
    }
    const prevSchedule = document.getElementById(`schedule-${state.schedulePill}`);
    if (prevSchedule) {
        prevSchedule.classList.remove("bg-blue-500");
        prevSchedule.classList.remove("text-white");
    }
    state.schedulePill = id;
    schedule.classList.add("bg-blue-500");
    schedule.classList.add("text-white");
}

function ClearCookies() {
    console.log("must be clear");
    const Cookies = document.cookie.split(';');
    for (let i = 0; i < Cookies.length; i++) {
        document.cookie = Cookies[i] + "=; expires=" + new Date(0).toUTCString();
    }
}