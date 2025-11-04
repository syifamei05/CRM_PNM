import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    signup(CreateUserDto: CreateUserDto): Promise<{
        message: string;
        data: import("./dto/get-user.dto").GetUserDto;
    }>;
}
