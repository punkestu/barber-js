const state = {
    schedulePill: null,
    scroll: {
        "scrollable-barber": 0
    }
};

document.addEventListener("htmx:afterSwap", function () {
    Object.keys(state.scroll).forEach((key) => {
        document.getElementById(key).scrollTo(0, state.scroll[key]);
    })
})

function trackScroll(key) {
    state.scroll[key] = document.getElementById(key).scrollTop;
}

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
    document.getElementById("schedule-cursor").value = id;
}

function ClearCookies() {
    const Cookies = document.cookie.split(';');
    for (let i = 0; i < Cookies.length; i++) {
        document.cookie = Cookies[i] + "=; expires=" + new Date(0).toUTCString();
    }
}