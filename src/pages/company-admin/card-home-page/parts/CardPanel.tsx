import { useEffect, useRef, useState } from "react";
import { EyeOutlined } from "@ant-design/icons";
import BusinessCardPublicView from "../../../../components/business-card/BusinessCardPublicView";
import CardEditPanel from "./CardEditPanel";
import CardSkeleton from "../../../../components/company-admin/mobile/CardSkeleton";
import ErrorState from "../../../../components/shared/ErrorState";
import ChangePasswordModal from "../../../employee/parts/ChangePasswordModal";
import { useEmployee } from "../../../../hooks/useEmployees";
import { useChangePassword } from "../../../../hooks/useUser";
import { useAppSelector } from "../../../../store/hooks";
import { styles } from "../../../../styles/company-admin/CardPanel.styles";
import { employeesService } from "../../../../services/employees.service";
import { userService } from "../../../../services/user.service";
import { isImageDataUrl } from "../../../../utils/url";
import { resolveVcfPhotoDataUrl } from "../../../../utils/vcard";
import type {
  ChangePasswordValues,
  Employee,
  UpdateUserProfileDto,
} from "../../../../types";

function buildProfileUpdatePayload(employee: Employee): UpdateUserProfileDto {
  return {
    firstName: employee.firstName,
    lastName: employee.lastName,
    middleName: employee.middleName,
    jobTitle: employee.jobTitle,
    phone1: employee.phone1,
    phone2: employee.phone2,
    whatsappPhone: employee.whatsappPhone,
    extensionNumber: employee.extensionNumber,
    additionalInfo: employee.additionalInfo,
    photoUrl: employee.photoUrl,
    googleMapsUrl: employee.googleMapsUrl,
    cardBackgroundUrl: employee.cardBackgroundUrl,
    address: employee.address,
    birthday: employee.birthday,
    linkedinUrl: employee.linkedinUrl,
    facebookUrl: employee.facebookUrl,
    instagramUrl: employee.instagramUrl,
    socialAccounts: employee.socialAccounts,
    contactInfos: employee.contactInfos,
  };
}

interface Props {
  employeeId: string;
  isOwnCard: boolean;
  editMode: boolean;
  onEditModeChange: (editing: boolean) => void;
  onBack?: () => void;
  hideOwnPasswordButton?: boolean;
}

export default function CardPanel({
  employeeId,
  isOwnCard,
  editMode,
  onEditModeChange,
  onBack,
  hideOwnPasswordButton = false,
}: Props) {
  const {
    data: employee,
    isLoading,
    isError,
    refetch,
  } = useEmployee(employeeId);
  const role = useAppSelector((state) => state.auth.user?.role);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const changePassword = useChangePassword();
  const healedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!employee) return;
    const needsPhotoHeal =
      Boolean(employee.photoUrl) && !isImageDataUrl(employee.photoUrl);
    const needsBackgroundHeal =
      Boolean(employee.cardBackgroundUrl) &&
      !isImageDataUrl(employee.cardBackgroundUrl);
    if (!needsPhotoHeal && !needsBackgroundHeal) return;
    if (healedIdRef.current === employee.id) return;
    healedIdRef.current = employee.id;

    let cancelled = false;
    (async () => {
      const [photoUrl, cardBackgroundUrl] = await Promise.all([
        needsPhotoHeal
          ? resolveVcfPhotoDataUrl(employee.photoUrl)
          : Promise.resolve(undefined),
        needsBackgroundHeal
          ? resolveVcfPhotoDataUrl(employee.cardBackgroundUrl)
          : Promise.resolve(undefined),
      ]);
      if (cancelled || (!photoUrl && !cardBackgroundUrl)) return;

      const payload: UpdateUserProfileDto = {
        ...buildProfileUpdatePayload(employee),
        ...(photoUrl ? { photoUrl } : {}),
        ...(cardBackgroundUrl ? { cardBackgroundUrl } : {}),
      };

      try {
        if (isOwnCard) {
          await userService.updateProfile(payload);
        } else {
          await employeesService.update(employee.id, payload);
        }
        if (!cancelled) void refetch();
      } catch {
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee?.id, employee?.photoUrl, employee?.cardBackgroundUrl]);

  if (isLoading) return <CardSkeleton />;
  if (isError || !employee) return <ErrorState onRetry={() => refetch()} />;

  const canEdit = role === "EMPLOYEE" ? employee.canEdit === true : true;

  const handlePasswordSave = async (values: ChangePasswordValues) => {
    await changePassword.mutateAsync({
      oldPassword: values.oldPassword || undefined,
      newPassword: values.newPassword,
    });
    setPasswordOpen(false);
  };

  if (editMode && canEdit) {
    return (
      <div style={styles.editWrap}>
        <button
          type="button"
          className="premium-mode-toggle"
          style={styles.previewToggle}
          onClick={() => onEditModeChange(false)}
        >
          <EyeOutlined />
          Profil baxış
        </button>

        <CardEditPanel
          employee={employee}
          isOwnCard={isOwnCard}
          onCancel={() => onEditModeChange(false)}
          onSaved={() => {
            onEditModeChange(false);
            void refetch();
          }}
        />
      </div>
    );
  }

  const showPasswordButton = isOwnCard && !hideOwnPasswordButton;

  return (
    <div style={styles.wrap}>
      <BusinessCardPublicView
        employee={employee}
        onEdit={canEdit ? () => onEditModeChange(true) : undefined}
        onBack={onBack}
        onChangePassword={
          showPasswordButton ? () => setPasswordOpen(true) : undefined
        }
      />

      {showPasswordButton && (
        <ChangePasswordModal
          open={passwordOpen}
          loading={changePassword.isPending}
          onSubmit={handlePasswordSave}
          onCancel={() => setPasswordOpen(false)}
        />
      )}
    </div>
  );
}
