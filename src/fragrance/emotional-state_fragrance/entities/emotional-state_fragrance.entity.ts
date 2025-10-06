import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Fragrance } from '../../fragrance/entities/fragrance.entity';
import { EmotionalState} from "../../../scent_profiles/emotional-state/entities/emotional-state.entity";


@Entity()
// @Unique(['emotionalState', 'fragrance'])
export class EmotionalStateFragrance {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => EmotionalState, emotionalState => emotionalState.emotionalStateFragrance, { onDelete: 'CASCADE' })
    emotionalState: EmotionalState;

    // @ManyToOne(() => Fragrance, fragrance => fragrance.emotionalStateFragrance)
    // fragrance: Fragrance;
}
