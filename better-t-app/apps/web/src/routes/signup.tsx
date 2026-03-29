import { createFileRoute, useNavigate } from "@tanstack/react-router";import { createFileRoute } from '@tanstack/react-router'












}  return <SignUpForm onSwitchToSignIn={() => navigate({ to: "/login" })} />;  const navigate = useNavigate();function SignupPage() {});  component: SignupPage,export const Route = createFileRoute("/signup")({import SignUpForm from "@/components/sign-up-form";
export const Route = createFileRoute('/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/signup"!</div>
}
