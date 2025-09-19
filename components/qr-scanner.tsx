"use client";

import { useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface QRScannerProps {
  classId: string;
  onAttendanceMarked: (
    studentId: string,
    status: "present" | "late" | "absent"
  ) => void;
}

export function QRScanner({ classId, onAttendanceMarked }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { markAttendance, students } = useAppStore();

  const handleScan = (result: string) => {
    try {
      // Parse QR code data (assuming it contains student ID)
      const studentData = JSON.parse(result);
      const studentId = studentData.studentId || studentData.id;

      // Verify student exists
      const student = students.find((s) => s.id === studentId);
      if (!student) {
        setError("Student not found in system");
        return;
      }

      // ✅ FIXED - Use correct markAttendance signature
      markAttendance({
        studentId: studentId,
        classId: classId,
        status: "present",
        method: "qr",
      });

      setScanResult(`Attendance marked for ${student.name}`);
      onAttendanceMarked(studentId, "present");

      // Reset after 2 seconds
      setTimeout(() => {
        setScanResult(null);
        setError(null);
      }, 2000);
    } catch (err) {
      setError("Invalid QR code format");
      setTimeout(() => setError(null), 2000);
    }
  };

  const handleError = (error: Error) => {
    setError(`Scanner error: ${error.message}`);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">QR Code Scanner</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isScanning ? (
          <Button onClick={() => setIsScanning(true)} className="w-full">
            Start Scanning
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-square w-full max-w-sm mx-auto">
              <QrScanner
                onDecode={handleScan}
                onError={handleError}
                constraints={{
                  facingMode: "environment", // Use back camera
                }}
              />
            </div>
            <Button
              onClick={() => setIsScanning(false)}
              variant="outline"
              className="w-full"
            >
              Stop Scanning
            </Button>
          </div>
        )}

        {/* Scan Results */}
        {scanResult && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-700">{scanResult}</span>
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
  );
}
