import { UserResponse } from 'src/users/interfaces/user-response.interfaces';
import { ChildResponse } from '../../children/interfaces/children-response.interfaces';
import { SectorResponse } from '../../sectors/interfaces/sectores-response.interfaces';

export interface AffiliateResponse {
  id: string;
  dni: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  has_child: boolean;
  has_disable: boolean;
  gender: string;
  is_active: boolean;
  user?: UserResponse | null;
  sector: SectorResponse | null;
  Children: ChildResponse[];
}
