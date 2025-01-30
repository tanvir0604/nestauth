import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class NestAuthGuard extends AuthGuard("jwt") {}
