import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column()
    isSender: boolean;

    @ManyToOne(() => User, (user) => user.messages, { cascade: true })
    user: User;


    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

}