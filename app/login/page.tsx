// app/login/page.tsx - CREATE THIS NEW FILE
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { User, Lock, UserCheck } from "lucide-react";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    userType: "student" as "student" | "faculty" | "admin",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAppStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const success = login(credentials);

    if (success) {
      // Redirect based on user type
      if (credentials.userType === "student") {
        router.push("/dashboard");
      } else if (credentials.userType === "faculty") {
        router.push("/faculty-dashboard");
      } else {
        router.push("/admin-dashboard");
      }
    } else {
      setError("Invalid email or password");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Smart Scholar Login
          </CardTitle>
          <p className="text-muted-foreground">
            Enter your credentials to access your dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                required
                className="w-full p-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="student@test.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                required
                className="w-full p-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="password"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                Login as
              </label>
              <select
                value={credentials.userType}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    userType: e.target.value as "student" | "faculty" | "admin",
                  })
                }
                className="w-full p-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-3 bg-muted rounded-md">
            <p className="text-sm font-medium mb-2">Demo Credentials:</p>
            <div className="text-xs space-y-1">
              <p>Student: student@test.com / password</p>
              <p>Faculty: faculty@test.com / password</p>
              <p>Admin: admin@test.com / password</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
