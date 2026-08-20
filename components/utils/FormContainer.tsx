'use client';

import * as React from "react";
import { actionFunction } from "@/utils/types";
import { useFormState, useFormStatus } from "react-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";

const initialState = {
  message: '',
};

function FormContainer({
  action,
  children,
  onSuccess,
}: {
  action: actionFunction;
  children: (options: { loading: boolean }) => React.ReactNode;
  onSuccess?: (state: { message: string }) => void;
}) {
  const [state, formAction] = useFormState(action, initialState);
  const { pending } = useFormStatus();
  const lastMessage = React.useRef('');
  const latestOnSuccess = React.useRef(onSuccess);

  React.useEffect(() => {
    latestOnSuccess.current = onSuccess;
  }, [onSuccess]);

  React.useEffect(() => {
    if (pending) {
      lastMessage.current = '';
    }
  }, [pending]);

  useEffect(() => {
    if (!state.message) return;

    // Try to parse structured messages first so we can detect success even
    // when the raw message string repeats across submissions.
    let parsed;
    try {
      parsed = JSON.parse(state.message);
    } catch {
      // If it's plain text, avoid repeating the same toast until it's changed.
      if (state.message === lastMessage.current) return;
      lastMessage.current = state.message;
      toast.error(state.message);
      return;
    }

    type ParsedItem = { message?: string; result?: string };
    const successItem = Array.isArray(parsed)
      ? parsed.find((item): item is ParsedItem => typeof item === 'object' && item !== null && (item as ParsedItem).result === 'success')
      : undefined;

    // If the message is unchanged and it's not a success payload, skip it.
    if (state.message === lastMessage.current && !successItem) return;

    lastMessage.current = state.message;

    if (successItem) {
      const message = parsed[0]?.message ?? 'Action completed';
      toast.success(message);
      // Defer calling onSuccess to avoid sync re-render issues
      window.setTimeout(() => {
        latestOnSuccess.current?.(state);
      }, 0);
    } else {
      const errorMessages = parsed
        .map((err: { message: string }, index: number) => err.message && `${index + 1}. ${err.message}`)
        .filter(Boolean)
        .join('\n');
      toast.error(errorMessages || 'An error occurred');
    }
  }, [state.message, state]);
  return <form action={formAction} >{children({ loading: pending })}</form>;
}

export default FormContainer
