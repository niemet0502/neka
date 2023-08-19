import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TeamVisibility } from '../teams.enum';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('number', { nullable: false })
  organization_id: number;

  @Column('text', { nullable: false })
  name: string;

  @Column('text')
  icon: string;

  @Column('text')
  identifier: string;

  @Column({
    type: 'enum',
    enum: TeamVisibility,
    default: TeamVisibility.PUBLIC,
  })
  visibility: TeamVisibility;
}