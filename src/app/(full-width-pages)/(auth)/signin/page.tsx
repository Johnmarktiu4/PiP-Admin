import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Porta Vaga Admin",
  description: "",
};

export default function SignIn() {
  return <SignInForm />;
}
