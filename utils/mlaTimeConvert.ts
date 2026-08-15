export default function mlaTimeConvert( value: string, dateOnly: boolean = false ) {
    const date = new Date(value)
    if (date instanceof Date && !dateOnly) {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Manila",
        }).format(date)
    } else {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            timeZone: "Asia/Manila",
        }).format(date)
    }
}

 