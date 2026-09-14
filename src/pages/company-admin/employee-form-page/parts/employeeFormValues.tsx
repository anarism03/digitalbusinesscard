import type { Employee } from "../../../../types";
import { digitsOnly } from "../../../../utils/text";
import { normalizePhone } from "../../../../utils/linkHelpers";
import type { EmployeeFormValues } from "../../../../validators/employee";

export function toEmployeeFormValues(
  d?: Partial<Employee>,
): EmployeeFormValues {
  return {
    firstName: d?.firstName ?? "",
    lastName: d?.lastName ?? "",
    middleName: d?.middleName ?? "",
    jobTitle: d?.jobTitle ?? "",
    email: d?.email ?? "",
    password: "",
    phone1: normalizePhone(d?.phone1 ?? ""),
    phone2: normalizePhone(d?.phone2 ?? ""),
    whatsappPhone: normalizePhone(d?.whatsappPhone ?? ""),
    extensionNumber: digitsOnly(d?.extensionNumber ?? ""),
    additionalInfo: d?.additionalInfo ?? "",
    linkedinUrl: d?.linkedinUrl ?? "",
    facebookUrl: d?.facebookUrl ?? "",
    instagramUrl: d?.instagramUrl ?? "",
    googleMapsUrl: d?.googleMapsUrl ?? "",
    contactInfos: d?.contactInfos ?? [],
    socialAccounts: d?.socialAccounts ?? [],
    isActive: d?.isActive ?? true,
    canEdit: d?.canEdit ?? false,
  };
}
