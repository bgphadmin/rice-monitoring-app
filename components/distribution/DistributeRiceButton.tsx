"use client"

import * as React from "react"
import { Button, type ButtonProps } from "@/components/ui/button"

const DistributeRiceButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children = "Add Rice Distribution", ...props }, ref) => {
        return (
            <Button ref={ref} type="button" className={className} variant="default" size="default" {...props}>
                {children}
            </Button>
        )
    }
)

DistributeRiceButton.displayName = "DistributeRiceButton"

export default DistributeRiceButton
