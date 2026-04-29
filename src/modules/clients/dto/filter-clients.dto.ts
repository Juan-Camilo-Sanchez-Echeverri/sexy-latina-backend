import { FilterDto } from '@common/dto';

import { ClientDocument } from '../schemas/client.schema';

export class FilterClientsDto extends FilterDto<ClientDocument> {}
