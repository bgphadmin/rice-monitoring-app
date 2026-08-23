"use client"

import * as React from "react"
import { Button, type ButtonProps } from "@/components/ui/button"

const AddEmployeeButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children = "Add Employee", ...props }, ref) => {
        return (
            <Button ref={ref} type="button" className={className} variant="default" size="default" {...props}>
                {children}
            </Button>
        )
    }
)

AddEmployeeButton.displayName = "AddEmployeeButton"

export default AddEmployeeButton