"use client";

import { addRiceItem } from "@/utils/actions";
import FormContainer from "../utils/FormContainer";
import { SubmitButton } from "../utils/Button";
import { FormStockAndReorderInput, FormTextInput } from "../utils/FormInput";
import { useEffect, useRef } from "react";


const buttonClass = 'inline-flex items-center justify-center rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

export default function RiceForm() {

  const rootRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (!formRef.current) {
      formRef.current = rootRef.current?.querySelector('form') ?? null;
    }
  }, []);

  return (
    <div ref={rootRef} className='border p-8 rounded-md'>
      <FormContainer
        action={async (prevState, formData) => {
          const result = await addRiceItem(prevState, formData);
          // Only clear if success
          if (result.message.toLowerCase().includes('"result": "success"')) {
            formRef.current?.reset();
          }
          return result;
        }}
      >
        <div className='grid gap-4 md:grid-cols-3 my-4'>
          <FormTextInput
            type='text'
            name='name'
            label='Rice Variety'
          />
          <FormStockAndReorderInput fieldName='stockKg' />
          <FormStockAndReorderInput fieldName='reorderLevel' />
          <FormTextInput
            type='text'
            name='comment'
            label='Comment'
            placeholder="e.g. price per kilo"
          />
        </div>
        <SubmitButton text='Save' className={buttonClass} reloadLabel="Saving..." />
      </FormContainer>
    </div >
  );
}