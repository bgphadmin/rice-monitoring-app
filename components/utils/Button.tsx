'use client';
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { ReloadIcon } from "@radix-ui/react-icons";
import { LuTrash2 } from "react-icons/lu";
import { FaHeart, FaRegEdit, FaRegHeart } from "react-icons/fa";
import { forwardRef } from "react";
// import { SignInButton } from "@clerk/nextjs";

type btnSize = 'default' | 'lg' | 'sm';

type SubmitButtonProps = {
  className?: string;
  text?: string;
  size?: btnSize;
  reloadLabel?: string;
};

export function SubmitButton({
  className = '',
  text = 'submit',
  size = 'lg',
  reloadLabel
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      type='submit'
      disabled={pending}
      className={cn('capitalize', className)}
      size={size}
    >
      {pending ? (
        <>
          <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
          { reloadLabel || 'Submitting...'}
        </>
      ) : (
        text
      )}
    </Button>
  )
}

type ActionType = "edit" | "delete";

interface IconButtonProps extends React.ComponentProps<typeof Button> {
  actionType: ActionType;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ actionType, className, ...props }, ref) => {
    const { pending } = useFormStatus();

    const renderIcon = () => {
      switch (actionType) {
        case "edit":
          return <FaRegEdit />;
        case "delete":
          return <LuTrash2 />;
        default:
          return null;
      }
    };

    return (
      <Button
        ref={ref}              // ✅ forward ref
        type="submit"
        size="icon"
        variant="link"
        className={`p-2 cursor-pointer ${className ?? ""}`}
        {...props}             // ✅ forward props (onClick, aria-* etc.)
      >
        {pending ? <ReloadIcon className="animate-spin" /> : renderIcon()}
      </Button>
    );
  }
);
IconButton.displayName = "IconButton";

// export const CardSignInButton = () => {
//   return (
//     <SignInButton mode='modal'>
//       <Button
//         type='button'
//         size='icon'
//         variant='outline'
//         className='p-2 cursor-pointer'
//         asChild
//       >
//         <FaRegHeart />
//       </Button>
//     </SignInButton>
//   );
// };

export const CardSubmitButton = ({ isFavorite }: { isFavorite: boolean }) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type='submit'
      size='icon'
      variant='outline'
      className=' p-2 cursor-pointer'
    >
      {pending ? (
        <ReloadIcon className=' animate-spin' />
      ) : isFavorite ? (
        <FaHeart />
      ) : (
        <FaRegHeart />
      )}
    </Button>
  );
};