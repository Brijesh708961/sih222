"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { useAppStore } from "@/lib/store"
import { CalendarIcon, Clock, MapPin, Users, ChevronLeft, ChevronRight, Plus, Bell, BookOpen, Edit } from "lucide-react"

export default function TeacherSchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const { currentUser, classes, students, getAttendanceByClass, initializeMockData } = useAppStore()

  useEffect(() => {
    // Initialize mock data if not already done
    if (classes.length === 0) {
      initializeMockData()
    }
  }, [classes.length, initializeMockData])

  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const currentDate = new Date()
  const weekStart = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + currentWeek * 7))

  // Get teacher's classes and organize by day
  const teacherClasses = currentUser ? classes.filter((c) => c.teacherId === currentUser.id) : classes // Show all classes if no specific teacher

  const scheduleByDay = weekDays.reduce(
    (acc, day) => {
      acc[day] = []
      teacherClasses.forEach((classItem) => {
        const daySchedule = classItem.schedule.filter((s) => s.day === day)
        daySchedule.forEach((schedule) => {
          const todayDate = new Date().toISOString().split("T")[0]
          const todayAttendance = getAttendanceByClass(classItem.id).filter((r) => r.date === todayDate)
          const presentCount = todayAttendance.filter((r) => r.status === "present").length

          acc[day].push({
            id: classItem.id,
            subject: classItem.name,
            time: `${schedule.startTime} - ${schedule.endTime}`,
            room: schedule.room,
            students: classItem.students.length,
            attendance: presentCount,
            type: "lecture",
            status: "upcoming",
          })
        })
      })
      return acc
    },
    {} as Record<string, any[]>,
  )

  // Get today's classes
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" })
  const todayClasses = scheduleByDay[today] || []

  const upcomingTasks = [
    { title: "Prepare Math Quiz", date: "Tomorrow", time: "Before 9:00 AM", type: "preparation" },
    { title: "Grade Physics Reports", date: "Jan 18", time: "End of day", type: "grading" },
    { title: "Parent-Teacher Meeting", date: "Jan 20", time: "2:00 PM", type: "meeting" },
    { title: "Department Meeting", date: "Jan 25", time: "10:00 AM", type: "meeting" },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "lecture":
        return "bg-chart-1/10 text-chart-1"
      case "lab":
        return "bg-chart-2/10 text-chart-2"
      case "meeting":
        return "bg-chart-3/10 text-chart-3"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case "preparation":
        return "bg-chart-4/10 text-chart-4"
      case "grading":
        return "bg-chart-5/10 text-chart-5"
      case "meeting":
        return "bg-chart-3/10 text-chart-3"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation userType="teacher" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Teaching Schedule</h1>
            <p className="text-muted-foreground">Manage your classes and teaching calendar</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Reminders
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Class
            </Button>
          </div>
        </div>

        <Tabs defaultValue="weekly" className="space-y-6">
          <TabsList>
            <TabsTrigger value="weekly">Weekly View</TabsTrigger>
            <TabsTrigger value="daily">Daily View</TabsTrigger>
            <TabsTrigger value="monthly">Monthly View</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Weekly Schedule */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5" />
                        Weekly Teaching Schedule
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setCurrentWeek(currentWeek - 1)}>
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-medium px-3">Week of {weekStart.toLocaleDateString()}</span>
                        <Button variant="outline" size="sm" onClick={() => setCurrentWeek(currentWeek + 1)}>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {weekDays.slice(1, 6).map(
                        (
                          day, // Show Monday to Friday
                        ) => (
                          <div key={day} className="space-y-3">
                            <h3 className="font-semibold text-lg border-b border-border pb-2">{day}</h3>
                            <div className="space-y-2">
                              {scheduleByDay[day]?.length > 0 ? (
                                scheduleByDay[day].map((class_, index) => (
                                  <div key={index} className="p-3 rounded-lg border border-border">
                                    <div className="flex items-start justify-between mb-2">
                                      <h4 className="font-medium text-sm">{class_.subject}</h4>
                                      <div className="flex items-center gap-1">
                                        <Badge variant="secondary" className={getTypeColor(class_.type)}>
                                          {class_.type}
                                        </Badge>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                          <Edit className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div>
                                    <div className="space-y-1 text-xs text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{class_.time}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        <span>{class_.room}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        <span>{class_.students} students</span>
                                      </div>
                                    </div>
                                    {class_.attendance > 0 && (
                                      <div className="mt-2 pt-2 border-t border-border">
                                        <div className="flex justify-between text-xs">
                                          <span>Today's Attendance</span>
                                          <span className="font-medium">
                                            {class_.attendance}/{class_.students} (
                                            {Math.round((class_.attendance / class_.students) * 100)}%)
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-4">
                                  <p className="text-sm text-muted-foreground">No classes</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Today's Classes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Today's Classes</CardTitle>
                    <CardDescription>
                      {today}, {new Date().toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {todayClasses.length > 0 ? (
                        todayClasses.slice(0, 3).map((class_, index) => (
                          <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{class_.subject}</p>
                              <p className="text-xs text-muted-foreground">
                                {class_.time.split(" - ")[0]} • {class_.room}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-sm text-muted-foreground">No classes today</p>
                        </div>
                      )}
                    </div>
                    <Button variant="outline" className="w-full mt-4 bg-transparent">
                      View All Classes
                    </Button>
                  </CardContent>
                </Card>

                {/* Upcoming Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Upcoming Tasks</CardTitle>
                    <CardDescription>Teaching preparations and deadlines</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {upcomingTasks.map((task, index) => (
                        <div key={index} className="p-3 rounded-lg border border-border">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm">{task.title}</h4>
                            <Badge variant="secondary" className={getTaskTypeColor(task.type)}>
                              {task.type}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-3 h-3" />
                              <span>{task.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{task.time}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Schedule Class
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Bell className="w-4 h-4 mr-2" />
                      Set Reminder
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Lesson Planner
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="daily">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Teaching Schedule</CardTitle>
                    <CardDescription>Detailed view of today's classes and activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {todayClasses.length > 0 ? (
                        todayClasses.map((class_, index) => (
                          <div key={index} className="p-4 rounded-lg border border-border">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-medium">{class_.subject}</h4>
                                <p className="text-sm text-muted-foreground">{class_.time}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className={getTypeColor(class_.type)}>
                                  {class_.type}
                                </Badge>
                                <Button variant="outline" size="sm">
                                  Take Attendance
                                </Button>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{class_.room}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span>{class_.students} students</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {class_.attendance > 0
                                    ? `${Math.round((class_.attendance / class_.students) * 100)}% present`
                                    : "Not started"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No classes scheduled for today</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Select Date</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monthly">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Teaching Calendar</CardTitle>
                    <CardDescription>Overview of your teaching schedule</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border w-full"
                    />
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Overview</CardTitle>
                    <CardDescription>Teaching statistics this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="font-medium text-sm">Total Classes</p>
                        <p className="text-2xl font-bold text-chart-1">{teacherClasses.length * 12}</p>
                        <p className="text-xs text-muted-foreground">This month</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="font-medium text-sm">Total Students</p>
                        <p className="text-2xl font-bold text-chart-2">
                          {teacherClasses.reduce((acc, c) => acc + c.students.length, 0)}
                        </p>
                        <p className="text-xs text-muted-foreground">Across all classes</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="font-medium text-sm">Upcoming Tasks</p>
                        <p className="text-2xl font-bold text-chart-3">{upcomingTasks.length}</p>
                        <p className="text-xs text-muted-foreground">Next 30 days</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
