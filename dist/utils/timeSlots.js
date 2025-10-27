"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTimeSlots = generateTimeSlots;
function generateTimeSlots(startHour, endHour, interval) {
    const slots = [];
    const now = new Date();
    for (let time = startHour * 60; time <= endHour * 60; time += interval) {
        const h = Math.floor(time / 60);
        const m = time % 60;
        const label = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
        const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
        slots.push([label, date]);
    }
    return slots;
}
