import { FilterDto } from '@common/dto';

import { CountryDocument } from '../schemas/country.schema';

export class FilterCountryDto extends FilterDto<CountryDocument> {}
