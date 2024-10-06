import { ConfigService, ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { Role, RoleSchema } from 'src/role/entities/role.entity';
import { UserService } from 'src/user/user.service';
import { RoleService } from 'src/role/role.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('ACCESS_TOKEN_SECRET'),
        // signOptions: {
        //   expiresIn: 3600,
        // },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserService, RoleService],
})
export class AuthModule {}
