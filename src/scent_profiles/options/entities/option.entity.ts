import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ConceptualCategory } from "../../conceptual-category/entities/conceptual-category.entity";
import { EmotionalState } from "../../emotional-state/entities/emotional-state.entity";


@Entity()
@Unique(['name', 'conceptualCategory'])
export class Option {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @ManyToOne(() => ConceptualCategory, conceptualCategory => conceptualCategory.options, { onDelete: 'CASCADE' })
    conceptualCategory: ConceptualCategory;

    @OneToMany(() => EmotionalState, emotionalState => emotionalState.option, { onDelete: 'CASCADE' })
    emotionalStates: EmotionalState[];
}
