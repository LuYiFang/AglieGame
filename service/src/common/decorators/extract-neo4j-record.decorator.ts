import * as _ from 'lodash';

export function HandleNeo4jResult(isMany: boolean = true) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);
      if (!result) {
        return null;
      }

      const targetResult = [];
      _.each(result.records, (record) => {
        console.log('record', record);
        const recordObject = record.get('u');
        if (!recordObject) return;

        const recordProperties = recordObject.properties;
        if (!recordProperties) return;

        targetResult.push({ id: recordObject.elementId, ...recordProperties });
      });

      if (isMany) return targetResult;
      return _.first(targetResult);
    };

    return descriptor;
  };
}
