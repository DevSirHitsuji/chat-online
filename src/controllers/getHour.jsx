export default function getHour() {
    let currentDate = new Date;
    let hour = (currentDate.getHours()<10 ? '0' : "") + currentDate.getHours();
    let minutes = (currentDate.getMinutes()<10 ? '0' : "") + currentDate.getMinutes();
    return `${hour}:${minutes}`
}