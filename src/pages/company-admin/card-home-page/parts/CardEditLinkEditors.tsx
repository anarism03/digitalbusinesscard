import { CORE_LINK_META } from "../../../../constants/linkTypes";
import type { Dispatch, SetStateAction } from "react";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";
import QuickLinkForm from "./QuickLinkForm";
import WebsiteLinkForm from "./WebsiteLinkForm";
import CoreFieldSheet from "./CoreFieldSheet";
import {
  contactInfoMeta,
  customWebsiteHeadline,
  customWebsitePlatformName,
  isWebsiteSocialAccount,
  linkMetaFor,
  resolveContactInfoType,
} from "../../../../utils/linkTypeResolution";
import { urlToUsername } from "../../../../utils/url";
import type { ProfileEditValues } from "../../../../validators/employee";
import type {
  ContactInfo,
  CoreLinkKey,
  EditingRow,
  SocialAccount,
} from "../../../../types";

interface Props {
  editingRow: EditingRow | null;
  onEditingRowChange: (row: EditingRow | null) => void;
  contactInfos: ContactInfo[];
  setContactInfos: Dispatch<SetStateAction<ContactInfo[]>>;
  socialAccounts: SocialAccount[];
  setSocialAccounts: Dispatch<SetStateAction<SocialAccount[]>>;
  editingCore: CoreLinkKey | null;
  onEditingCoreChange: (key: CoreLinkKey | null) => void;
  address: string;
  onAddressChange: (value: string) => void;
  watch: UseFormWatch<ProfileEditValues>;
  setValue: UseFormSetValue<ProfileEditValues>;
}

