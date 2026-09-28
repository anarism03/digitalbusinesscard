import type { ViewLinkGroup } from "./link";

export interface EditingRow {
  kind: "contact" | "social";
  index: number;
}

export interface PublicLinkProps {
  group: ViewLinkGroup;
  onOpen: (group: ViewLinkGroup) => void;
}

export interface ContactCardFields {
  buttonLabel: string;
  name: string;
  website: string;
}

export type ContactCardFormValues = ContactCardFields & {
  jobTitle: string;
  birthday: string;
  additionalInfo: string;
};

export interface ContactCardVcfOverrides {
  name?: string;
  website?: string;
}
