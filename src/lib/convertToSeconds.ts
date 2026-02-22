function convertToSeconds(value: string): number {
  const num = parseInt(value.slice(0, -1)); // "15m" -> 15
  const unit = value.slice(-1); // "m"

  switch (unit) {
    case 's':
      return num;
    case 'm':
      return num * 60;
    case 'h':
      return num * 60 * 60;
    case 'd':
      return num * 60 * 60 * 24;
    default:
      return num; // যদি unit না থাকে
  }
}

export { convertToSeconds };
