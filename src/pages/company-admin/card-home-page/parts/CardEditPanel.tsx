import { useRef, useState } from "react";
import { Button, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CardHero from "./CardHero";
import CardEditLinkList from "./CardEditLinkList";
import ContactCardForm from "./ContactCardForm";
import LinkTypePicker from "./LinkTypePicker";
import QuickLinkForm from "./QuickLinkForm";
import WebsiteLinkForm from "./WebsiteLinkForm";
import { LINK_TYPE_META } from "../../../../constants/linkTypes";
import { useUpdateProfile } from "../../../../hooks/useUser";
import { useUpdateEmployee } from "../../../../hooks/useEmployees";
import { useAssetSrc } from "../../../../hooks/useAssetSrc";
import { useImageUpload } from "../../../../hooks/useImageUpload";
import {
  buildContactCardEntries,
  getContactCardFields,
  hasContactCardFields,
  isContactCardEnabled,
  isContactCardField,
  normalizeContactCardButtonLabel,
  normalizeContactCardEntries,
} from "../../../../utils/contactCardFields";
import { customWebsitePlatformName } from "../../../../utils/linkTypeResolution";
import { normalizePhone } from "../../../../utils/url";
import {
  profileEditSchema,
  type ProfileEditValues,
} from "../../../../validators/employee";
import type {
  ContactInfo,
  CoreLinkKey,
  EditingRow,
  Employee,
  LinkType,
  QuickLinkResult,
  SocialAccount,
  WebsiteLinkResult,
} from "../../../../types";
import { styles } from "../../../../styles/company-admin/CardEditPanel.styles";
import CardEditLinkEditors from "./CardEditLinkEditors";

const QUICK_LINK_TYPES = (Object.keys(LINK_TYPE_META) as LinkType[]).filter(
  (type) =>
    type !== "contact-card" && type !== "googlemaps" && type !== "website",
);

interface Props {
  employee: Employee;
  isOwnCard: boolean;
  onCancel: () => void;
  onSaved: () => void;
}

function parseFullNameInput(value: string) {
  const [firstName = "", lastName = "", ...middleNameParts] = value
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const middleName = middleNameParts.join(" ");

  return { firstName, lastName, middleName };
}

export default function CardEditPanel({
  employee,
  isOwnCard,
  onCancel,
  onSaved,
}: Props) {
  const {
    control,
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

  const updateProfile = useUpdateProfile();
  const updateEmployee = useUpdateEmployee();
  const photo = useImageUpload({ initialSrc: employee.photoUrl });
  const background = useImageUpload({ initialSrc: employee.cardBackgroundUrl });
  const avatarSrc = useAssetSrc(photo.src);
  const backgroundPreview = useAssetSrc(background.src);
  const companyLogoSrc = useAssetSrc(employee.companyLogoUrl);
  const backgroundSrc = backgroundPreview || companyLogoSrc;
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const backgroundFileInputRef = useRef<HTMLInputElement>(null);

  const [contactInfos, setContactInfos] = useState<ContactInfo[]>(() =>
    normalizeContactCardEntries(employee.contactInfos),
  );
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>(
    employee.socialAccounts ?? [],
  );
  const contactCardFields = getContactCardFields(contactInfos);
  const contactCardEnabled = isContactCardEnabled(contactInfos);

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
  const contactCardFormDefaults = {
    buttonLabel: normalizeContactCardButtonLabel(contactCardFields.buttonLabel),
    name: contactCardFields.name || fullName || employee.fullName,
    website: contactCardFields.website,
    jobTitle: watch("jobTitle") ?? "",
    birthday,
    additionalInfo: watch("additionalInfo") ?? "",
  };

  const setNameParts = (
    firstName: string,
    lastName: string,
    middleName: string,
  ) => {
    const options = { shouldDirty: true, shouldValidate: true };
    setValue("firstName", firstName, options);
    setValue("lastName", lastName, options);
    setValue("middleName", middleName, options);
    setFullNameInput(
      [firstName, lastName, middleName].filter(Boolean).join(" "),
    );
  };

  const handleFullNameChange = (value: string) => {
    const { firstName, lastName, middleName } = parseFullNameInput(value);
    setNameParts(firstName, lastName, middleName);
    setFullNameInput(value);
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

  const handleCancel = () => {
    photo.reset(employee.photoUrl);
    onCancel();
  };

  const onValid = async (values: ProfileEditValues) => {
    try {
      const nextFullName = [
        values.firstName,
        values.lastName,
        values.middleName,
      ]
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
        photoUrl: photo.src || "",
        cardBackgroundUrl: background.src || "",
        contactInfos: syncedContactInfos.map((info, index) => ({
          ...info,
          displayOrder: index,
        })),
        socialAccounts,
      };
      if (isOwnCard) {
        await updateProfile.mutateAsync(cleanedValues);
      } else {
        await updateEmployee.mutateAsync({
          id: employee.id,
          data: cleanedValues,
        });
      }
      onSaved();
    } catch {}
  };

  return (
    <div style={styles.wrap}>
      <CardHero
        name={employee.fullName}
        avatarSrc={avatarSrc}
        backgroundSrc={backgroundSrc}
        isCompanyLogoCover={!backgroundPreview && Boolean(companyLogoSrc)}
        onEditAvatar={() => avatarFileInputRef.current?.click()}
        onEditBackground={() => backgroundFileInputRef.current?.click()}
        onRemoveAvatar={photo.src ? () => photo.reset() : undefined}
        onRemoveBackground={
          background.src ? () => background.reset() : undefined
        }
      />

      <input
        ref={avatarFileInputRef}
        type="file"
        accept="image/*"
        style={styles.hiddenInput}
        onChange={photo.onInputChange}
      />
      <input
        ref={backgroundFileInputRef}
        type="file"
        accept="image/*"
        style={styles.hiddenInput}
        onChange={background.onInputChange}
      />

      <div style={styles.identityField}>
        <span style={styles.fieldLabel}>Tam Ad</span>
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
      </div>

      <CardEditLinkList
        employee={employee}
        contactInfos={contactInfos}
        setContactInfos={setContactInfos}
        socialAccounts={socialAccounts}
        contactCardFields={contactCardFields}
        contactCardEnabled={contactCardEnabled}
        fullName={fullName}
        additionalInfo={watch("additionalInfo") ?? ""}
        address={address}
        control={control}
        onOpenContactCard={() => setContactFormOpen(true)}
        onEditCore={setEditingCore}
        onEditRow={setEditingRow}
      />

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
        onClose={() => setContactFormOpen(false)}
        onSave={(
          { jobTitle, birthday: nextBirthday, additionalInfo, ...fields },
          { firstName, lastName, middleName },
        ) => {
          setNameParts(firstName, lastName, middleName);
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
          <PlusOutlined /> Əlavə et
        </button>

        <div style={styles.actions}>
          <Button onClick={handleCancel}>Ləğv et</Button>
          <Button
            type="primary"
            loading={
              updateProfile.isPending ||
              updateEmployee.isPending ||
              photo.isProcessing ||
              background.isProcessing
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
