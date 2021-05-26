import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useName = (prefix?: string) => {
    return useMemo(() => (prefix || '') + uuidv4(), [prefix]);
};