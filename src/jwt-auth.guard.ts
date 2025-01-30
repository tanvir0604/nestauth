import { Injectable, UseFilters } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { HttpExceptionFilter } from "./http-exception.filter";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
