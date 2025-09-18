"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, CheckCircle, X, Loader2, AlertCircle } from "lucide-react"
import { useAppStore } from "@/lib/store"

interface FaceRecognitionAttendanceProps {
  classId: string
  onAttendanceMarked?: (studentId: string, status: "present" | "absent") => void
}

export function FaceRecognitionAttendance({ classId, onAttendanceMarked }: FaceRecognitionAttendanceProps) {
  const [isActive, setIsActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recognizedStudent, setRecognizedStudent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { students, classes, markAttendance, attendanceRecords } = useAppStore()

  const currentClass = classes.find((c) => c.id === classId)
  const classStudents = currentClass ? students.filter((s) => currentClass.students.includes(s.id)) : []

  const today = new Date().toISOString().split("T")[0]
  const todayAttendance = attendanceRecords.filter((record) => record.classId === classId && record.date === today)

  const startCamera = async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
      })

      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }
      setIsActive(true)
    } catch (err) {
      setError("Unable to access camera. Please check permissions.")
      console.error("Camera access error:", err)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsActive(false)
    setIsProcessing(false)
    setRecognizedStudent(null)
  }

  const captureAndRecognize = async () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsProcessing(true)
    setError(null)

    // Capture frame from video
    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas.getContext("2d")

    if (ctx) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0)

      // Simulate face recognition process
      // In a real implementation, you would send the image to a face recognition API
      setTimeout(() => {
        const availableStudents = classStudents.filter(
          (student) => !todayAttendance.some((record) => record.studentId === student.id),
        )

        if (availableStudents.length > 0) {
          const randomStudent = availableStudents[Math.floor(Math.random() * availableStudents.length)]
          setRecognizedStudent(randomStudent.id)

          // Mark attendance automatically
          markAttendance({
            studentId: randomStudent.id,
            classId: classId,
            date: today,
            status: "present",
            method: "face",
          })

          onAttendanceMarked?.(randomStudent.id, "present")

          // Auto-stop after successful recognition
          setTimeout(() => {
            stopCamera()
          }, 2000)
        } else {
          setError("No unrecognized students found or all students already marked present")
        }

        setIsProcessing(false)
      }, 2000)
    }
  }

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  const recognizedStudentData = recognizedStudent ? students.find((s) => s.id === recognizedStudent) : null

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Face Recognition Attendance
        </CardTitle>
        <CardDescription>Automatically mark attendance using facial recognition technology</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Camera View */}
        <div className="relative">
          <div className="w-full h-64 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
            {isActive ? (
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            ) : (
              <div className="text-center">
                <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Camera not active</p>
              </div>
            )}
          </div>

          {/* Processing Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p className="text-sm">Recognizing face...</p>
              </div>
            </div>
          )}

          {/* Recognition Success */}
          {recognizedStudent && recognizedStudentData && (
            <div className="absolute inset-0 bg-green-500/90 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                <p className="text-lg font-semibold">{recognizedStudentData.name}</p>
                <p className="text-sm">Attendance marked successfully!</p>
              </div>
            </div>
          )}
        </div>

        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2">
          {!isActive ? (
            <Button onClick={startCamera} className="flex-1">
              <Camera className="w-4 h-4 mr-2" />
              Start Camera
            </Button>
          ) : (
            <>
              <Button onClick={captureAndRecognize} disabled={isProcessing} className="flex-1">
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Recognize Face
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={stopCamera}>
                <X className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-chart-2">
              {todayAttendance.filter((r) => r.status === "present").length}
            </p>
            <p className="text-xs text-muted-foreground">Present Today</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-chart-1">
              {todayAttendance.filter((r) => r.method === "face").length}
            </p>
            <p className="text-xs text-muted-foreground">Face Recognition</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-muted-foreground">
              {classStudents.length - todayAttendance.filter((r) => r.status === "present").length}
            </p>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </div>
        </div>

        {/* Recent Face Recognition Attendance */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Recent Face Recognition</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {todayAttendance
              .filter((record) => record.method === "face")
              .slice(0, 5)
              .map((record) => {
                const student = students.find((s) => s.id === record.studentId)
                return (
                  <div key={record.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-chart-2/20 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-chart-2">
                          {student?.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <span className="text-sm">{student?.name}</span>
                    </div>
                    <Badge variant="secondary" className="bg-chart-2/10 text-chart-2">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Present
                    </Badge>
                  </div>
                )
              })}
            {todayAttendance.filter((record) => record.method === "face").length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-2">No face recognition attendance yet today</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
