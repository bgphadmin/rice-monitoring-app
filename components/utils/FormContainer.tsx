'use client';

import { actionFunction } from "@/utils/types";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";

const initialState = {
  message: '',
};

function FormContainer({
  action,
  children,
}: {
  action: actionFunction;
  children: React.ReactNode;
}) {
  const [state, formAction] = useFormState(action, initialState);
  useEffect(() => {
    if (state.message) {
      const parsedErrors = JSON.parse(state.message);
      const errorMessages = parsedErrors.map((err: { message: string }, index: number) =>  err.message &&  `${index + 1}. ${err.message}` + '\n');
      if (parsedErrors.length == 2 && parsedErrors[1].result == 'success' ) {
        toast.success(parsedErrors[0].message);
      } else {
        toast.error(errorMessages);
      }
    }
  }, [state]);
  return <form action={formAction}>{children}</form>;
}

export default FormContainer
