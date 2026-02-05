import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardContent from "../components/Dashboard";
import Navbar from "../components/NavBar";
import { CloudUpload } from "lucide-react";

export default async function Dashboard() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  // Serialize user to avoid passing Clerk class instances
  const serializedUser = user
    ? {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        username: user.username,
        emailAddress: user.emailAddresses?.[0]?.emailAddress,
      }
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar user={serializedUser} />

      <main className="flex-1 container mx-auto px-6 py-8">
        <DashboardContent
          userId={userId}
          userName={
            user?.firstName ||
            user?.fullName ||
            user?.emailAddresses?.[0]?.emailAddress ||
            ""
          }
        />
      </main>

      <footer className="border-t bg-background py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CloudUpload className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">Fylr</span>
          </div>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Fylr
          </p>
        </div>
      </footer>
    </div>
  );
}
