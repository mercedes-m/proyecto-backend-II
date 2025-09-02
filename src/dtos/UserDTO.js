export class UserDTO {
  constructor(user) {
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.role = user.role;

    // Guardamos internamente la contraseña hasheada para validaciones
    // No se enviará en la respuesta de la API
    this._password = user.password;
  }

  // Método para serializar el DTO cuando se devuelve en la API
  toJSON() {
    const { _password, ...safeData } = this;
    return safeData;
  }
}