import { Controller } from '@nestjs/common';
import { AffiliatesService } from './affiliates.service';

@Controller('affiliates')
export class AffiliatesController {
  constructor(private readonly affiliatesService: AffiliatesService) {}
}
