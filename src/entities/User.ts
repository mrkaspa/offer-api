import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "varchar", length: 100 })
  firstName: string

  @Column({ type: "varchar", length: 100 })
  lastName: string

  @Column({ type: "varchar", length: 255, unique: true })
  email: string

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date
}
