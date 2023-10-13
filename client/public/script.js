const state = {
      schedulePill: null
};
function toggleSchedulePill(id){
      const schedule = document.getElementById(`schedule-${id}`);
      if(!schedule){
            return;
      }
      const prevSchedule = document.getElementById(`schedule-${state.schedulePill}`);
      if(prevSchedule){
            prevSchedule.classList.remove("bg-blue-500");
            prevSchedule.classList.remove("text-white");
      }
      state.schedulePill = id;
      schedule.classList.add("bg-blue-500");
      schedule.classList.add("text-white");
}