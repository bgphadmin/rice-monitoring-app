"use client"

import * as React from "react"
import { Button, type ButtonProps } from "@/components/ui/button"

const AddInventoryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children = "Add Rice Inventory", ...props }, ref) => {
        return (
            <Button ref={ref} type="button" className={className} variant="default" size="default" {...props}>
                {children}
            </Button>
        )
    }
)

AddInventoryButton.displayName = "AddInventoryButton"

export default AddInventoryButton
