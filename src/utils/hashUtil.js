import bcrypt from 'bcrypt';

// Encripta la contraseña
export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Valida contraseña (para login)
export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
};