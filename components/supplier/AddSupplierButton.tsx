"use client"

import * as React from "react"
import { Button, type ButtonProps } from "@/components/ui/button"

const AddSupplierButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children = "Add Supplier", ...props }, ref) => {
        return (
            <Button ref={ref} type="button" className={className} variant="default" size="default" {...props}>
                {children}
            </Button>
        )
    }
)

AddSupplierButton.displayName = "AddSupplierButton"

export default AddSupplierButton
