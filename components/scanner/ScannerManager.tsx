"use client"
import { addDistributionFromScannerAction } from "@/utils/actions";
import { useEffect, useState } from "react"
import toast from "react-hot-toast";

export default function ScannerManager({ riceOptions: riceOptions }: { riceOptions: { id: string; name: string }[] }) {
    const [riceId, setRiceId] = useState(riceOptions[0]?.id || "")
    const [quantityKg, setQuantityKg] = useState("1")

    useEffect(() => {
        const buffer: string[] = []
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                const employeeId = buffer.join("")
                buffer.length = 0

                const payload = {
                    employeeId,
                    riceId,
                    quantityKg: parseFloat(quantityKg),
                    comment: null,
                    dateGiven: new Date(),
                }
                if (payload.quantityKg > 0) {}
            } else {
                buffer.push(e.key)
            }
        }

        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [riceId, quantityKg]) // ✅ only depend on state you read

    const handleScan = async (employeeId: string) => {
        const payload = {
            employeeId,
            riceId,
            quantityKg: parseFloat(quantityKg),
            comment: "Input from scanner",
            dateGiven: new Date(),
        }

        const { message, result } = await addDistributionFromScannerAction(payload)

        if (result === "success") {
            toast.success(message)
        } else if (result === "error") {
            toast.error(message)
        }
    }

    return (
        <div className="flex items-start justify-center min-h-screen pt-20">
            <div className="space-y-6 w-96">
                <div className="flex flex-col space-y-2">
                    <label htmlFor="rice" className="font-semibold">Rice</label>
                    <select
                        id="rice"
                        value={riceId}
                        onChange={(e) => setRiceId(e.target.value)}
                        className="border rounded p-2"
                    >
                        {riceOptions.map((r) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col space-y-2">
                    <label htmlFor="quantity" className="font-semibold">Quantity (kg)</label>
                    <input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantityKg}
                        onChange={(e) => setQuantityKg(e.target.value)}
                        className="border rounded p-2"
                    />
                </div>

                {/* Hidden input for QR scanner device */}
                <input
                    type="text"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleScan((e.target as HTMLInputElement).value)
                                ; (e.target as HTMLInputElement).value = ""
                        }
                    }}
                    autoFocus
                    className="hidden"
                />
            </div>
        </div>
    )
}