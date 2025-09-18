"use client";

import { useEffect } from "react";
import { Navigation } from "@/components/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import {
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BookOpen,
  Bell,
  Plus,
  QrCode,
  ChevronRight,
  GraduationCap,
  FileText,
  BarChart3,
  Award,
  TrendingDown,
} from "lucide-react";

export default function TeacherDashboard() {
  const {
    currentUser,
    classes,
    students,
    attendanceRecords,
    getAttendanceByClass,
    initializeMockData,
  } = useAppStore();

  useEffect(() => {
    // Initialize mock data if not already done
    if (classes.length === 0) {
      initializeMockData();
    }
  }, [classes.length, initializeMockData]);

  const uitRgpvStudents = [
    {
      sno: 1,
      enrollmentNo: "0967CS231001",
      name: "AADARSH PUROHIT",
      cgpa: 6.33,
    },
    {
      sno: 2,
      enrollmentNo: "0967CS231002",
      name: "ABHIJEET ACHARYA",
      cgpa: 8.19,
    },
    { sno: 3, enrollmentNo: "0967CS231003", name: "ABHINAY SINGH", cgpa: null },
    {
      sno: 4,
      enrollmentNo: "0967CS231004",
      name: "ABHISHEK CHOUDHARY",
      cgpa: null,
    },
    { sno: 5, enrollmentNo: "0967CS231005", name: "ADITYA DHAKAD", cgpa: null },
    {
      sno: 6,
      enrollmentNo: "0967CS231006",
      name: "ADITYA KUSHWAH",
      cgpa: null,
    },
    {
      sno: 7,
      enrollmentNo: "0967CS231007",
      name: "ADITYA PRATAP SINGH CHOUHAN",
      cgpa: null,
    },
    {
      sno: 8,
      enrollmentNo: "0967CS231008",
      name: "AKSHAT TRIPATHI",
      cgpa: null,
    },
    { sno: 9, enrollmentNo: "0967CS231009", name: "AMAN DHAKAD", cgpa: null },
    {
      sno: 10,
      enrollmentNo: "0967CS231010",
      name: "ANEESH PANDEY",
      cgpa: null,
    },
    {
      sno: 11,
      enrollmentNo: "0967CS231011",
      name: "ANIL KUMAR KUSHWAHA",
      cgpa: null,
    },
    {
      sno: 12,
      enrollmentNo: "0967CS231012",
      name: "ANKIT KUMAR SHAH",
      cgpa: null,
    },
    { sno: 13, enrollmentNo: "0967CS231013", name: "AYUSH PATEL", cgpa: null },
    {
      sno: 14,
      enrollmentNo: "0967CS231014",
      name: "BRIJESH RAWAT",
      cgpa: null,
    },
    {
      sno: 15,
      enrollmentNo: "0967CS231015",
      name: "CHANCHAL GUPTA",
      cgpa: null,
    },
    {
      sno: 16,
      enrollmentNo: "0967CS231016",
      name: "CHANDRA KUMAR DAWANDE",
      cgpa: null,
    },
    {
      sno: 17,
      enrollmentNo: "0967CS231017",
      name: "DESH DEEP DOHARE",
      cgpa: null,
    },
    {
      sno: 18,
      enrollmentNo: "0967CS231018",
      name: "DEVENDRA SAHU",
      cgpa: null,
    },
    { sno: 19, enrollmentNo: "0967CS231019", name: "DEVENDRA SEN", cgpa: null },
    {
      sno: 20,
      enrollmentNo: "0967CS231020",
      name: "DHARMENDRA KUMAR RAJAK",
      cgpa: null,
    },
    {
      sno: 21,
      enrollmentNo: "0967CS231021",
      name: "DIVYANSH GOSWAMI",
      cgpa: null,
    },
    {
      sno: 22,
      enrollmentNo: "0967CS231022",
      name: "GARVIT CHOUBEY",
      cgpa: null,
    },
    { sno: 23, enrollmentNo: "0967CS231023", name: "HARSH NEMA", cgpa: null },
    {
      sno: 24,
      enrollmentNo: "0967CS231024",
      name: "HARSHIT KHANNA",
      cgpa: null,
    },
    {
      sno: 25,
      enrollmentNo: "0967CS231025",
      name: "JEEYA SHRIVASTAV",
      cgpa: null,
    },
    {
      sno: 26,
      enrollmentNo: "0967CS231026",
      name: "KAVYASHANKAR TIWARI",
      cgpa: null,
    },
    { sno: 27, enrollmentNo: "0967CS231027", name: "KHUSHI BHATT", cgpa: null },
    { sno: 28, enrollmentNo: "0967CS231028", name: "KIRAN BHATI", cgpa: null },
    {
      sno: 29,
      enrollmentNo: "0967CS231029",
      name: "KRISHNA SHARMA",
      cgpa: null,
    },
    {
      sno: 30,
      enrollmentNo: "0967CS231030",
      name: "KULDEEP SHUKLA",
      cgpa: null,
    },
    {
      sno: 31,
      enrollmentNo: "0967CS231031",
      name: "MADHUSUDAN SUTRADHAR",
      cgpa: null,
    },
    { sno: 32, enrollmentNo: "0967CS231032", name: "MANAS PURWAR", cgpa: null },
    { sno: 33, enrollmentNo: "0967CS231033", name: "MANSI BANSAL", cgpa: null },
    { sno: 34, enrollmentNo: "0967CS231034", name: "MAYANK RAWAT", cgpa: null },
    { sno: 35, enrollmentNo: "0967CS231035", name: "MUKUL VERMA", cgpa: null },
    {
      sno: 36,
      enrollmentNo: "0967CS231036",
      name: "MUSKAN KUSHWAHA",
      cgpa: null,
    },
    {
      sno: 37,
      enrollmentNo: "0967CS231037",
      name: "NAKUL PRATAP SINGH CHAUHAN",
      cgpa: null,
    },
    {
      sno: 38,
      enrollmentNo: "0967CS231038",
      name: "NAMAN BICHPURIYA",
      cgpa: null,
    },
    { sno: 39, enrollmentNo: "0967CS231039", name: "NAYAN PATHAK", cgpa: null },
    {
      sno: 40,
      enrollmentNo: "0967CS231040",
      name: "NIKHIL MISHRA",
      cgpa: null,
    },
    {
      sno: 41,
      enrollmentNo: "0967CS231041",
      name: "NIMIT PANCHESHWAR",
      cgpa: null,
    },
    {
      sno: 42,
      enrollmentNo: "0967CS231042",
      name: "NIYATI BANSAL",
      cgpa: null,
    },
    {
      sno: 43,
      enrollmentNo: "0967CS231043",
      name: "OM SINGH BAGEHL",
      cgpa: null,
    },
    {
      sno: 44,
      enrollmentNo: "0967CS231044",
      name: "OMDEV BHUNJWA",
      cgpa: null,
    },
    { sno: 45, enrollmentNo: "0967CS231045", name: "PALAK GUPTA", cgpa: null },
    { sno: 46, enrollmentNo: "0967CS231046", name: "PALAK SHARMA", cgpa: null },
    { sno: 47, enrollmentNo: "0967CS231047", name: "PAPUMANI ALI", cgpa: null },
    {
      sno: 48,
      enrollmentNo: "0967CS231048",
      name: "PIYUSH PANDEY",
      cgpa: null,
    },
    {
      sno: 49,
      enrollmentNo: "0967CS231049",
      name: "PRAGYESH DHAKAD",
      cgpa: null,
    },
    {
      sno: 50,
      enrollmentNo: "0967CS231050",
      name: "PREMPIYUSH CHANDRAVANSHI",
      cgpa: null,
    },
    {
      sno: 51,
      enrollmentNo: "0967CS231051",
      name: "PUSHPENDRA SAHU",
      cgpa: null,
    },
    { sno: 52, enrollmentNo: "0967CS231052", name: "RAHUL DHAKAD", cgpa: null },
    { sno: 53, enrollmentNo: "0967CS231053", name: "RAJ KEWAT", cgpa: null },
    { sno: 54, enrollmentNo: "0967CS231054", name: "RASHI SHARMA", cgpa: null },
    {
      sno: 55,
      enrollmentNo: "0967CS231055",
      name: "RISHI KHADIYAR",
      cgpa: null,
    },
    {
      sno: 56,
      enrollmentNo: "0967CS231056",
      name: "RISHIKA SHARMA",
      cgpa: null,
    },
    { sno: 57, enrollmentNo: "0967CS231057", name: "ROHIT BAGHEL", cgpa: null },
    { sno: 58, enrollmentNo: "0967CS231058", name: "ROHIT RAWAT", cgpa: null },
    {
      sno: 59,
      enrollmentNo: "0967CS231059",
      name: "SANIYA RATHORE",
      cgpa: null,
    },
    {
      sno: 60,
      enrollmentNo: "0967CS231060",
      name: "SANJANA TOMAR",
      cgpa: null,
    },
    {
      sno: 61,
      enrollmentNo: "0967CS231061",
      name: "SHIVAM DHAKAD",
      cgpa: null,
    },
    {
      sno: 62,
      enrollmentNo: "0967CS231062",
      name: "SHIVANSH CHANDEL",
      cgpa: null,
    },
    {
      sno: 63,
      enrollmentNo: "0967CS231063",
      name: "SOURABH KUMAR CHOUDHARY",
      cgpa: null,
    },
    {
      sno: 64,
      enrollmentNo: "0967CS231064",
      name: "SOURABH VERMA",
      cgpa: null,
    },
    {
      sno: 65,
      enrollmentNo: "0967CS231065",
      name: "SUDEEP PATHAK",
      cgpa: null,
    },
    {
      sno: 66,
      enrollmentNo: "0967CS231066",
      name: "SUDHANSHU DUBEY",
      cgpa: null,
    },
    { sno: 67, enrollmentNo: "0967CS231067", name: "SUJEET PATEL", cgpa: null },
    {
      sno: 68,
      enrollmentNo: "0967CS231068",
      name: "SUMIT KUMAR PATEL",
      cgpa: null,
    },
    {
      sno: 69,
      enrollmentNo: "0967CS231069",
      name: "SUMIT VISHWAKARMA",
      cgpa: null,
    },
    {
      sno: 70,
      enrollmentNo: "0967CS231070",
      name: "SUSHIL MISHRA",
      cgpa: null,
    },
    {
      sno: 71,
      enrollmentNo: "0967CS231071",
      name: "SYED ALISHA ALI",
      cgpa: null,
    },
    {
      sno: 72,
      enrollmentNo: "0967CS231072",
      name: "TAMANNA RATHORE",
      cgpa: null,
    },
    {
      sno: 73,
      enrollmentNo: "0967CS231073",
      name: "TANISHQ YADAV",
      cgpa: null,
    },
    {
      sno: 74,
      enrollmentNo: "0967CS231074",
      name: "VAIBHAVRAJ SINGH CHUNDAWAT",
      cgpa: null,
    },
    {
      sno: 75,
      enrollmentNo: "0967CS231075",
      name: "VIRENDRA PARIHAR",
      cgpa: null,
    },
    { sno: 76, enrollmentNo: "0967CS231076", name: "VISHAL YADAV", cgpa: null },
    {
      sno: 77,
      enrollmentNo: "0967CS231077",
      name: "YASH BADERIYA",
      cgpa: null,
    },
    {
      sno: 78,
      enrollmentNo: "0967CS231078",
      name: "YOGISHI PALIWAL",
      cgpa: null,
    },
  ];

  const studentsWithCGPA = uitRgpvStudents.filter((s) => s.cgpa !== null);
  const totalEnrolled = uitRgpvStudents.length;
  const studentsEvaluated = studentsWithCGPA.length;
  const averageCGPA =
    studentsWithCGPA.length > 0
      ? (
          studentsWithCGPA.reduce((sum, s) => sum + s.cgpa!, 0) /
          studentsWithCGPA.length
        ).toFixed(2)
      : "0.00";
  const topPerformer =
    studentsWithCGPA.length > 0
      ? studentsWithCGPA.reduce((prev, current) =>
          prev.cgpa! > current.cgpa! ? prev : current
        )
      : null;

  // Get today's classes
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayDate = new Date().toISOString().split("T")[0];

  const todayClasses = classes
    .map((c) => {
      const todaySchedule = c.schedule.find((s) => s.day === today);
      const todayAttendance = getAttendanceByClass(c.id).filter(
        (r) => r.date === todayDate
      );
      const presentCount = todayAttendance.filter(
        (r) => r.status === "present"
      ).length;

      return {
        id: c.id,
        subject: c.name,
        time: todaySchedule
          ? `${todaySchedule.startTime} - ${todaySchedule.endTime}`
          : "Not scheduled",
        room: todaySchedule?.room || "TBD",
        students: c.students.length,
        attendance: presentCount,
      };
    })
    .filter((c) => c.time !== "Not scheduled");

  // Calculate recent attendance for all classes
  const recentAttendance = classes.map((c) => {
    const classAttendance = getAttendanceByClass(c.id);
    const recentRecords = classAttendance.filter((r) => {
      const recordDate = new Date(r.date);
      const daysDiff = Math.floor(
        (new Date().getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysDiff <= 7; // Last week
    });

    const attendanceRate =
      recentRecords.length > 0
        ? Math.round(
            (recentRecords.filter((r) => r.status === "present").length /
              recentRecords.length) *
              100
          )
        : 0;

    return {
      class: c.name,
      date: "This week",
      attendance: attendanceRate,
      trend: attendanceRate >= 90 ? "up" : "down",
    };
  });

  // Generate student alerts based on attendance
  const studentAlerts = students
    .slice(0, 3)
    .map((student) => {
      const studentAttendance = attendanceRecords.filter(
        (r) => r.studentId === student.id
      );
      const attendanceRate =
        studentAttendance.length > 0
          ? Math.round(
              (studentAttendance.filter((r) => r.status === "present").length /
                studentAttendance.length) *
                100
            )
          : 100;

      let issue = "Good attendance";
      let priority: "high" | "medium" | "low" = "low";

      if (attendanceRate < 70) {
        issue = `Low attendance (${attendanceRate}%)`;
        priority = "high";
      } else if (attendanceRate < 85) {
        issue = `Below average attendance (${attendanceRate}%)`;
        priority = "medium";
      }

      return {
        name: student.name,
        issue,
        class:
          classes.find((c) => c.students.includes(student.id))?.name ||
          "Unknown Class",
        priority,
      };
    })
    .filter((alert) => alert.priority !== "low");

  // Calculate weekly stats
  const totalStudents = students.length;
  const allAttendanceRecords = attendanceRecords.filter((r) => {
    const recordDate = new Date(r.date);
    const daysDiff = Math.floor(
      (new Date().getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDiff <= 7;
  });

  const averageAttendance =
    allAttendanceRecords.length > 0
      ? Math.round(
          (allAttendanceRecords.filter((r) => r.status === "present").length /
            allAttendanceRecords.length) *
            100
        )
      : 0;

  const weeklyStats = {
    totalStudents,
    averageAttendance,
    classesCompleted: todayClasses.filter((c) => c.attendance > 0).length,
    assignmentsGraded: 45, // Mock data
  };

  const upcomingTasks = [
    {
      task: "Grade Theory of Computation Midterm",
      dueDate: "Tomorrow",
      priority: "high" as const,
      completed: 60,
    },
    {
      task: "Prepare Database Management Lesson",
      dueDate: "In 2 days",
      priority: "medium" as const,
      completed: 30,
    },
    {
      task: "Review Cyber Security Lab Reports",
      dueDate: "This week",
      priority: "low" as const,
      completed: 0,
    },
  ];

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation userType="teacher" />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">
              Please log in to access your dashboard.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation userType="teacher" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {currentUser.name}!
            </h1>
            <p className="text-muted-foreground">
              UIT RGPV Shivpuri - Computer Science Engineering
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Alerts ({studentAlerts.length})
            </Button>
            <Button
              size="sm"
              onClick={() =>
                (window.location.href = "/teacher/attendance?scanner=1")
              }
            >
              <QrCode className="w-4 h-4 mr-2" />
              Scan QR
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Assignment
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Enrolled
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {totalEnrolled}
              </div>
              <p className="text-xs text-muted-foreground">
                Second Semester 2023-24
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Evaluated</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {studentsEvaluated}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((studentsEvaluated / totalEnrolled) * 100)}%
                completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average CGPA
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {averageCGPA}
              </div>
              <p className="text-xs text-muted-foreground">Class performance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Top Performer
              </CardTitle>
              <Award className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {topPerformer?.cgpa || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {topPerformer?.name.split(" ")[0] || "Pending"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <TrendingDown className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {totalEnrolled - studentsEvaluated}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting evaluation
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Student Performance Analysis
                </CardTitle>
                <CardDescription>
                  UIT RGPV Shivpuri - CS Engineering Second Semester 2023-24
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Institution
                      </p>
                      <p className="font-semibold">UIT RGPV Shivpuri</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Department
                      </p>
                      <p className="font-semibold">
                        Computer Science Engineering
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Top Performing Students</h4>
                    {studentsWithCGPA.slice(0, 5).map((student, index) => (
                      <div
                        key={student.enrollmentNo}
                        className="flex items-center justify-between p-3 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {student.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {student.enrollmentNo}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{student.cgpa}</p>
                          <Badge
                            variant={
                              student.cgpa! >= 8
                                ? "default"
                                : student.cgpa! >= 7
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {student.cgpa! >= 8
                              ? "Excellent"
                              : student.cgpa! >= 7
                              ? "Good"
                              : "Average"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Evaluation Progress</span>
                      <span>
                        {studentsEvaluated}/{totalEnrolled} students
                      </span>
                    </div>
                    <Progress
                      value={(studentsEvaluated / totalEnrolled) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent"
                >
                  View Complete Student List
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Today's Classes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Today's Classes
                </CardTitle>
                <CardDescription>
                  Your scheduled classes and attendance status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayClasses.length > 0 ? (
                    todayClasses.map((class_, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg border border-border"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{class_.subject}</h4>
                            <p className="text-sm text-muted-foreground">
                              {class_.room} • {class_.time}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {class_.attendance}/{class_.students} students
                            </p>
                            <Badge
                              variant={
                                class_.attendance === 0
                                  ? "secondary"
                                  : "default"
                              }
                            >
                              {class_.attendance === 0
                                ? "Upcoming"
                                : "In Progress"}
                            </Badge>
                          </div>
                        </div>
                        {class_.attendance > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Attendance</span>
                              <span>
                                {Math.round(
                                  (class_.attendance / class_.students) * 100
                                )}
                                %
                              </span>
                            </div>
                            <Progress
                              value={
                                (class_.attendance / class_.students) * 100
                              }
                              className="h-2"
                            />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No classes scheduled for today
                      </p>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent"
                >
                  View Full Schedule
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Upcoming Tasks
                </CardTitle>
                <CardDescription>
                  Your pending assignments and deadlines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTasks.map((task, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-border"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{task.task}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Due: {task.dueDate}
                          </p>
                          <Badge
                            variant={
                              task.priority === "high"
                                ? "destructive"
                                : task.priority === "medium"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {task.priority} priority
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-transparent"
                        >
                          Continue
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{task.completed}%</span>
                        </div>
                        <Progress value={task.completed} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Attendance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Recent Attendance
                </CardTitle>
                <CardDescription>Class attendance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAttendance.slice(0, 3).map((attendance, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {attendance.class}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {attendance.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {attendance.attendance}%
                        </span>
                        <TrendingUp
                          className={`w-4 h-4 ${
                            attendance.trend === "up"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent"
                >
                  View Detailed Reports
                </Button>
              </CardContent>
            </Card>

            {/* Student Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Student Alerts
                </CardTitle>
                <CardDescription>Students requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {studentAlerts.length > 0 ? (
                    studentAlerts.map((alert, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg border border-border"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-sm">{alert.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {alert.class}
                            </p>
                          </div>
                          <Badge
                            variant={
                              alert.priority === "high"
                                ? "destructive"
                                : "default"
                            }
                            className="text-xs"
                          >
                            {alert.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {alert.issue}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        All students are doing well!
                      </p>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent"
                >
                  View All Students
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Take Attendance
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Create Assignment
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Lesson Planner
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
