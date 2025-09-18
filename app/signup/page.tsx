"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppStore } from "@/lib/store"
import { GraduationCap, Users, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState("student")

  const { students, teachers, setCurrentUser, setUserType } = useAppStore()
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    const studentId = formData.get("studentId") as string
    const classValue = formData.get("class") as string
    const teacherId = formData.get("teacherId") as string
    const department = formData.get("department") as string

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    // Validate password strength
    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    // Check if email already exists
    const emailExists = students.some((s) => s.email === email) || teachers.some((t) => t.email === email)

    if (emailExists) {
      setError("An account with this email already exists")
      setIsLoading(false)
      return
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      if (activeTab === "student") {
        if (!classValue.includes("B Tech")) {
          setError("Account creation is restricted to B Tech students only")
          setIsLoading(false)
          return
        }

        // Create new student
        const newStudent = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          email,
          studentId: studentId || `ST${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          class: classValue,
          avatar: `/student-${name.toLowerCase().split(" ")[0]}.jpg`,
        }

        // In a real app, this would be saved to a database
        setSuccess("Account created successfully! Redirecting to dashboard...")

        // Auto-login the new user
        setTimeout(() => {
          setCurrentUser(newStudent, "student")
          setUserType("student")
          router.push("/dashboard")
        }, 2000)
      } else {
        // Create new teacher
        const newTeacher = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          email,
          teacherId: teacherId || `T${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          department,
          avatar: `/teacher-${name.toLowerCase().split(" ")[0]}.jpg`,
        }

        // In a real app, this would be saved to a database
        setSuccess("Account created successfully! Redirecting to dashboard...")

        // Auto-login the new user
        setTimeout(() => {
          setCurrentUser(newTeacher, "teacher")
          setUserType("teacher")
          router.push("/teacher/dashboard")
        }, 2000)
      }
    } catch (err) {
      setError("An error occurred during signup")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground">Join Smart Scholar today</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create your Smart Scholar account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student" className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Student
                </TabsTrigger>
                <TabsTrigger value="teacher" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Teacher
                </TabsTrigger>
              </TabsList>

              <TabsContent value="student" className="space-y-4 mt-6">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" type="text" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="john@school.edu" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID (Optional)</Label>
                      <Input id="studentId" name="studentId" type="text" placeholder="ST001" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="class">Class</Label>
                      <Select name="class" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="B Tech CSE 1st Year">B Tech CSE 1st Year</SelectItem>
                          <SelectItem value="B Tech CSE 2nd Year">B Tech CSE 2nd Year</SelectItem>
                          <SelectItem value="B Tech CSE 3rd Year">B Tech CSE 3rd Year</SelectItem>
                          <SelectItem value="B Tech CSE 4th Year">B Tech CSE 4th Year</SelectItem>
                          <SelectItem value="B Tech IT 1st Year">B Tech IT 1st Year</SelectItem>
                          <SelectItem value="B Tech IT 2nd Year">B Tech IT 2nd Year</SelectItem>
                          <SelectItem value="B Tech IT 3rd Year">B Tech IT 3rd Year</SelectItem>
                          <SelectItem value="B Tech IT 4th Year">B Tech IT 4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Student Account"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="teacher" className="space-y-4 mt-6">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacher-name">Full Name</Label>
                    <Input id="teacher-name" name="name" type="text" placeholder="Dr. Jane Smith" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacher-email">Email</Label>
                    <Input id="teacher-email" name="email" type="email" placeholder="jane@school.edu" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="teacherId">Teacher ID (Optional)</Label>
                      <Input id="teacherId" name="teacherId" type="text" placeholder="T001" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select name="department" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Theory of Computation">Theory of Computation</SelectItem>
                          <SelectItem value="Database Management System">Database Management System</SelectItem>
                          <SelectItem value="Cyber Security">Cyber Security</SelectItem>
                          <SelectItem value="Linux Lab">Linux Lab</SelectItem>
                          <SelectItem value="Internet and Web Technology">Internet and Web Technology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacher-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="teacher-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacher-confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="teacher-confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Teacher Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
