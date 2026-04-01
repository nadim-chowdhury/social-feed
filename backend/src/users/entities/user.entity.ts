import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Index({unique: true})
    @Column({unique: true})
    email: string

    @Column({select:false})
    password: string


    @Column({nullable:true})
    avatar: string
    
    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}