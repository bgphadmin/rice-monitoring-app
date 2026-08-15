"use client"

import * as React from "react"
import { Button, type ButtonProps } from "@/components/ui/button"

const AddStockLogButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children = "Add/Remove Rice Stock", ...props }, ref) => {
        return (
            <Button ref={ref} type="button" className={className} variant="default" size="default" {...props}>
                {children}
            </Button>
        )
    }
)

AddStockLogButton.displayName = "AddStockLogButton"

export default AddStockLogButton
