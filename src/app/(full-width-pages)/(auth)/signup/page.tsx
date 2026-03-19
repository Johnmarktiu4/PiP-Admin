import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mr. Snow Admin",
  description: "",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
