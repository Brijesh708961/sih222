// app/dashboard/page.tsx - COMPLETE FIXED FILE
"use client";

import { useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { AuthGuard } from "@/components/auth-guard";
import {
  Calendar,
  TrendingUp,
  Bell,
  BookOpen,
  Clock,
  CheckCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QRCodeCanvas } from "qrcode.react";

export default function DashboardPage() {
  // ✅ FIXED: Move all hooks INSIDE the component function
  const {
    currentUser,
    classes,
    attendanceRecords,
    learningTasks,
    getAttendanceByStudent,
    initializeMockData,
    toggleTaskCompletion,
    isAuthenticated, // ✅ Now properly inside the component
  } = useAppStore();

  useEffect(() => {
    // Only initialize if user is authenticated and data doesn't exist
    if (isAuthenticated && currentUser && classes.length === 0) {
      initializeMockData();
    }
  }, [isAuthenticated, currentUser, classes.length, initializeMockData]);

  // Get user's attendance records
  const userAttendanceRecords = currentUser
    ? getAttendanceByStudent(currentUser.id)
    : [];

  // Calculate attendance rate for the week
  const weekAttendanceRate =
    userAttendanceRecords.length > 0
      ? Math.round(
          (userAttendanceRecords.filter((r) => r.status === "present").length /
            userAttendanceRecords.length) *
            100
        )
      : 0;

  // Get today's classes
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const upcomingClasses = classes
    .filter((c) => c.schedule.some((s) => s.day === today))
    .map((c) => {
      const todaySchedule = c.schedule.find((s) => s.day === today);
      return {
        id: c.id,
        subject: c.name,
        time: todaySchedule
          ? `${todaySchedule.startTime} - ${todaySchedule.endTime}`
          : "TBD",
        room: todaySchedule?.room || "TBD",
        status: "upcoming",
      };
    });

  // Get user's learning tasks
  const userTasks = learningTasks.slice(0, 3);

  // Calculate weekly stats
  const weeklyStats = {
    attendanceRate: weekAttendanceRate,
    tasksCompleted: learningTasks.filter((t) => t.completed).length,
    studyHours: userAttendanceRecords.length * 1.5, // Estimate study hours
    averageGrade: 87.3, // Mock data for now
  };

  const handleTaskAction = (taskId: string) => {
    toggleTaskCompletion(taskId);
  };

  // ✅ UPDATED: Better loading check
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <AuthGuard requiredUserType="student">
      <div className="min-h-screen bg-background">
        <Navigation userType="student" />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Good morning, {currentUser.name}!
              </h1>
              <p className="text-muted-foreground">
                Here's your academic overview for today
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                View Schedule
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm">
                    Show QR Code
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Attendance QR</DialogTitle>
                    <DialogDescription>
                      Present this QR to your teacher to mark attendance.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="w-full flex items-center justify-center py-2">
                    <QRCodeCanvas
                      value={JSON.stringify({
                        type: "attendance",
                        studentId: currentUser.id,
                        name: currentUser.name,
                        issuedAt: new Date().toISOString(),
                      })}
                      size={224}
                      level="M"
                      includeMargin
                    />
                  </div>
                  <div className="text-xs text-muted-foreground text-center">
                    {currentUser.name} • ID: {currentUser.id}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Attendance Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {weeklyStats.attendanceRate}%
                </div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tasks Completed
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {weeklyStats.tasksCompleted}
                </div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Study Hours
                </CardTitle>
                <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {weeklyStats.studyHours.toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Grade
                </CardTitle>
                <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {weeklyStats.averageGrade}%
                </div>
                <p className="text-xs text-muted-foreground">This semester</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingClasses.length > 0 ? (
                    upcomingClasses.map((classItem) => (
                      <div
                        key={classItem.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium">{classItem.subject}</h4>
                          <p className="text-sm text-muted-foreground">
                            {classItem.time}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Room {classItem.room}
                          </p>
                        </div>
                        <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                          Upcoming
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No classes scheduled for today
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Learning Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Personalized Learning Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {task.subject}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Due: {task.dueDate}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant={task.completed ? "default" : "outline"}
                        onClick={() => handleTaskAction(task.id)}
                      >
                        {task.completed ? "Completed" : "Mark Done"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
