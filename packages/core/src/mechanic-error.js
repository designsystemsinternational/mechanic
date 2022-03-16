/**
 * An error class for Mechanic-related issues
 */
class MechanicError extends Error {
  constructor(message) {
    super(message);
    this.name = "MechanicError";
  }
}

class MechanicInputError extends MechanicError {
  constructor(message) {
    super(message);
    this.name = "MechanicInputError";
  }
}

export { MechanicError, MechanicInputError };
