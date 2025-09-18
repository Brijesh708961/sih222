"use client";

import { useState, useEffect, useCallback } from "react";
import { Navigation } from "@/components/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import {
  CheckCircle,
  X,
  Users,
  Calendar,
  Search,
  Filter,
  Download,
  QrCode,
  Monitor,
  List,
} from "lucide-react";
import { FaceRecognitionAttendance } from "@/components/face-recognition-attendance";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const QrScanner = dynamic(
  () => import("react-qr-barcode-scanner").then((m) => m.default),
  { ssr: false }
);

export default function TeacherAttendancePage() {
  const [selectedClass, setSelectedClass] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isStudentListOpen, setIsStudentListOpen] = useState(false);
  const [scannedRecords, setScannedRecords] = useState<any[]>([]);

  const {
    classes,
    students,
    attendanceRecords,
    markAttendance,
    getAttendanceByClass,
  } = useAppStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0].id);
    }
  }, [classes, selectedClass]);

  useEffect(() => {
    if (searchParams.get("scanner") === "1") {
      setIsScannerOpen(true);
    }
  }, [searchParams]);

  const currentClassData = classes.find((c) => c.id === selectedClass);
  const classStudents = currentClassData
    ? students.filter((s) => currentClassData.students.includes(s.id))
    : [];

  const today = new Date().toISOString().split("T")[0];
  const todayAttendance = selectedClass
    ? getAttendanceByClass(selectedClass).filter(
        (record) => record.date === today
      )
    : [];

  const studentsWithAttendance = classStudents.map((student) => {
    const attendanceRecord = todayAttendance.find(
      (record) => record.studentId === student.id
    );
    return {
      id: student.id,
      name: student.name,
      rollNo: student.studentId,
      status: attendanceRecord?.status || "absent",
      time: attendanceRecord
        ? new Date(attendanceRecord.timestamp).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "-",
      method: attendanceRecord?.method || "-",
      isQRScanned: attendanceRecord?.method === "qr",
    };
  });

  const attendanceStats = {
    present: studentsWithAttendance.filter((s) => s.status === "present")
      .length,
    absent: studentsWithAttendance.filter((s) => s.status === "absent").length,
    late: studentsWithAttendance.filter((s) => s.status === "late").length,
    total: studentsWithAttendance.length,
  };

  const filteredStudents = studentsWithAttendance.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAttendance = (studentId: string) => {
    const student = studentsWithAttendance.find((s) => s.id === studentId);
    if (!student || !selectedClass) return;

    const newStatus = student.status === "present" ? "absent" : "present";

    // Remove existing attendance record for today
    // In a real app, this would be handled by the backend

    // Add new attendance record
    markAttendance({
      studentId: studentId,
      classId: selectedClass,
      date: today,
      status: newStatus,
      method: "manual",
    });

    console.log(
      `[v0] Toggled attendance for student ${studentId} to ${newStatus}`
    );
  };

  const handleScan = useCallback(
    (data: any) => {
      try {
        if (!data || !selectedClass) return;
        const text = typeof data === "string" ? data : data?.text;
        if (!text) return;
        const payload = JSON.parse(text);
        if (payload?.type !== "attendance" || !payload?.studentId) return;
        
        // Mark attendance
        markAttendance({
          studentId: payload.studentId,
          classId: selectedClass,
          date: today,
          status: "present",
          method: "qr",
        });

        // Add to scanned records for display
        const student = students.find(s => s.id === payload.studentId);
        const newRecord = {
          id: Date.now().toString(),
          studentId: payload.studentId,
          studentName: student?.name || "Unknown Student",
          rollNo: student?.studentId || payload.studentId,
          timestamp: new Date().toISOString(),
          method: "qr",
          status: "present"
        };
        
        setScannedRecords(prev => [newRecord, ...prev]);
        setIsScannerOpen(false);
        
        // Show success message
        alert(`✅ QR Scan successful!\n${student?.name} has been marked present via QR code.`);
        console.log(`✅ QR Scan successful: ${student?.name} marked present`);
      } catch (e) {
        console.error("QR parse error", e);
      }
    },
    [markAttendance, selectedClass, today, students]
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation userType="teacher" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Attendance Management
            </h1>
            <p className="text-muted-foreground">
              Track and manage student attendance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQRCode(!showQRCode)}
            >
              <QrCode className="w-4 h-4 mr-2" />
              {showQRCode ? "Hide QR Code" : "Show QR Code"}
            </Button>
            <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <QrCode className="w-4 h-4 mr-2" />
                  Open Scanner
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Scan Student QR</DialogTitle>
                  <DialogDescription>
                    Point the camera at the student's QR code.
                  </DialogDescription>
                </DialogHeader>
                <div className="aspect-square w-full overflow-hidden rounded-md">
                  <QrScanner
                    onUpdate={(err, result) => {
                      if (result?.text) handleScan(result.text);
                    }}
                    constraints={{ facingMode: "environment" }}
                  />
                </div>
              </DialogContent>
            </Dialog>
            <Dialog
              open={isStudentListOpen}
              onOpenChange={setIsStudentListOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <List className="w-4 h-4 mr-2" />
                  Show Students
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>
                    Students in {currentClassData?.name || "Class"}
                  </DialogTitle>
                  <DialogDescription>
                    Tap a student to toggle attendance.
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto space-y-2">
                  {classStudents.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div>
                        <p className="font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Roll No: {s.studentId}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleAttendance(s.id)}
                      >
                        Toggle
                      </Button>
                    </div>
                  ))}
                  {classStudents.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No students in this class.
                    </p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm">
              <Monitor className="w-4 h-4 mr-2" />
              Display Mode
            </Button>
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {showQRCode && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>QR Code for Attendance</CardTitle>
              <CardDescription>
                Students can scan this code to mark their attendance
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="w-48 h-48 mx-auto bg-muted rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <QrCode className="w-24 h-24 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Class QR Code</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {currentClassData?.name || "Select a class"}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Display this QR code on the classroom screen for students to
                scan
              </p>
            </CardContent>
          </Card>
        )}

        {/* Class Selection and Stats */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Select Class</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((class_) => (
                    <SelectItem key={class_.id} value={class_.id}>
                      {class_.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present</CardTitle>
              <CheckCircle className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-2">
                {attendanceStats.present}
              </div>
              <p className="text-xs text-muted-foreground">
                {attendanceStats.total > 0
                  ? Math.round(
                      (attendanceStats.present / attendanceStats.total) * 100
                    )
                  : 0}
                % of class
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
              <X className="h-4 w-4 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-4">
                {attendanceStats.absent}
              </div>
              <p className="text-xs text-muted-foreground">
                {attendanceStats.total > 0
                  ? Math.round(
                      (attendanceStats.absent / attendanceStats.total) * 100
                    )
                  : 0}
                % of class
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">QR Scanned</CardTitle>
              <QrCode className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {studentsWithAttendance.filter(s => s.isQRScanned).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {attendanceStats.present > 0
                  ? Math.round(
                      (studentsWithAttendance.filter(s => s.isQRScanned).length / attendanceStats.present) * 100
                    )
                  : 0}
                % of present
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="current" className="space-y-6">
          <TabsList>
            <TabsTrigger value="current">Current Session</TabsTrigger>
            <TabsTrigger value="scanned">Scanned Records</TabsTrigger>
            <TabsTrigger value="face-recognition">Face Recognition</TabsTrigger>
            <TabsTrigger value="history">Attendance History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Current Class Attendance</CardTitle>
                    <CardDescription>
                      {currentClassData?.name || "Select a class"} • Today,{" "}
                      {new Date().toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Roll No: {student.rollNo}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {student.status !== "absent" && (
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {student.time}
                              </p>
                              <div className="flex items-center gap-1">
                                <p className="text-xs text-muted-foreground capitalize">
                                  {student.method}
                                </p>
                                {student.isQRScanned && (
                                  <QrCode className="w-3 h-3 text-green-600" />
                                )}
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                student.status === "present"
                                  ? "secondary"
                                  : student.status === "late"
                                  ? "default"
                                  : "destructive"
                              }
                              className={
                                student.status === "present"
                                  ? student.isQRScanned
                                    ? "bg-green-100 text-green-800 border-green-200"
                                    : "bg-chart-2/10 text-chart-2"
                                  : student.status === "late"
                                  ? "bg-chart-1/10 text-chart-1"
                                  : "bg-chart-4/10 text-chart-4"
                              }
                            >
                              {student.status}
                              {student.isQRScanned && " (QR)"}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleAttendance(student.id)}
                            >
                              Toggle
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {selectedClass
                          ? "No students found"
                          : "Please select a class to view students"}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scanned">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>QR Scanned Attendance</CardTitle>
                    <CardDescription>
                      Real-time list of students who scanned their QR codes
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {scannedRecords.length} Scanned Today
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setScannedRecords([])}
                    >
                      Clear List
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {scannedRecords.length > 0 ? (
                    scannedRecords.map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-green-200 bg-green-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <QrCode className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-green-900">{record.studentName}</p>
                            <p className="text-sm text-green-700">
                              Roll No: {record.rollNo}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-medium text-green-900">
                              {new Date(record.timestamp).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              })}
                            </p>
                            <p className="text-xs text-green-600 capitalize">
                              {record.method} scan
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Present
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <QrCode className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No QR scans recorded yet
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Students can scan their QR codes to appear here
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="face-recognition">
            <div className="grid lg:grid-cols-2 gap-6">
              <FaceRecognitionAttendance
                classId={selectedClass}
                onAttendanceMarked={(studentId, status) => {
                  console.log(
                    `[v0] Face recognition marked ${studentId} as ${status}`
                  );
                }}
              />

              <Card>
                <CardHeader>
                  <CardTitle>Face Recognition Settings</CardTitle>
                  <CardDescription>
                    Configure face recognition parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Recognition Confidence
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Low</span>
                      <div className="flex-1 h-2 bg-muted rounded-full">
                        <div className="w-3/4 h-2 bg-primary rounded-full"></div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        High
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Auto-mark Threshold
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Minimum confidence level required for automatic attendance
                      marking
                    </p>
                    <Badge variant="outline">85% Confidence</Badge>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">
                      Student Face Database
                    </h4>
                    <div className="space-y-2">
                      {classStudents.slice(0, 3).map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center justify-between p-2 bg-muted/50 rounded"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {student.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <span className="text-sm">{student.name}</span>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-chart-2/10 text-chart-2"
                          >
                            Enrolled
                          </Badge>
                        </div>
                      ))}
                      {classStudents.length > 3 && (
                        <p className="text-xs text-muted-foreground text-center">
                          +{classStudents.length - 3} more students enrolled
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>
                  Historical attendance records for all classes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Attendance history will be displayed here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Analytics</CardTitle>
                <CardDescription>Detailed insights and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Analytics dashboard will be displayed here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
