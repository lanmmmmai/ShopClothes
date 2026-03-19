export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}
