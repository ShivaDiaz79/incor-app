import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Registro | INCOR",
	description: "Esta es la página de registro de INCOR",
};

export default function SignUp() {
	return <SignUpForm />;
}
