import { redirect } from "next/navigation";

export default function FacultyRedirect() {
  redirect("/teacher/dashboard");
}
