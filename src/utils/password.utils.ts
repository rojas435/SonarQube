import * as bcrypt from "bcrypt";

export class PasswordService{
    private readonly saltRounds: number = 10;


    /**
   * Hash a plain text password.
   * @param password - The plain text password.
   * @returns A hashed password.
   */
    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.saltRounds);
    }

    /**
   * Compare a plain text password with a hashed password.
   * @param plainPassword - The plain text password.
   * @param hashedPassword - The hashed password stored in the database.
   * @returns True if the passwords match, false otherwise.
   */
    async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}