class MechanicError extends Error {
  constructor(message) {
    super(message);
    this.name = "MechanicError";
  }
}

export { MechanicError };
