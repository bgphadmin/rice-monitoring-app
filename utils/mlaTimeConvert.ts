export default function mlaTimeConvert( value: string) {
    const date = new Date(value)
    if (date instanceof Date) {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Manila",
        }).format(date)
    }
}

 