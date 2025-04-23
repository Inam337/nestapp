import { redirect } from "next/navigation";
import MainLayout from "@/components/MainLayout";

export default function Home() {
  redirect("/dashboard");
}
