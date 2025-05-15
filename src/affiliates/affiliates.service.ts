import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AffiliatesService {
  constructor(private readonly database: DatabaseService) {}
}
