import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';

export const Permissions = Reflector.createDecorator<string[]>();
export const Public = () => SetMetadata('isPublic', true);
