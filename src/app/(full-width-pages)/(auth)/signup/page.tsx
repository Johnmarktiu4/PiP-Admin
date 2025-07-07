import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PiP Tea Admin",
  description: "",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
