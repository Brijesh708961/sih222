"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { useAppStore } from "@/lib/store"
import { GraduationCap, Users, Calendar, BookOpen, CheckCircle, Clock, TrendingUp, Target } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { currentUser, userType, setUserType, initializeMockData, attendanceRecords, classes, learningTasks } =
    useAppStore()

  useEffect(() => {
    initializeMockData()
  }, [initializeMockData])

  const todayAttendance = attendanceRecords.filter((record) => {
    const today = new Date().toISOString().split("T")[0]
    return record.date === today
  })

  const presentCount = todayAttendance.filter((record) => record.status === "present").length
  const totalCount = todayAttendance.length
  const attendanceRate = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : "0.0"

  const activeClasses = classes.length
  const completedTasks = learningTasks.filter((task) => task.completed).length
  const totalTasks = learningTasks.length

  return (
    <div className="min-h-screen bg-background">
      <Navigation userType={userType} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Welcome to Smart Scholar</h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Smart educational platform with automated attendance tracking, personalized learning suggestions, and
            comprehensive schedule management for students and teachers.
          </p>

          {currentUser ? (
            <div className="flex justify-center gap-4 mb-8">
              <Button
                variant={userType === "student" ? "default" : "outline"}
                onClick={() => setUserType("student")}
                className="px-6"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Student View
              </Button>
              <Button
                variant={userType === "teacher" ? "default" : "outline"}
                onClick={() => setUserType("teacher")}
                className="px-6"
              >
                <Users className="w-4 h-4 mr-2" />
                Teacher View
              </Button>
            </div>
          ) : (
            <div className="flex justify-center gap-4 mb-8">
              <Link href="/login">
                <Button size="lg" className="px-8">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" size="lg" className="px-8 bg-transparent">
                  <Users className="w-4 h-4 mr-2" />
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-chart-1/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-chart-1" />
              </div>
              <CardTitle className="text-lg">Smart Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Automated attendance tracking using QR codes, proximity detection, and face recognition technology.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-6 h-6 text-chart-2" />
              </div>
              <CardTitle className="text-lg">Schedule Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Comprehensive timetable management with real-time updates and personalized daily routines.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <BookOpen className="w-6 h-6 text-chart-3" />
              </div>
              <CardTitle className="text-lg">Personalized Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                AI-powered learning suggestions during free periods based on interests and career goals.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-chart-4" />
              </div>
              <CardTitle className="text-lg">Analytics & Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Detailed analytics on attendance patterns, learning progress, and productivity metrics.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats - Now showing real data from store */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceRate}%</div>
              <p className="text-xs text-muted-foreground">
                {presentCount} of {totalCount} present
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeClasses}</div>
              <p className="text-xs text-muted-foreground">Classes available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Tasks</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {completedTasks}/{totalTasks}
              </div>
              <p className="text-xs text-muted-foreground">Tasks completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action - Updated to show different actions based on auth state */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
              <CardDescription className="text-lg">
                {currentUser
                  ? `Welcome back, ${currentUser.name}! Continue your educational journey.`
                  : "Join thousands of students and teachers already using Smart Scholar to streamline their educational experience."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              {currentUser ? (
                <>
                  <Link href={userType === "student" ? "/dashboard" : "/teacher/dashboard"}>
                    <Button size="lg" className="px-8">
                      <Clock className="w-4 h-4 mr-2" />
                      View Dashboard
                    </Button>
                  </Link>
                  <Link href="/attendance">
                    <Button variant="outline" size="lg" className="px-8 bg-transparent">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Track Attendance
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/signup">
                    <Button size="lg" className="px-8">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg" className="px-8 bg-transparent">
                      <Users className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
