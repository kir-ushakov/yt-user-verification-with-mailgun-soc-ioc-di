import { AppError } from '../../../../shared/core/AppError';
import { Result } from '../../../../shared/core/Result';
import { UseCase } from '../../../../shared/core/UseCase';
import { UseCaseError } from '../../../../shared/core/UseCaseError';
import { User } from '../../../../shared/domain/models/user';
import { VerificationToken } from '../../../../shared/domain/values/user/verification-token';
import { UserRepo } from '../../../../shared/repo/user.repo';
import {
  IVerifyEmailRequestDTO,
  IVerifyEmailResponceDTO,
} from './verify-email.dto';

export class VerifyEmailUseCase
  implements
    UseCase<
      IVerifyEmailRequestDTO,
      Promise<Result<UseCaseError | IVerifyEmailResponceDTO>>
    >
{
  private _userRepo: UserRepo;

  constructor(userRepo: UserRepo) {
    this._userRepo = userRepo;
  }

  public async execute(
    dto: IVerifyEmailRequestDTO
  ): Promise<Result<UseCaseError | IVerifyEmailResponceDTO>> {
    try {
      const tokenId: string = dto.token;

      const token: VerificationToken = await this._userRepo.getTokenByTokenId(
        tokenId
      );
      if (!token) {
        // TODO: Potentially we can handle case if token not found (throw usecase error)
      }
      // TODO: verify that token not expired (throw usecase error)

      const user: User = await this._userRepo.findUserById(token.userId);

      user.verify();

      await this._userRepo.save(user);

      const response: IVerifyEmailResponceDTO = {
        email: user.username.value,
        firstName: user.firstname,
        lastName: user.lastname,
        verified: user.verified,
      };
      return Result.ok(response);
    } catch (error) {
      return new AppError.UnexpectedError(error);
    }
  }
}
