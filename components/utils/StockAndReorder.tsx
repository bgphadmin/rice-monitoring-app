import React from 'react'
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Prisma } from '@prisma/client';

const stockKg = Prisma.RiceScalarFieldEnum.stockKg;
const reorderLevel = Prisma.RiceScalarFieldEnum.reorderLevel;

type FormInputNumberProps = {
  fieldName: typeof stockKg | typeof reorderLevel;
  defaultValue?: number;
};

function StockAndReorderInput({ fieldName , defaultValue = 0 }: FormInputNumberProps) {
  return (
    <div className='mb-2'>
      <Label htmlFor={fieldName} className='capitalize'>
        {fieldName === stockKg ? 'Weight (kg)' : fieldName === reorderLevel &&  'Reorder Level (kg)'}
      </Label>
      <Input
        id={fieldName}
        type='number'
        name={fieldName}
        min={0}
        defaultValue={defaultValue}
        required
      />
    </div>
  );
}
export default StockAndReorderInput;
