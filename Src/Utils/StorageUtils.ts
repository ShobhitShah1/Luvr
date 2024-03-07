import {useMemo} from 'react';
import {LocalStorageFields, UserField} from '../Types/LocalStorageFields';

export const useFieldConfig = (fieldName: string): UserField => {
  const fieldConfig = useMemo(() => {
    return Object.entries(LocalStorageFields).find(
      ([_key, value]) => value === fieldName,
    );
  }, [fieldName]);

  return useMemo(() => {
    return fieldConfig
      ? (fieldConfig[0] as UserField)
      : (fieldName as UserField);
  }, [fieldConfig, fieldName]);
};
