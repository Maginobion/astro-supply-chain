export type TDestination = {
    _id: string;
    name: string;
    address: string,
    status: boolean,
    type: "dist-center" | "manufacture" | "warehouse" | "store",
}