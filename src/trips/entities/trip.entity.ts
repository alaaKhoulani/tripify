import { Column, CreateDateColumn, DeleteDateColumn, Double, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Trip {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;
    @Column()
    contact_number: string;

    @Column()
    start_date: Date;

    @Column()
    end_date: Date;

    @Column()
    price: number;

    @Column()
    image: string;
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}