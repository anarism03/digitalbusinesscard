import ConfirmActionModal from "../shared/ConfirmActionModal";
import { strings } from "../../constants/strings";
import { logout } from "../../store/authSlice";
import { useAppDispatch } from "../../store/hooks";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function LogoutConfirmModal({ open, onClose }: Props) {
  const dispatch = useAppDispatch();

  return (
    <ConfirmActionModal
      open={open}
      title={strings.auth.logout}
      message="Çıxış etmək istədiyinizdən əminsiniz?"
      onConfirm={() => {
        onClose();
        dispatch(logout());
      }}
      onCancel={onClose}
      danger
    />
  );
}
