const { customAlphabet } = require('fix-esm').require('nanoid');
import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class AbstractEntity {
    @PrimaryGeneratedColumn({
        type: 'bigint'
    })
    id!: number;

    @Index({
        unique: true
    })
    @Column('varchar', { length: 21, unique: true })
    uid!: string;

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;

    @DeleteDateColumn()
    deletedAt?: Date;

    @BeforeInsert()
    generateUID() {
        if (!this.uid) {
            this.uid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 21)();
        }
    }
} 