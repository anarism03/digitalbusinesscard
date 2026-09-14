import { Navigate, useParams } from "react-router-dom";

export default function NfcCardRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/v/${id}?source=nfc`} replace />;
}
