/**
 * An error class for Mechanic-related issues
 */
class MechanicError extends Error {
  constructor(message) {
    super(message);
    this.name = "MechanicError";
  }
}

export { MechanicError };
