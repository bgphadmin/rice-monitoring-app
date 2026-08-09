import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Prisma } from "@prisma/client";

type FormInputProps = {
  name: string;
  type: string;
  label?: string;
  defaultValue?: string | number;
  placeholder?: string;
};

export const FormTextInput = ({
  label,
  name,
  type,
  defaultValue,
  placeholder,
}: FormInputProps) => {
  return (
    <div className='flex flex-col w-full'>
      <Label htmlFor={name} className='capitalize mb-1'>
        {label || name}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="flex flex-col w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500"
        // required
      />
    </div>
  );
}


const stockKg = Prisma.RiceScalarFieldEnum.stockKg;
const reorderLevel = Prisma.RiceScalarFieldEnum.reorderLevel;

type FormInputNumberProps = {
  fieldName: typeof stockKg | typeof reorderLevel;
  defaultValue?: number;
};

export const FormStockAndReorderInput = ({ fieldName , defaultValue = 0 }: FormInputNumberProps) => {
  return (
    <div className='mb-2'>
      <Label htmlFor={fieldName} className='capitalize mb-1'>
        {fieldName === stockKg ? 'Stock (kg)' : fieldName === reorderLevel &&  'Reorder Level (kg)'}
      </Label>
      <Input
        id={fieldName}
        type='number'
        name={fieldName}
        min={0}
        step="0.25"
        defaultValue={defaultValue}
        required
      />
    </div>
  );
}