// app/schedule/page.tsx - CREATE THIS NEW FILE
"use client";

import { useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { AuthGuard } from "@/components/auth-guard";
import { Calendar, Clock, MapPin, User } from "lucide-react";

export default function SchedulePage() {
  const { currentUser, classes, initializeMockData, isAuthenticated } =
    useAppStore();

  useEffect(() => {
    if (isAuthenticated && currentUser && classes.length === 0) {
      initializeMockData();
    }
  }, [isAuthenticated, currentUser, classes.length, initializeMockData]);

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  // Get user's classes - filter by students array if it exists, otherwise show all
  const userClasses = classes.filter((c) =>
    c.students ? c.students.includes(currentUser.id) : true
  );

  // Group classes by day
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const scheduleByDay = weekDays.reduce((acc, day) => {
    acc[day] = userClasses
      .filter((c) => c.schedule.some((s) => s.day === day))
      .map((c) => {
        const daySchedule = c.schedule.find((s) => s.day === day);
        return {
          id: c.id,
          className: c.name,
          instructor: c.instructor,
          startTime: daySchedule?.startTime || "",
          endTime: daySchedule?.endTime || "",
          room: daySchedule?.room || "",
        };
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    return acc;
  }, {} as Record<string, any[]>);

  return (
    <AuthGuard requiredUserType="student">
      <div className="min-h-screen bg-background">
        <Navigation userType="student" />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Class Schedule
            </h1>
            <p className="text-muted-foreground">
              Your weekly class schedule and timetable
            </p>
          </div>

          {/* Schedule Grid */}
          <div className="grid gap-6">
            {weekDays.map((day) => (
              <Card key={day}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {day}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {scheduleByDay[day].length > 0 ? (
                    <div className="space-y-3">
                      {scheduleByDay[day].map((classItem, index) => (
                        <div
                          key={`${classItem.id}-${index}`}
                          className="flex items-center justify-between p-4 bg-muted rounded-lg"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">
                              {classItem.className}
                            </h4>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {classItem.instructor}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {classItem.startTime} - {classItem.endTime}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                Room {classItem.room}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No classes scheduled for {day}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
