import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PayloadJwtDto } from './dto/payload-jwt.dto';
import { User } from 'src/user/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private readonly userRepository: Model<User>,

    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: PayloadJwtDto): Promise<User> {
    const { email } = payload;
    const user = await this.userRepository
      .findOne({
        email,
      })
      .populate('role')
      .exec();

    if (!user) {
      throw new UnauthorizedException(`User ${email} is not authorized`);
    }
    return user;
  }
}
