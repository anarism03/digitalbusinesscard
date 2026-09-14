import { useState } from "react";
import type { ReactNode } from "react";
import { Button, Input } from "antd";
import { MailOutlined, PlusOutlined } from "@ant-design/icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CardHero from "../../../../components/company-admin/mobile/CardHero";
import CardLinkRow from "../../../../components/company-admin/mobile/CardLinkRow";
import ContactCardForm from "../../../../components/company-admin/mobile/ContactCardForm";
import LinkTypePicker from "../../../employee/parts/LinkTypePicker";
import QuickLinkForm from "../../../employee/parts/QuickLinkForm";
import WebsiteLinkForm from "../../../employee/parts/WebsiteLinkForm";
import { LINK_TYPE_META } from "../../../../constants/linkTypes";
import { useUpdateProfile } from "../../../../hooks/useUser";
import { useUpdateEmployee } from "../../../../hooks/useEmployees";
import {
  CORE_LINK_META,
  CORE_LINK_ORDER,
  buildContactCardEntries,
  contactInfoMeta,
  contactInfoRowKey,
  contactRowId,
  coreLinkRowKey,
  coreRowId,
  customWebsitePlatformName,
  getContactCardFields,
  getDisabledLinkKeys,
  hasContactCardFields,
  isContactCardField,
  isContactCardEnabled,
  isContactInfoMetadata,
  linkMetaFor,
  normalizeContactCardEntries,
  socialAccountRowKey,
  socialRowId,
  setContactCardEnabled,
  setLinkRowEnabled,
  tintFor,
  type ContactCardFields,
  type CoreLinkKey,
} from "../../../../utils/cardLinkRows";
import { normalizeContactCardButtonLabel } from "../../../../utils/contactCardFields";
import { normalizePhone, urlToUsername } from "../../../../utils/linkHelpers";
import {
  profileEditSchema,
  type ProfileEditValues,
} from "../../../../validators/employee";
import type {
  ContactInfo,
  EditingRow,
  Employee,
  LinkType,
  QuickLinkResult,
  SocialAccount,
  WebsiteLinkResult,
} from "../../../../types";
import { styles } from "../../../../styles/company-admin/CardEditPanel.styles";
import { useCardEditAssets } from "../hooks/useCardEditAssets";
import CardEditLinkEditors, {
  QUICK_LINK_TYPES,
  socialAccountLabel,
} from "./CardEditLinkEditors";

interface Props {
  employee: Employee;
  isOwnCard: boolean;
  onCancel: () => void;
  onSaved: () => void;
}

