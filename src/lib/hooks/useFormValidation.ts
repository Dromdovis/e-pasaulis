import { useState, useCallback } from 'react';
import { z } from 'zod';

export function useFormValidation<T extends z.ZodType>(schema: T) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(
    (data: unknown): data is z.infer<T> => {
      try {
        schema.parse(data);
        setErrors({});
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const formattedErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
            if (err.path[0]) {
              formattedErrors[err.path[0].toString()] = err.message;
            }
          });
          setErrors(formattedErrors);
        }
        return false;
      }
    },
    [schema]
  );

  return { errors, validate, setErrors };
} 