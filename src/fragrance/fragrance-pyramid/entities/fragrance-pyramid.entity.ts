import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Fragrance } from "../../fragrance/entities/fragrance.entity";


@Entity()
export class FragrancePyramid {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @ManyToOne(() => Fragrance, fragrance => fragrance.fragrancePyramid, { onDelete: 'CASCADE' })
  // fragrance: Fragrance;

  @Column({ type: 'varchar', length: 50 })
  top: string;

  @Column({ type: 'varchar', length: 50 })
  heart: string;

  @Column({ type: 'varchar', length: 50 })
  base: string;
}
