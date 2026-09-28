import {
  CORE_LINK_META,
  CORE_LINK_ORDER,
  LINK_TYPE_META,
} from "../../../../constants/linkTypes";
import type { Dispatch, SetStateAction } from "react";
import type { Control } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { MailOutlined } from "@ant-design/icons";
import CardLinkRow from "./CardLinkRow";
import { contactRowId, socialRowId } from "../../../../utils/cardLinkRows";
import {
  hasContactCardFields,
  setContactCardEnabled,
} from "../../../../utils/contactCardFields";
import {
  contactInfoMeta,
  linkMetaFor,
  socialAccountLabel,
  tintFor,
} from "../../../../utils/linkTypeResolution";
import {
  contactInfoRowKey,
  coreLinkRowKey,
  getDisabledLinkKeys,
  isContactInfoMetadata,
  setLinkRowEnabled,
  socialAccountRowKey,
} from "../../../../utils/linkVisibility";
import { urlToUsername } from "../../../../utils/url";
import type { ProfileEditValues } from "../../../../validators/employee";
import type {
  ContactCardFields,
  ContactInfo,
  CoreLinkKey,
  EditingRow,
  Employee,
  SocialAccount,
} from "../../../../types";

interface Props {
  employee: Employee;
  contactInfos: ContactInfo[];
  setContactInfos: Dispatch<SetStateAction<ContactInfo[]>>;
  socialAccounts: SocialAccount[];
  contactCardFields: ContactCardFields;
  contactCardEnabled: boolean;
  fullName: string;
  additionalInfo: string;
  address: string;
  control: Control<ProfileEditValues>;
  onOpenContactCard: () => void;
  onEditCore: (key: CoreLinkKey) => void;
  onEditRow: (row: EditingRow) => void;
}

export default function CardEditLinkList({
  employee,
  contactInfos,
  setContactInfos,
  socialAccounts,
  contactCardFields,
  contactCardEnabled,
  fullName,
  additionalInfo,
  address,
  control,
  onOpenContactCard,
  onEditCore,
  onEditRow,
}: Props) {
  const coreValues = useWatch({ control, name: CORE_LINK_ORDER });
  const disabledLinkKeys = getDisabledLinkKeys(contactInfos);
  const toggleLinkRow = (rowKey: string, enabled: boolean) =>
    setContactInfos((prev) => setLinkRowEnabled(prev, rowKey, enabled));

  return (
    <>
      {hasContactCardFields(contactCardFields) && (
        <CardLinkRow
          icon={LINK_TYPE_META["contact-card"].icon}
          iconSrc={LINK_TYPE_META["contact-card"].iconSrc}
          label={
            contactCardFields.buttonLabel ||
            LINK_TYPE_META["contact-card"].title
          }
          value={
            fullName || contactCardFields.name || additionalInfo || undefined
          }
          onClick={onOpenContactCard}
          enabled={contactCardEnabled}
          onEnabledChange={(enabled) =>
            setContactInfos((prev) => setContactCardEnabled(prev, enabled))
          }
          tint={tintFor("contact-card")}
        />
      )}

      {employee.email && (
        <CardLinkRow
          icon={<MailOutlined />}
          iconSrc="/imgs/icons/mail.svg"
          label="E-poçt"
          value={employee.email}
          enabled={!disabledLinkKeys.has("core:email")}
          onEnabledChange={(enabled) => toggleLinkRow("core:email", enabled)}
          tint={tintFor("email")}
        />
      )}

      {CORE_LINK_ORDER.map((key, index) => {
        const value = coreValues[index];
        if (!value) return null;
        const meta = CORE_LINK_META[key];
        const displayValue =
          meta.fieldKind === "username" && meta.urlPrefix
            ? urlToUsername(meta.urlPrefix, value)
            : value;
        const rowKey = coreLinkRowKey(key);
        return (
          <CardLinkRow
            key={rowKey}
            icon={meta.icon}
            iconSrc={meta.iconSrc}
            label={key === "googleMapsUrl" ? address || meta.label : meta.label}
            value={displayValue}
            onClick={() => onEditCore(key)}
            enabled={!disabledLinkKeys.has(rowKey)}
            onEnabledChange={(enabled) => toggleLinkRow(rowKey, enabled)}
            tint={tintFor(key)}
          />
        );
      })}

      {contactInfos.map((info, index) => {
        if (isContactInfoMetadata(info)) return null;
        const meta = contactInfoMeta(info);
        const rowKey = contactInfoRowKey(info);
        return (
          <CardLinkRow
            key={contactRowId(info.contactType, index)}
            icon={meta.icon}
            iconSrc={meta.iconSrc}
            label={info.label || meta.title}
            value={
              meta.fieldKind === "username" && meta.urlPrefix
                ? urlToUsername(meta.urlPrefix, info.value)
                : info.value
            }
            onClick={() => onEditRow({ kind: "contact", index })}
            enabled={!disabledLinkKeys.has(rowKey)}
            onEnabledChange={(enabled) => toggleLinkRow(rowKey, enabled)}
            tint={tintFor(info.contactType)}
          />
        );
      })}

      {socialAccounts.map((account, index) => {
        const meta = linkMetaFor(account.platformName);
        const rowKey = socialAccountRowKey(account);
        return (
          <CardLinkRow
            key={socialRowId(account.platformName, index)}
            icon={meta.icon}
            iconSrc={meta.iconSrc ?? account.iconUrl}
            label={socialAccountLabel(account)}
            value={account.profileUrl}
            onClick={() => onEditRow({ kind: "social", index })}
            enabled={!disabledLinkKeys.has(rowKey)}
            onEnabledChange={(enabled) => toggleLinkRow(rowKey, enabled)}
            tint={tintFor(account.platformName)}
          />
        );
      })}
    </>
  );
}