export default function CardEditLinkEditors({
  editingRow,
  onEditingRowChange,
  contactInfos,
  setContactInfos,
  socialAccounts,
  setSocialAccounts,
  editingCore,
  onEditingCoreChange,
  address,
  onAddressChange,
  watch,
  setValue,
}: Props) {
  const editingContactInfo =
    editingRow?.kind === "contact" ? contactInfos[editingRow.index] : undefined;
  const editingSocialAccount =
    editingRow?.kind === "social"
      ? socialAccounts[editingRow.index]
      : undefined;
  const editingContactMeta = editingContactInfo
    ? contactInfoMeta(editingContactInfo)
    : undefined;
  const editingSocialMeta = editingSocialAccount
    ? linkMetaFor(editingSocialAccount.platformName)
    : undefined;

  const removeContactInfo = (index: number) => {
    setContactInfos((prev) => prev.filter((_, i) => i !== index));
  };

  const removeSocialAccount = (index: number) => {
    setSocialAccounts((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      {editingContactInfo &&
        editingContactMeta &&
        resolveContactInfoType(editingContactInfo) !== "website" && (
          <QuickLinkForm
            open
            title={editingContactMeta.title}
            icon={editingContactMeta.icon}
            iconSrc={editingContactMeta.iconSrc}
            placeholder={editingContactMeta.placeholder}
            fieldKind={editingContactMeta.fieldKind}
            urlPrefix={editingContactMeta.urlPrefix}
            initial={{
              label: editingContactInfo.label || editingContactMeta.title,
              value:
                editingContactMeta.fieldKind === "username" &&
                editingContactMeta.urlPrefix
                  ? urlToUsername(
                      editingContactMeta.urlPrefix,
                      editingContactInfo.value,
                    )
                  : editingContactInfo.value,
            }}
            onBack={() => onEditingRowChange(null)}
            onClose={() => onEditingRowChange(null)}
            onSave={(results) => {
              const result = results[0];
              if (!result) return;
              const index = editingRow!.index;
              setContactInfos((prev) =>
                prev.map((info, i) =>
                  i === index
                    ? { ...info, value: result.value, label: result.label }
                    : info,
                ),
              );
              onEditingRowChange(null);
            }}
            onDelete={() => {
              removeContactInfo(editingRow!.index);
              onEditingRowChange(null);
            }}
          />
        )}

      {editingContactInfo &&
        resolveContactInfoType(editingContactInfo) === "website" && (
          <WebsiteLinkForm
            open
            initial={{
              headline: editingContactInfo.label || "Sayt linki",
              url: editingContactInfo.value,
            }}
            onBack={() => onEditingRowChange(null)}
            onClose={() => onEditingRowChange(null)}
            onSave={(result) => {
              const index = editingRow!.index;
              setContactInfos((prev) => prev.filter((_, i) => i !== index));
              setSocialAccounts((prev) => [
                ...prev,
                {
                  platformName: customWebsitePlatformName(result.headline),
                  profileUrl: result.url,
                  iconUrl: result.iconUrl,
                },
              ]);
              onEditingRowChange(null);
            }}
            onDelete={() => {
              removeContactInfo(editingRow!.index);
              onEditingRowChange(null);
            }}
          />
        )}

      {editingSocialAccount &&
        editingSocialMeta &&
        !isWebsiteSocialAccount(editingSocialAccount) && (
          <QuickLinkForm
            open
            title={editingSocialMeta.title}
            icon={editingSocialMeta.icon}
            iconSrc={editingSocialMeta.iconSrc ?? editingSocialAccount.iconUrl}
            placeholder={editingSocialMeta.placeholder}
            fieldKind={editingSocialMeta.fieldKind}
            urlPrefix={editingSocialMeta.urlPrefix}
            initial={{
              label: editingSocialMeta.title,
              value:
                editingSocialMeta.fieldKind === "username" &&
                editingSocialMeta.urlPrefix
                  ? urlToUsername(
                      editingSocialMeta.urlPrefix,
                      editingSocialAccount.profileUrl,
                    )
                  : editingSocialAccount.profileUrl,
            }}
            onBack={() => onEditingRowChange(null)}
            onClose={() => onEditingRowChange(null)}
            onSave={(results) => {
              const result = results[0];
              if (!result) return;
              const index = editingRow!.index;
              setSocialAccounts((prev) => prev.filter((_, i) => i !== index));
              setContactInfos((prev) => [
                ...prev,
                {
                  contactType: editingSocialAccount.platformName,
                  value: result.value,
                  label: result.label,
                },
              ]);
              onEditingRowChange(null);
            }}
            onDelete={() => {
              removeSocialAccount(editingRow!.index);
              onEditingRowChange(null);
            }}
          />
        )}

      {editingSocialAccount && isWebsiteSocialAccount(editingSocialAccount) && (
        <WebsiteLinkForm
          open
          initial={{
            headline:
              customWebsiteHeadline(editingSocialAccount.platformName) ??
              "Sayt linki",
            url: editingSocialAccount.profileUrl,
            iconUrl: editingSocialAccount.iconUrl,
          }}
          onBack={() => onEditingRowChange(null)}
          onClose={() => onEditingRowChange(null)}
          onSave={(result) => {
            const index = editingRow!.index;
            setSocialAccounts((prev) =>
              prev.map((account, i) =>
                i === index
                  ? {
                      platformName: customWebsitePlatformName(result.headline),
                      profileUrl: result.url,
                      iconUrl: result.iconUrl,
                    }
                  : account,
              ),
            );
            onEditingRowChange(null);
          }}
          onDelete={() => {
            removeSocialAccount(editingRow!.index);
            onEditingRowChange(null);
          }}
        />
      )}

      {editingCore && (
        <CoreFieldSheet
          open
          title={CORE_LINK_META[editingCore].label}
          placeholder={CORE_LINK_META[editingCore].placeholder}
          fieldKind={CORE_LINK_META[editingCore].fieldKind}
          urlPrefix={CORE_LINK_META[editingCore].urlPrefix}
          initialValue={watch(editingCore) ?? ""}
          showHeadline={editingCore === "googleMapsUrl"}
          initialHeadline={address}
          onClose={() => onEditingCoreChange(null)}
          onSave={(value, headline) => {
            setValue(editingCore, value, { shouldDirty: true });
            if (editingCore === "googleMapsUrl")
              onAddressChange(headline ?? "");
            onEditingCoreChange(null);
          }}
          onDelete={
            editingCore === "googleMapsUrl" && watch(editingCore)
              ? () => {
                  setValue(editingCore, "", { shouldDirty: true });
                  onAddressChange("");
                  onEditingCoreChange(null);
                }
              : undefined
          }
        />
      )}
    </>
  );
}
