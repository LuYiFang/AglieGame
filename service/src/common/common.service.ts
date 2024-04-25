import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  static camelToSnake(key: string) {
    var result = key.replace(/([A-Z])/g, '_$1');
    return result.toUpperCase();
  }

  static sleep(millisecond: number) {
    return new Promise((resolve) => setTimeout(resolve, millisecond));
  }
}
