import { Transform } from 'class-transformer';

export function BooleanStringTransform() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return value;
  });
}
