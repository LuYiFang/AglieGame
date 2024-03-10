import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  camelToSnake(key: string) {
    var result = key.replace(/([A-Z])/g, '_$1');
    return result.toUpperCase();
  }
}
