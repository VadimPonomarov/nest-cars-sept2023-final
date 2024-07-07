import { ObjectMapMode } from '../enums/object.mapper.enums';

export class ObjectMapper {
  static async getMapped<T extends object>(
    obj: object,
    fields: string[] & (keyof T)[] = [],
    mode: ObjectMapMode = ObjectMapMode.OMIT,
  ): Promise<Partial<T>> {
    if (mode === ObjectMapMode.OMIT) {
      fields.forEach((item) => {
        delete obj[item];
      });
      return obj;
    } else {
      const _obj = {};
      fields.forEach((item) => {
        _obj[item] = obj[item];
      });
      return _obj;
    }
  }
}
