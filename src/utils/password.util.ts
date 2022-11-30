import bcrypt from "bcrypt"

export async function getHashedPassword(password: string) {
    const saltRounds = 5;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt)

    return hashedPassword;
}
