import type { ContactCardFields, ViewLinkGroup } from "../utils/cardLinkRows";

export interface EditingRow {
  kind: "contact" | "social";
  index: number;
}

export interface PublicLinkProps {
  group: ViewLinkGroup;
  onOpen: (group: ViewLinkGroup) => void;
}

export type ContactCardFormValues = ContactCardFields & {
  jobTitle: string;
  birthday: string;
  additionalInfo: string;
};
