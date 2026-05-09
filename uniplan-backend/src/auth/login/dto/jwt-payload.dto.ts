export class JwtPayloadDto {
  sub!: number;       
  username!: string;
  roles!: string[];
  permissions!: string[];
}