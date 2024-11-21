import { HttpStatus } from "../http-status.ts";
import { HttpException } from "./http-exception.ts";

export class UnauthorizedException extends HttpException {
  constructor(message: string = "Unauthorized") {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
