import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Option } from "../../options/entities/option.entity";
import { EmotionalStateFragrance } from "../../../fragrance/emotional-state_fragrance/entities/emotional-state_fragrance.entity";

@Entity()
@Unique(['name', 'option'])
export class EmotionalState {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @ManyToOne(() => Option, option => option.emotionalStates, { onDelete: 'CASCADE' })
    option: Option;

    @OneToMany(() => EmotionalStateFragrance, emotionalStateFragrance => emotionalStateFragrance.emotionalState, { onDelete: 'CASCADE' })
    emotionalStateFragrance: EmotionalStateFragrance[];

}
