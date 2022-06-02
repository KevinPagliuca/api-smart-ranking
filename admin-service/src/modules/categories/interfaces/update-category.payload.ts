import { ICategory } from './category.interface';

export class UpdateCategoryPayload {
  id: string;
  data: Partial<ICategory>;
}
