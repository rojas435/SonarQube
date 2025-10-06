import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Option } from "../../options/entities/option.entity";

@Entity()
export class ConceptualCategory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @OneToMany(() => Option, option => option.conceptualCategory, { onDelete: 'CASCADE' })
    options: Option[];
}
