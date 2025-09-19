"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { AuthGuard } from "@/components/auth-guard";
import { RealtimeQRScanner } from "@/components/realtime-qr-scanner";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  TrendingUp,
  QrCode,
  Download,
  RefreshCw,
} from "lucide-react";

interface ScannedStudent {
  id: string;
  name: string;
  studentId: string;
  scanTime: string;
  status: "present" | "late";
}

export default function FacultyAttendancePage() {
  const {
    currentUser,
    classes,
    attendanceRecords,
    getAttendanceByClass,
    isAuthenticated,
  } = useAppStore();

  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [scannedStudents, setScannedStudents] = useState<ScannedStudent[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(false);

  useEffect(() => {
    if (isAuthenticated && currentUser && classes.length === 0) {
      // Initialize data if needed
    }
  }, [isAuthenticated, currentUser, classes.length]);

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  // Get classes taught by current faculty member
  const facultyClasses = classes.filter(
    (c) => c.instructor === currentUser.name
  );

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  // Get attendance records for selected class
  const classAttendanceRecords = selectedClassId
    ? getAttendanceByClass(selectedClassId)
    : [];

  // Calculate attendance statistics for selected class
  const attendanceStats = {
    totalStudents: selectedClass?.students?.length || 0,
    presentToday: classAttendanceRecords.filter(
      (r) =>
        r.date === new Date().toISOString().split("T")[0] &&
        r.status === "present"
    ).length,
    lateToday: classAttendanceRecords.filter(
      (r) =>
        r.date === new Date().toISOString().split("T")[0] && r.status === "late"
    ).length,
    absentToday: 0, // Will be calculated as total - present - late
  };

  attendanceStats.absentToday = Math.max(
    0,
    attendanceStats.totalStudents -
      attendanceStats.presentToday -
      attendanceStats.lateToday
  );

  const attendancePercentage =
    attendanceStats.totalStudents > 0
      ? Math.round(
          ((attendanceStats.presentToday + attendanceStats.lateToday) /
            attendanceStats.totalStudents) *
            100
        )
      : 0;

  const handleAttendanceUpdate = (scannedStudents: ScannedStudent[]) => {
    setScannedStudents(scannedStudents);
  };

  const startAttendanceSession = () => {
    setIsSessionActive(true);
    setScannedStudents([]);
  };

  const endAttendanceSession = () => {
    setIsSessionActive(false);
    setScannedStudents([]);
  };

  const exportAttendance = () => {
    if (!selectedClass || scannedStudents.length === 0) return;

    const csvContent = [
      ["Student ID", "Name", "Status", "Scan Time", "Date"],
      ...scannedStudents.map((student) => [
        student.studentId,
        student.name,
        student.status,
        student.scanTime,
        new Date().toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedClass.name}_attendance_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AuthGuard requiredUserType="faculty">
      <div className="min-h-screen bg-background">
        <Navigation userType="faculty" />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Attendance Management
            </h1>
            <p className="text-muted-foreground">
              Manage class attendance with real-time QR code scanning
            </p>
          </div>

          {/* Class Selection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Class</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {facultyClasses.map((classItem) => (
                  <Button
                    key={classItem.id}
                    variant={
                      selectedClassId === classItem.id ? "default" : "outline"
                    }
                    onClick={() => setSelectedClassId(classItem.id)}
                    className="flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    {classItem.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedClass && (
            <>
              {/* Class Information */}
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        {selectedClass.name}
                      </CardTitle>
                      <p className="text-muted-foreground">
                        Room: {selectedClass.schedule[0]?.room} • Time:{" "}
                        {selectedClass.schedule[0]?.startTime} -{" "}
                        {selectedClass.schedule[0]?.endTime}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!isSessionActive ? (
                        <Button
                          onClick={startAttendanceSession}
                          className="flex items-center gap-2"
                        >
                          <QrCode className="h-4 w-4" />
                          Start Attendance Session
                        </Button>
                      ) : (
                        <Button
                          onClick={endAttendanceSession}
                          variant="destructive"
                          className="flex items-center gap-2"
                        >
                          <XCircle className="h-4 w-4" />
                          End Session
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Real-time Statistics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Attendance Rate
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {attendancePercentage}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {attendanceStats.presentToday + attendanceStats.lateToday}{" "}
                      of {attendanceStats.totalStudents} students
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Present
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {attendanceStats.presentToday}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      On time arrivals
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Late</CardTitle>
                    <Clock className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {attendanceStats.lateToday}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Late arrivals
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Absent
                    </CardTitle>
                    <XCircle className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {attendanceStats.absentToday}
                    </div>
                    <p className="text-xs text-muted-foreground">Not present</p>
                  </CardContent>
                </Card>
              </div>

              {/* QR Scanner Section */}
              {isSessionActive && (
                <div className="mb-8">
                  <RealtimeQRScanner
                    classId={selectedClassId}
                    onAttendanceUpdate={handleAttendanceUpdate}
                  />
                </div>
              )}

              {/* Export and Actions */}
              {scannedStudents.length > 0 && (
                <Card className="mb-8">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Session Summary ({scannedStudents.length} students
                        scanned)
                      </CardTitle>
                      <Button
                        onClick={exportAttendance}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Export CSV
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {scannedStudents.map((student, index) => (
                        <div
                          key={`${student.id}-${index}`}
                          className="flex items-center justify-between p-3 rounded-lg border bg-card"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                {student.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {student.studentId} • {student.scanTime}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant={
                              student.status === "present"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              student.status === "present"
                                ? "bg-green-100 text-green-800"
                                : "bg-orange-100 text-orange-800"
                            }
                          >
                            {student.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Attendance Records */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Recent Attendance Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {classAttendanceRecords.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {classAttendanceRecords
                        .sort(
                          (a, b) =>
                            new Date(b.timestamp).getTime() -
                            new Date(a.timestamp).getTime()
                        )
                        .slice(0, 20)
                        .map((record) => {
                          const student = selectedClass.students?.find(
                            (s) => s === record.studentId
                          );
                          return (
                            <div
                              key={record.id}
                              className="flex items-center justify-between p-3 rounded-lg border"
                            >
                              <div className="flex items-center gap-3">
                                {record.status === "present" && (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                                {record.status === "late" && (
                                  <Clock className="w-4 h-4 text-orange-600" />
                                )}
                                {record.status === "absent" && (
                                  <XCircle className="w-4 h-4 text-red-600" />
                                )}
                                <div>
                                  <p className="font-medium">
                                    Student ID: {record.studentId}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(
                                      record.timestamp
                                    ).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {record.method}
                                </Badge>
                                <Badge
                                  variant={
                                    record.status === "present"
                                      ? "default"
                                      : record.status === "late"
                                      ? "secondary"
                                      : "destructive"
                                  }
                                >
                                  {record.status}
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No attendance records for this class yet
                    </p>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
