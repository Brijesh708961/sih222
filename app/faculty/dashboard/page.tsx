import { redirect } from "next/navigation";

export default function FacultyDashboardRedirect() {
  redirect("/teacher/dashboard");
}
