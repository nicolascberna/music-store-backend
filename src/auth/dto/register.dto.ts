import { IsEmail, IsNotEmpty, MinLength } from "class-validator"

export class RegisterDto {
    @IsEmail({}, { message: "Invalid email" })
    email: string
    
    @IsNotEmpty({ message: "Password is required" })
    @MinLength(6, { message: "Password is too short. Minimum length is $constraint1 characters" })
    password: string
    
    @IsNotEmpty({ message: "Name is required" })
    username: string
}
