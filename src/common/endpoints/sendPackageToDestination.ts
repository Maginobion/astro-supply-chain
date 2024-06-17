export interface SendPackageDTO {
  originId: string;
  destinationId: string;
  packages: string[];
}

export interface Package {
  id: string;
  locationId: string;
}
