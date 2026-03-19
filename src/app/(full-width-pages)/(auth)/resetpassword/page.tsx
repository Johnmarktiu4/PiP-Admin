import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mr. Snow Admin",
  description: "",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
