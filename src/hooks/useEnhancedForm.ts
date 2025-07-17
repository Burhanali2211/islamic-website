import { useState, useCallback, useEffect, useRef } from 'react';
import { z } from 'zod';
import { FormValidator } from '../utils/formValidation';

export interface UseEnhancedFormOptions<T> {
  initialValues: T;
  validationSchema?: z.ZodSchema<T>;
  onSubmit?: (values: T) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  autoSave?: boolean;
  autoSaveKey?: string;
  autoSaveInterval?: number; // milliseconds
}

export interface FormState<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValidating: boolean;
  isDirty: boolean;
  isValid: boolean;
  submitCount: number;
}

export interface FormActions<T> {
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  setFieldTouched: (field: keyof T, touched: boolean) => void;
  setValues: (values: Partial<T>) => void;
  setErrors: (errors: Record<string, string>) => void;
  resetForm: () => void;
  validateField: (field: keyof T) => Promise<boolean>;
  validateForm: () => Promise<boolean>;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  handleReset: () => void;
  clearErrors: () => void;
  markAllTouched: () => void;
}

export function useEnhancedForm<T extends Record<string, any>>(
  options: UseEnhancedFormOptions<T>
): FormState<T> & FormActions<T> {
  const {
    initialValues,
    validationSchema,
    onSubmit,
    validateOnChange = true,
    validateOnBlur = true,
    autoSave = false,
    autoSaveKey,
    autoSaveInterval = 3000
  } = options;

  const validator = useRef(new FormValidator());
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);
  const initialValuesRef = useRef(initialValues);

  // Form state
  const [values, setValues] = useState<T>(() => {
    if (autoSave && autoSaveKey) {
      const saved = localStorage.getItem(`form_${autoSaveKey}`);
      if (saved) {
        try {
          return { ...initialValues, ...JSON.parse(saved) };
        } catch {
          return initialValues;
        }
      }
    }
    return initialValues;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  // Computed state
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValuesRef.current);
  const isValid = Object.keys(errors).length === 0;

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && autoSaveKey && isDirty) {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }

      autoSaveTimer.current = setTimeout(() => {
        localStorage.setItem(`form_${autoSaveKey}`, JSON.stringify(values));
      }, autoSaveInterval);
    }

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [values, autoSave, autoSaveKey, autoSaveInterval, isDirty]);

  // Validate single field
  const validateField = useCallback(async (field: keyof T): Promise<boolean> => {
    if (!validationSchema) return true;

    setIsValidating(true);
    
    try {
      // Create a schema for just this field
      const fieldSchema = validationSchema.pick({ [field]: true } as any);
      const fieldValue = { [field]: values[field] };
      
      const result = validator.current.validateForm(fieldValue, fieldSchema);
      
      if (result.isValid) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field as string];
          return newErrors;
        });
        return true;
      } else {
        setErrors(prev => ({
          ...prev,
          [field as string]: result.errors[field as string] || 'Invalid value'
        }));
        return false;
      }
    } catch (error) {
      console.error('Field validation error:', error);
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [validationSchema, values]);

  // Validate entire form
  const validateForm = useCallback(async (): Promise<boolean> => {
    if (!validationSchema) return true;

    setIsValidating(true);
    
    try {
      const result = validator.current.validateForm(values, validationSchema);
      setErrors(result.errors);
      return result.isValid;
    } catch (error) {
      console.error('Form validation error:', error);
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [validationSchema, values]);

  // Set field value
  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    if (validateOnChange) {
      // Debounce validation
      setTimeout(() => validateField(field), 300);
    }
  }, [validateOnChange, validateField]);

  // Set field error
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field as string]: error }));
  }, []);

  // Set field touched
  const setFieldTouched = useCallback((field: keyof T, isTouched: boolean) => {
    setTouched(prev => ({ ...prev, [field as string]: isTouched }));
    
    if (isTouched && validateOnBlur) {
      validateField(field);
    }
  }, [validateOnBlur, validateField]);

  // Set multiple values
  const setValuesMultiple = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({ ...prev, ...newValues }));
  }, []);

  // Set multiple errors
  const setErrorsMultiple = useCallback((newErrors: Record<string, string>) => {
    setErrors(prev => ({ ...prev, ...newErrors }));
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setSubmitCount(0);
    
    if (autoSave && autoSaveKey) {
      localStorage.removeItem(`form_${autoSaveKey}`);
    }
  }, [initialValues, autoSave, autoSaveKey]);

  // Handle form submission
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    setSubmitCount(prev => prev + 1);
    setIsSubmitting(true);

    try {
      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setTouched(allTouched);

      // Validate form
      const isFormValid = await validateForm();
      
      if (!isFormValid) {
        setIsSubmitting(false);
        return;
      }

      // Submit form
      if (onSubmit) {
        await onSubmit(values);
      }

      // Clear auto-saved data on successful submit
      if (autoSave && autoSaveKey) {
        localStorage.removeItem(`form_${autoSaveKey}`);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit, autoSave, autoSaveKey]);

  // Handle form reset
  const handleReset = useCallback(() => {
    resetForm();
  }, [resetForm]);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Mark all fields as touched
  const markAllTouched = useCallback(() => {
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);
  }, [values]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, []);

  return {
    // State
    values,
    errors,
    touched,
    isSubmitting,
    isValidating,
    isDirty,
    isValid,
    submitCount,
    
    // Actions
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setValues: setValuesMultiple,
    setErrors: setErrorsMultiple,
    resetForm,
    validateField,
    validateForm,
    handleSubmit,
    handleReset,
    clearErrors,
    markAllTouched
  };
}

