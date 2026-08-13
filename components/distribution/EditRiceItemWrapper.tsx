// app/distributions/EditRiceItemWrapper.tsx
import { getRiceOptions } from "@/utils/actions";
import { EditDistributionItem } from "@/components/distribution/EditDistributionItem";
import { DistributionRow, RiceOption } from "@/utils/types";

export default async function EditRiceItemWrapper(props: {
    item: DistributionRow;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEditSuccess?: (updated: DistributionRow) => void;
    onDeleteSuccess?: (deleteId: string) => void;
}) {
    const riceOptions: RiceOption[] = await getRiceOptions(); // runs on server at render time
    return <EditDistributionItem {...props} riceOptions={riceOptions} />;
}