function FlatField({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

function parseFullNameInput(value: string) {
  const [firstName = "", lastName = "", ...middleNameParts] = value
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const middleName = middleNameParts.join(" ");

  return {
    displayValue: value,
    firstName,
    lastName,
    middleName,
  };
}

function getContactCardDefaults(
  employee: Employee,
  fields: ContactCardFields,
): ContactCardFields {
  return {
    buttonLabel: normalizeContactCardButtonLabel(fields.buttonLabel),
    name: fields.name || employee.fullName,
    website: fields.website,
  };
}

export default function CardEditPanel({
  employee,
  isOwnCard,
  onCancel,
  onSaved,
}: Props) {
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileEditValues>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      firstName: employee.firstName ?? "",
      lastName: employee.lastName ?? "",
      middleName: employee.middleName ?? "",
      jobTitle: employee.jobTitle ?? "",
      phone1: normalizePhone(employee.phone1 ?? ""),
      phone2: normalizePhone(employee.phone2 ?? ""),
      whatsappPhone: normalizePhone(employee.whatsappPhone ?? ""),
      additionalInfo: employee.additionalInfo ?? "",
      linkedinUrl: employee.linkedinUrl ?? "",
      facebookUrl: employee.facebookUrl ?? "",
      instagramUrl: employee.instagramUrl ?? "",
      googleMapsUrl: employee.googleMapsUrl ?? "",
    },
  });

  const updateProfile = useUpdateProfile(employee.id);
  const updateEmployee = useUpdateEmployee();
  const {
    photoPreview,
    photoProcessing,
    resetPhoto,
    avatarSrc,
    avatarFileInputRef,
    handleAvatarFileChange,
    cardBackground,
    setCardBackground,
    backgroundPreview,
    companyLogoSrc,
    backgroundFileInputRef,
    handleBackgroundFileChange,
  } = useCardEditAssets(employee);

  const [contactInfos, setContactInfos] = useState<ContactInfo[]>(() =>
    normalizeContactCardEntries(employee.contactInfos),
  );
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>(
    employee.socialAccounts ?? [],
  );
  const contactCardFields = getContactCardFields(contactInfos);
  const contactCardEnabled = isContactCardEnabled(contactInfos);
  const disabledLinkKeys = getDisabledLinkKeys(contactInfos);
  const toggleLinkRow = (rowKey: string, enabled: boolean) =>
    setContactInfos((prev) => setLinkRowEnabled(prev, rowKey, enabled));

  const [addStep, setAddStep] = useState<"picker" | LinkType | null>(null);
  const [editingRow, setEditingRow] = useState<EditingRow | null>(null);
  const [editingCore, setEditingCore] = useState<CoreLinkKey | null>(null);
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [address, setAddress] = useState(employee.address ?? "");
  const [birthday, setBirthday] = useState(employee.birthday ?? "");
  const [fullNameInput, setFullNameInput] = useState(() =>
    [employee.firstName, employee.lastName, employee.middleName]
      .filter(Boolean)
      .join(" "),
  );
  const fullName = [watch("firstName"), watch("lastName"), watch("middleName")]
    .filter(Boolean)
    .join(" ");
  const contactCardDefaults = getContactCardDefaults(employee, {
    ...contactCardFields,
    name: contactCardFields.name || fullName,
  });
  const contactCardFormDefaults = {
    ...contactCardDefaults,
    jobTitle: watch("jobTitle") ?? "",
    birthday,
    additionalInfo: watch("additionalInfo") ?? "",
  };

  const setNameParts = (
    nextFirstName: string,
    nextLastName: string,
    nextMiddleName: string,
  ) => {
    setValue("firstName", nextFirstName, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("lastName", nextLastName, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("middleName", nextMiddleName, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setFullNameInput(
      [nextFirstName, nextLastName, nextMiddleName].filter(Boolean).join(" "),
    );
  };

  const handleFullNameChange = (value: string) => {
    const { firstName, lastName, middleName } = parseFullNameInput(value);
    setFullNameInput(value);
    setValue("firstName", firstName, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("lastName", lastName, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("middleName", middleName, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleAddSelect = (type: LinkType) => {
    if (type === "googlemaps") {
      setAddStep(null);
      setEditingCore("googleMapsUrl");
      return;
    }
    if (type === "contact-card") {
      setAddStep(null);
      setContactFormOpen(true);
      return;
    }
    setAddStep(type);
  };

  const handleQuickLinkSave = (type: LinkType, results: QuickLinkResult[]) => {
    setContactInfos((prev) => [
      ...prev,
      ...results.map((result) => ({
        contactType: type,
        value: result.value,
        label: result.label,
      })),
    ]);
    setAddStep(null);
  };

  const handleWebsiteLinkSave = (result: WebsiteLinkResult) => {
    setSocialAccounts((prev) => [
      ...prev,
      {
        platformName: customWebsitePlatformName(result.headline),
        profileUrl: result.url,
        iconUrl: result.iconUrl,
      },
    ]);
    setAddStep(null);
  };

  const configuredCoreKeys = CORE_LINK_ORDER.filter((key) =>
    Boolean(watch(key)),
  );

  const linkIds = [
    ...(hasContactCardFields(contactCardFields) ? ["contact-card"] : []),
    ...(employee.email ? ["core:email"] : []),
    ...configuredCoreKeys.map((key) => coreRowId(key)),
    ...contactInfos.flatMap((info, index) =>
      !isContactInfoMetadata(info) ? [contactRowId(info.contactType, index)] : [],
    ),
    ...socialAccounts.map((account, index) =>
      socialRowId(account.platformName, index),
    ),
  ];

  const renderLinkRow = (id: string): ReactNode => {
    if (id === "contact-card") {
      const meta = LINK_TYPE_META["contact-card"];
      return (
        <CardLinkRow
          key={id}
          mode="edit"
          icon={meta.icon}
          iconSrc={meta.iconSrc}
          label={contactCardFields.buttonLabel || meta.title}
          value={fullName || contactCardFields.name || watch("additionalInfo") || undefined}
          onClick={() => setContactFormOpen(true)}
          enabled={contactCardEnabled}
          onEnabledChange={(enabled) =>
            setContactInfos((prev) => setContactCardEnabled(prev, enabled))
          }
          tint={tintFor("contact-card")}
        />
      );
    }

    if (id === "core:email") {
      return (
        <CardLinkRow
          key={id}
          mode="edit"
          icon={<MailOutlined />}
          iconSrc="/imgs/icons/mail.svg"
          label="E-poçt"
          value={employee.email}
          enabled={!disabledLinkKeys.has("core:email")}
          onEnabledChange={(enabled) => toggleLinkRow("core:email", enabled)}
          tint={tintFor("email")}
        />
      );
    }

    if (id.startsWith("core:")) {
      const key = id.slice("core:".length) as CoreLinkKey;
      const meta = CORE_LINK_META[key];
      const value = watch(key) ?? "";
      const displayValue =
        meta.fieldKind === "username" && meta.urlPrefix
          ? urlToUsername(meta.urlPrefix, value)
          : value;
      const rowKey = coreLinkRowKey(key);
      return (
        <CardLinkRow
          key={id}
          mode="edit"
          icon={meta.icon}
          iconSrc={meta.iconSrc}
          label={key === "googleMapsUrl" ? address || meta.label : meta.label}
          value={displayValue || undefined}
          onClick={() => setEditingCore(key)}
          enabled={!disabledLinkKeys.has(rowKey)}
          onEnabledChange={(enabled) => toggleLinkRow(rowKey, enabled)}
          tint={tintFor(key)}
        />
      );
    }

    if (id.startsWith("contact:")) {
      const index = contactInfos.findIndex(
        (info, i) => contactRowId(info.contactType, i) === id,
      );
      if (index === -1) return null;
      const info = contactInfos[index];
      const meta = contactInfoMeta(info);
      const rowKey = contactInfoRowKey(info);
      return (
        <CardLinkRow
          key={id}
          mode="edit"
          icon={meta.icon}
          iconSrc={meta.iconSrc}
          label={info.label || meta.title}
          value={
            meta.fieldKind === "username" && meta.urlPrefix
              ? urlToUsername(meta.urlPrefix, info.value)
              : info.value
          }
          onClick={() => setEditingRow({ kind: "contact", index })}
          enabled={!disabledLinkKeys.has(rowKey)}
          onEnabledChange={(enabled) => toggleLinkRow(rowKey, enabled)}
          tint={tintFor(info.contactType)}
        />
      );
    }

    const index = socialAccounts.findIndex(
      (account, i) => socialRowId(account.platformName, i) === id,
    );
    if (index === -1) return null;
    const account = socialAccounts[index];
    const meta = linkMetaFor(account.platformName);
    const rowKey = socialAccountRowKey(account);
    return (
      <CardLinkRow
        key={id}
        mode="edit"
        icon={meta.icon}
        iconSrc={meta.iconSrc ?? account.iconUrl}
        label={socialAccountLabel(account)}
        value={account.profileUrl}
        onClick={() => setEditingRow({ kind: "social", index })}
        enabled={!disabledLinkKeys.has(rowKey)}
        onEnabledChange={(enabled) => toggleLinkRow(rowKey, enabled)}
        tint={tintFor(account.platformName)}
      />
    );
  };

  const handleCancel = () => {
    resetPhoto(employee.photoUrl);
    onCancel();
  };

  const onValid = async (values: ProfileEditValues) => {
    try {
      const nextFullName = [values.firstName, values.lastName, values.middleName]
        .filter(Boolean)
        .join(" ");
      const syncedContactInfos = hasContactCardFields(contactCardFields)
        ? [
            ...contactInfos.filter((info) => !isContactCardField(info)),
            ...buildContactCardEntries(
              { ...contactCardFields, name: nextFullName },
              contactCardEnabled,
            ),
          ]
        : contactInfos;
      const cleanedValues = {
        ...values,
        phone2: values.phone2 || undefined,
        whatsappPhone: values.whatsappPhone || undefined,
        linkedinUrl: values.linkedinUrl || undefined,
        facebookUrl: values.facebookUrl || undefined,
        instagramUrl: values.instagramUrl || undefined,
        googleMapsUrl: values.googleMapsUrl || undefined,
        address: address.trim() || undefined,
        birthday: birthday || undefined,
        photoUrl: photoPreview || "",
        cardBackgroundUrl: cardBackground || "",
        contactInfos: syncedContactInfos.map((info, index) => ({
          ...info,
          displayOrder: index,
        })),
        socialAccounts,
      };
      if (isOwnCard) {
        await updateProfile.mutateAsync({ data: cleanedValues });
      } else {
        await updateEmployee.mutateAsync({
          id: employee.id,
          data: cleanedValues,
        });
      }
      onSaved();
    } catch {
    }
  };

  return (
    <div style={styles.wrap}>
      <CardHero
        name={employee.fullName}
        avatarSrc={avatarSrc}
        backgroundSrc={backgroundPreview || companyLogoSrc}
        onEditAvatar={() => avatarFileInputRef.current?.click()}
        onEditBackground={() => backgroundFileInputRef.current?.click()}
        onRemoveAvatar={photoPreview ? () => resetPhoto(null) : undefined}
        onRemoveBackground={
          cardBackground ? () => setCardBackground(undefined) : undefined
        }
      />

      <input
        ref={avatarFileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleAvatarFileChange}
      />
      <input
        ref={backgroundFileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleBackgroundFileChange}
      />

      <div style={styles.identityField}>
        <span style={styles.fieldLabel}>Tam Ad</span>
        <FlatField>
          <Input
            aria-label="Tam Ad"
            className={`card-edit-flat-input ${
              errors.firstName || errors.lastName
                ? "card-edit-flat-input--error"
                : ""
            }`}
            value={fullNameInput}
            onChange={(event) => handleFullNameChange(event.target.value)}
            placeholder="Ad Soyad"
            maxLength={101}
            style={{
              ...styles.flatInput,
              ...(errors.firstName || errors.lastName
                ? styles.flatInputError
                : {}),
            }}
          />
        </FlatField>
      </div>

      {linkIds.map((id) => renderLinkRow(id))}

      <LinkTypePicker
        open={addStep === "picker"}
        onClose={() => setAddStep(null)}
        onSelect={handleAddSelect}
      />

      <ContactCardForm
        open={contactFormOpen}
        initial={contactCardFormDefaults}
        firstName={watch("firstName") ?? ""}
        lastName={watch("lastName") ?? ""}
        middleName={watch("middleName") ?? ""}
        onFirstNameChange={(value) =>
          setNameParts(value, watch("lastName") ?? "", watch("middleName") ?? "")
        }
        onLastNameChange={(value) =>
          setNameParts(watch("firstName") ?? "", value, watch("middleName") ?? "")
        }
        onMiddleNameChange={(value) =>
          setNameParts(watch("firstName") ?? "", watch("lastName") ?? "", value)
        }
        onClose={() => setContactFormOpen(false)}
        onSave={({ jobTitle, birthday: nextBirthday, additionalInfo, ...fields }) => {
          setValue("jobTitle", jobTitle, {
            shouldDirty: true,
            shouldValidate: true,
          });
          setValue("additionalInfo", additionalInfo, {
            shouldDirty: true,
            shouldValidate: true,
          });
          setBirthday(nextBirthday);
          setContactInfos((prev) => [
            ...prev.filter((info) => !isContactCardField(info)),
            ...buildContactCardEntries(fields, contactCardEnabled),
          ]);
          setContactFormOpen(false);
        }}
        onDelete={
          hasContactCardFields(contactCardFields)
            ? () => {
                setContactInfos((prev) =>
                  prev.filter((info) => !isContactCardField(info)),
                );
                setContactFormOpen(false);
              }
            : undefined
        }
      />

      {QUICK_LINK_TYPES.map((type) => (
        <QuickLinkForm
          key={type}
          open={addStep === type}
          title={LINK_TYPE_META[type].title}
          icon={LINK_TYPE_META[type].icon}
          iconSrc={LINK_TYPE_META[type].iconSrc}
          placeholder={LINK_TYPE_META[type].placeholder}
          fieldKind={LINK_TYPE_META[type].fieldKind}
          urlPrefix={LINK_TYPE_META[type].urlPrefix}
          allowMultiple={type === "phone" || type === "email"}
          onBack={() => setAddStep("picker")}
          onClose={() => setAddStep(null)}
          onSave={(results) => handleQuickLinkSave(type, results)}
        />
      ))}

      <WebsiteLinkForm
        open={addStep === "website"}
        onBack={() => setAddStep("picker")}
        onClose={() => setAddStep(null)}
        onSave={handleWebsiteLinkSave}
      />

      <CardEditLinkEditors
        editingRow={editingRow}
        onEditingRowChange={setEditingRow}
        contactInfos={contactInfos}
        setContactInfos={setContactInfos}
        socialAccounts={socialAccounts}
        setSocialAccounts={setSocialAccounts}
        editingCore={editingCore}
        onEditingCoreChange={setEditingCore}
        address={address}
        onAddressChange={setAddress}
        watch={watch}
        setValue={setValue}
      />

      <div style={styles.bottomBar}>
        <button
          type="button"
          style={styles.addLinkButton}
          onClick={() => setAddStep("picker")}
        >
          <PlusOutlined /> Əlavə etmək
        </button>

        <div style={styles.actions}>
          <Button onClick={handleCancel}>Ləğv et</Button>
          <Button
            type="primary"
            loading={
              updateProfile.isPending ||
              updateEmployee.isPending ||
              photoProcessing
            }
            onClick={handleSubmit(onValid)}
          >
            Yadda saxla
          </Button>
        </div>
      </div>
    </div>
  );
}
