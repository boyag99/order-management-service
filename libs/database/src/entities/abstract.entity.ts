const { nanoid } = require('fix-esm').require('nanoid');
import { BeforeInsert, CreateDateColumn, DeleteDateColumn, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class AbstractEntity {
    @PrimaryGeneratedColumn({
        type: 'bigint'
    })
    id!: number;

    @PrimaryColumn('varchar', { length: 21 })
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
            this.uid = nanoid();
        }
    }
} 