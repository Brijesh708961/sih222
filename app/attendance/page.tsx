// app/attendance/page.tsx - CREATE THIS NEW FILE
"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { AuthGuard } from "@/components/auth-guard";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  QrCode,
  Copy,
  Download,
} from "lucide-react";

export default function AttendancePage() {
  const {
    currentUser,
    classes,
    attendanceRecords,
    getAttendanceByStudent,
    initializeMockData,
    isAuthenticated,
    generateStudentQR,
  } = useAppStore();

  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string>("");

  useEffect(() => {
    if (isAuthenticated && currentUser && classes.length === 0) {
      initializeMockData();
    }
  }, [isAuthenticated, currentUser, classes.length, initializeMockData]);

  const generateQRCode = () => {
    if (currentUser) {
      const qrData = generateStudentQR(currentUser.id);
      setQrCodeData(qrData);
      setShowQRCode(true);
    }
  };

  const copyQRData = () => {
    navigator.clipboard.writeText(qrCodeData);
  };

  const downloadQRData = () => {
    const blob = new Blob([qrCodeData], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qr_code_${currentUser?.id || "student"}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  // Get user's attendance records
  const userAttendanceRecords = getAttendanceByStudent(currentUser.id);

  // Calculate attendance statistics
  const attendanceStats = {
    totalClasses: userAttendanceRecords.length,
    presentCount: userAttendanceRecords.filter((r) => r.status === "present")
      .length,
    lateCount: userAttendanceRecords.filter((r) => r.status === "late").length,
    absentCount: userAttendanceRecords.filter((r) => r.status === "absent")
      .length,
  };

  const attendancePercentage =
    attendanceStats.totalClasses > 0
      ? Math.round(
          (attendanceStats.presentCount / attendanceStats.totalClasses) * 100
        )
      : 0;

  // Group attendance by class
  const attendanceByClass = classes
    .filter((c) => c.students?.includes(currentUser.id))
    .map((classItem) => {
      const classAttendance = userAttendanceRecords.filter(
        (r) => r.classId === classItem.id
      );
      const present = classAttendance.filter(
        (r) => r.status === "present"
      ).length;
      const total = classAttendance.length;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

      return {
        class: classItem,
        attendance: classAttendance,
        stats: {
          total,
          present,
          late: classAttendance.filter((r) => r.status === "late").length,
          absent: classAttendance.filter((r) => r.status === "absent").length,
          percentage,
        },
      };
    });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "late":
        return <Clock className="w-4 h-4 text-orange-600" />;
      case "absent":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "text-green-600 bg-green-50 border-green-200";
      case "late":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "absent":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <AuthGuard requiredUserType="student">
      <div className="min-h-screen bg-background">
        <Navigation userType="student" />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Attendance Overview
            </h1>
            <p className="text-muted-foreground">
              Track your class attendance and participation
            </p>
          </div>

          {/* QR Code Generation Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Your Attendance QR Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Generate your personal QR code for attendance scanning. Show
                  this QR code to your instructor during class.
                </p>

                {!showQRCode ? (
                  <Button
                    onClick={generateQRCode}
                    className="flex items-center gap-2"
                  >
                    <QrCode className="h-4 w-4" />
                    Generate My QR Code
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          QR Code Data:
                        </span>
                        <div className="flex gap-2">
                          <Button
                            onClick={copyQRData}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Copy className="h-3 w-3" />
                            Copy
                          </Button>
                          <Button
                            onClick={downloadQRData}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Download className="h-3 w-3" />
                            Download
                          </Button>
                        </div>
                      </div>
                      <code className="text-xs break-all bg-background p-2 rounded block">
                        {qrCodeData}
                      </code>
                    </div>

                    <div className="text-center">
                      <div className="inline-block p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg">
                        <div className="text-6xl">📱</div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Show this QR code to your instructor
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button
                        onClick={() => setShowQRCode(false)}
                        variant="outline"
                        size="sm"
                      >
                        Hide QR Code
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Overall Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Overall Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {attendancePercentage}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {attendanceStats.presentCount} of{" "}
                  {attendanceStats.totalClasses} classes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Present</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {attendanceStats.presentCount}
                </div>
                <p className="text-xs text-muted-foreground">
                  Classes attended
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
                  {attendanceStats.lateCount}
                </div>
                <p className="text-xs text-muted-foreground">Late arrivals</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Absent</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {attendanceStats.absentCount}
                </div>
                <p className="text-xs text-muted-foreground">Classes missed</p>
              </CardContent>
            </Card>
          </div>

          {/* Attendance by Class */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Attendance by Class</h2>

            {attendanceByClass.map((item) => (
              <Card key={item.class.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {item.class.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Instructor: {item.class.instructor}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {item.stats.percentage}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.stats.present} of {item.stats.total}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {item.attendance.length > 0 ? (
                    <div className="space-y-2">
                      {item.attendance
                        .sort(
                          (a, b) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime()
                        )
                        .slice(0, 10) // Show last 10 records
                        .map((record) => (
                          <div
                            key={record.id}
                            className="flex items-center justify-between p-3 rounded-lg border"
                          >
                            <div className="flex items-center gap-3">
                              {getStatusIcon(record.status)}
                              <span className="font-medium">
                                {new Date(record.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(
                                record.status
                              )}`}
                            >
                              {record.status}
                            </span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No attendance records for this class yet
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
