import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PasswordService } from 'src/utils/password.utils';


@Injectable()
export class UserService {


  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>, 
    private readonly passwordService: PasswordService
  ) {}


  async create(user: CreateUserDto) {
    const hashedPassword = await this.passwordService.hashPassword(user.password);
    const newUser = this.userRepository.create({
      ...user,
      password: hashedPassword, //Contraseña hasheada
    });
    return await this.userRepository.save(newUser);
    
  }

  getAll(): Promise<User[]> {
    console.log('UserService getAll called');
    return this.userRepository.find();
  }

  async findById(id: string): Promise<User> {
    console.log('UserService findById called with id:', id);
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      console.error(`User with id ${id} not found`);
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if(user == null) throw new Error(`User with email ${email} not found`);
    return user;
  }

  /*
  Recuerden que este metodo esta implementado como un patch, 
  por lo que NO es necesario enviar todos los campos del usuario, 
  solo los que se desean actualizar
  */
  async update(id: string, updateUser: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if(!user){
      throw new NotFoundException(`User with id ${id} not found`);
    }
    // Si se quiere cambiar la contraseña, validar currentPassword
    if (updateUser.password) {
      if (!updateUser.currentPassword) {
        throw new Error('Debes enviar la contraseña actual para cambiar la contraseña');
      }
      const isMatch = await this.passwordService.comparePasswords(updateUser.currentPassword, user.password);
      if (!isMatch) {
        throw new Error('La contraseña actual no es correcta');
      }
      updateUser.password = await this.passwordService.hashPassword(updateUser.password);
    }
    // Eliminar currentPassword antes de actualizar en la base de datos
    const { currentPassword, ...fieldsToUpdate } = updateUser;
    await this.userRepository.update(id, fieldsToUpdate);
    const updatedUser = await this.userRepository.findOneBy({ id });
    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found after update`);
    }
    return updatedUser;
  }

  async delete(id: string): Promise<User> {
    const user = await this.findById(id); // Lanza NotFoundException si no existe
    await this.userRepository.delete(id);
    return user;
  }
}
