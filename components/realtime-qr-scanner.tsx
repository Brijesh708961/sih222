"use client";

import { useState, useEffect, useCallback } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Clock,
  TrendingUp,
  QrCode,
  RefreshCw,
} from "lucide-react";

interface ScannedStudent {
  id: string;
  name: string;
  studentId: string;
  scanTime: string;
  status: "present" | "late";
}

interface RealtimeQRScannerProps {
  classId: string;
  className?: string;
  onAttendanceUpdate?: (scannedStudents: ScannedStudent[]) => void;
}

export function RealtimeQRScanner({
  classId,
  className,
  onAttendanceUpdate,
}: RealtimeQRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedStudents, setScannedStudents] = useState<ScannedStudent[]>([]);
  const [lastScanResult, setLastScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    markAttendance,
    students,
    classes,
    validateQRCode,
    getAttendanceByClass,
  } = useAppStore();

  // Get current class info
  const currentClass = classes.find((c) => c.id === classId);
  const totalStudents = currentClass?.students?.length || 0;
  const attendancePercentage =
    totalStudents > 0
      ? Math.round((scannedStudents.length / totalStudents) * 100)
      : 0;

  // Check if student is already scanned
  const isStudentAlreadyScanned = useCallback(
    (studentId: string) => {
      return scannedStudents.some((student) => student.id === studentId);
    },
    [scannedStudents]
  );

  // Determine if student is late based on current time and class schedule
  const isStudentLate = useCallback(() => {
    if (!currentClass?.schedule) return false;

    const now = new Date();
    const currentDay = now.toLocaleDateString("en-US", { weekday: "long" });
    const currentTime = now.toTimeString().slice(0, 5);

    const todaySchedule = currentClass.schedule.find(
      (s) => s.day === currentDay
    );
    if (!todaySchedule) return false;

    // Consider late if more than 15 minutes after start time
    const startTime = todaySchedule.startTime;
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [currentHour, currentMin] = currentTime.split(":").map(Number);

    const startMinutes = startHour * 60 + startMin;
    const currentMinutes = currentHour * 60 + currentMin;

    return currentMinutes > startMinutes + 15; // 15 minutes grace period
  }, [currentClass]);

  const handleScan = async (result: string) => {
    if (isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Validate QR code format
      if (!validateQRCode(result)) {
        throw new Error("Invalid QR code format");
      }

      const qrData = JSON.parse(result);
      const studentId = qrData.studentId;

      // Check if student exists
      const student = students.find((s) => s.id === studentId);
      if (!student) {
        throw new Error("Student not found in system");
      }

      // Check if student is enrolled in this class
      if (!currentClass?.students?.includes(studentId)) {
        throw new Error("Student not enrolled in this class");
      }

      // Check if already scanned
      if (isStudentAlreadyScanned(studentId)) {
        setError(`${student.name} has already been scanned`);
        setTimeout(() => setError(null), 3000);
        setIsProcessing(false);
        return;
      }

      // Determine attendance status
      const isLate = isStudentLate();
      const status = isLate ? "late" : "present";

      // Mark attendance in store
      markAttendance({
        studentId: studentId,
        classId: classId,
        status: status,
        method: "qr",
        qrPayload: qrData,
        deviceInfo: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        },
      });

      // Add to scanned students list
      const newScannedStudent: ScannedStudent = {
        id: studentId,
        name: student.name,
        studentId: student.studentId,
        scanTime: new Date().toLocaleTimeString(),
        status: status,
      };

      setScannedStudents((prev) => [...prev, newScannedStudent]);
      setLastScanResult(`${student.name} marked as ${status}`);

      // Notify parent component
      if (onAttendanceUpdate) {
        onAttendanceUpdate([...scannedStudents, newScannedStudent]);
      }

      // Clear messages after 3 seconds
      setTimeout(() => {
        setLastScanResult(null);
        setError(null);
      }, 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Invalid QR code";
      setError(errorMessage);
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleError = (error: Error) => {
    setError(`Scanner error: ${error.message}`);
    setTimeout(() => setError(null), 3000);
  };

  const resetScanner = () => {
    setScannedStudents([]);
    setLastScanResult(null);
    setError(null);
    if (onAttendanceUpdate) {
      onAttendanceUpdate([]);
    }
  };

  const toggleScanning = () => {
    setIsScanning(!isScanning);
    if (isScanning) {
      setError(null);
      setLastScanResult(null);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Real-time Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Scanned
                </p>
                <p className="text-2xl font-bold">{scannedStudents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Attendance
                </p>
                <p className="text-2xl font-bold">{attendancePercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Late
                </p>
                <p className="text-2xl font-bold">
                  {scannedStudents.filter((s) => s.status === "late").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total
                </p>
                <p className="text-2xl font-bold">{totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QR Scanner */}
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Real-time QR Scanner
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={resetScanner}
                variant="outline"
                size="sm"
                disabled={scannedStudents.length === 0}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Reset
              </Button>
              <Button
                onClick={toggleScanning}
                variant={isScanning ? "destructive" : "default"}
                size="sm"
              >
                {isScanning ? "Stop Scanning" : "Start Scanning"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isScanning ? (
            <div className="space-y-4">
              <div className="relative aspect-square w-full max-w-sm mx-auto">
                <QrScanner
                  onDecode={handleScan}
                  onError={handleError}
                  constraints={{
                    facingMode: "environment",
                  }}
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <QrCode className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Click "Start Scanning" to begin QR code scanning
              </p>
            </div>
          )}

          {/* Scan Results */}
          {lastScanResult && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700">{lastScanResult}</span>
            </div>
          )}

          {/* Error Messages */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-700">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scanned Students List */}
      {scannedStudents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Scanned Students ({scannedStudents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {scannedStudents.map((student, index) => (
                <div
                  key={`${student.id}-${index}`}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ID: {student.studentId} • {student.scanTime}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      student.status === "present" ? "default" : "secondary"
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
    </div>
  );
}
