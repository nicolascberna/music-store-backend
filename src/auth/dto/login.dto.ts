import { IsEmail, IsNotEmpty } from "class-validator"

export class LoginDto {
    @IsEmail({}, { message: "Invalid email" })
    email: string

    @IsNotEmpty({ message: "Password is required" })
    password: string
}
// Compare this snippet from src/auth/dto/reset-password.dto.ts:
