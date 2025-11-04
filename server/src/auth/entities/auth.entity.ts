import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../enum/enum';

@Entity('auth')
export class Auth {
  @PrimaryGeneratedColumn()
  auth_id: number;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
  })
  hash_password: string;

  @Column({ nullable: true })
  refresh_token?: string;

  @Column({ nullable: true })
  reset_password_token?: string;
  
  //   relationship to user
  @OneToOne(() => User, (auth) => auth.auth, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