// Helper hook for field-level operations
export function useFormField<T>(
  name: keyof T,
  formState: FormState<T>,
  formActions: FormActions<T>
) {
  const value = formState.values[name];
  const error = formState.errors[name as string];
  const touched = formState.touched[name as string];
  const hasError = !!error && touched;

  const onChange = useCallback((newValue: any) => {
    formActions.setFieldValue(name, newValue);
  }, [name, formActions]);

  const onBlur = useCallback(() => {
    formActions.setFieldTouched(name, true);
  }, [name, formActions]);

  const onFocus = useCallback(() => {
    // Clear error when field is focused
    if (error) {
      formActions.setFieldError(name, '');
    }
  }, [name, error, formActions]);

  return {
    value,
    error,
    touched,
    hasError,
    onChange,
    onBlur,
    onFocus,
    name: name as string
  };
}

// Hook for form arrays (dynamic fields)
export function useFormArray<T>(
  name: string,
  formState: FormState<any>,
  formActions: FormActions<any>
) {
  const values = formState.values[name] || [];

  const push = useCallback((value: T) => {
    const newValues = [...values, value];
    formActions.setFieldValue(name, newValues);
  }, [values, name, formActions]);

  const remove = useCallback((index: number) => {
    const newValues = values.filter((_: any, i: number) => i !== index);
    formActions.setFieldValue(name, newValues);
  }, [values, name, formActions]);

  const insert = useCallback((index: number, value: T) => {
    const newValues = [...values];
    newValues.splice(index, 0, value);
    formActions.setFieldValue(name, newValues);
  }, [values, name, formActions]);

  const move = useCallback((from: number, to: number) => {
    const newValues = [...values];
    const item = newValues.splice(from, 1)[0];
    newValues.splice(to, 0, item);
    formActions.setFieldValue(name, newValues);
  }, [values, name, formActions]);

  const replace = useCallback((index: number, value: T) => {
    const newValues = [...values];
    newValues[index] = value;
    formActions.setFieldValue(name, newValues);
  }, [values, name, formActions]);

  return {
    values,
    push,
    remove,
    insert,
    move,
    replace
  };
}
