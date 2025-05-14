import { Transform } from 'class-transformer';

export function BooleanStringTransform() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value;
  });
}
