import { ValidationOptions, registerDecorator } from 'class-validator';
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
        const recordObject = record.get('u');
        if (!recordObject) return;

        let recordProperties = recordObject.properties;
        if (!recordProperties) {
          recordProperties = recordObject;
        }

        targetResult.push({ id: recordObject.elementId, ...recordProperties });
      });

      if (isMany) return targetResult;
      return _.first(targetResult);
    };

    return descriptor;
  };
}

export function ExcludePropertyValues(
  values: Array<string>,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'excludePropertyValues',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [values],
      options: validationOptions,
      validator: {
        validate(value, args) {
          return !values.includes(value);
        },
        defaultMessage(args) {
          return `The following values are not allowed for the ${args.property} property: ${values.join(', ')}`;
        },
      },
    });
  };
}
