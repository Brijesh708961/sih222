// lib/store.ts - COMPLETE FILE
import { create } from "zustand";

// Types for better type safety
interface User {
  id: string;
  name: string;
  email: string;
  userType: "student" | "faculty" | "admin";
}

// Class interface
interface Class {
  id: string;
  name: string;
  instructor: string;
  students: string[]; // Array of student IDs
  schedule: Array<{
    day: string;
    startTime: string;
    endTime: string;
    room: string;
  }>;
}

// Attendance Record interface
interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: "present" | "absent" | "late";
  method: "manual" | "qr" | "face" | "rfid";
  timestamp: string;
  qrPayload?: any;
  deviceInfo?: any;
  ipAddress?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

interface LearningTask {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
}

interface LoginCredentials {
  email: string;
  password: string;
  userType: "student" | "faculty" | "admin";
}

interface AppState {
  // Authentication state
  isAuthenticated: boolean;
  currentUser: User | null;

  // Data state
  classes: Class[];
  attendanceRecords: AttendanceRecord[];
  learningTasks: LearningTask[];
  students: Array<{ id: string; name: string; studentId: string }>;

  // Authentication actions
  login: (credentials: LoginCredentials) => boolean;
  logout: () => void;

  // Data actions
  initializeMockData: () => void;
  getAttendanceByStudent: (studentId: string) => AttendanceRecord[];
  getAttendanceByClass: (classId: string) => AttendanceRecord[];
  toggleTaskCompletion: (taskId: string) => void;
  addClass: (classData: Omit<Class, "id">) => void;
  markAttendance: (args: {
    studentId: string;
    classId: string;
    status: "present" | "absent" | "late";
    date?: string;
    method?: string;
    qrPayload?: any;
    deviceInfo?: any;
    timestamp?: string;
  }) => void;

  // QR Code methods
  generateStudentQR: (studentId: string) => string;
  validateQRCode: (qrData: string) => boolean;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial authentication state
  isAuthenticated: false,
  currentUser: null,

  // Initial data state
  classes: [],
  attendanceRecords: [],
  learningTasks: [],
  students: [],

  // Login function
  login: (credentials: LoginCredentials) => {
    // Mock validation - replace with real API call later
    const mockUsers = {
      "student@test.com": {
        name: "John Student",
        userType: "student" as const,
      },
      "faculty@test.com": { name: "Dr. Smith", userType: "faculty" as const },
      "admin@test.com": { name: "Admin User", userType: "admin" as const },
    };

    // Simple validation (replace with real authentication)
    if (
      credentials.email &&
      credentials.password &&
      mockUsers[credentials.email as keyof typeof mockUsers]
    ) {
      const userInfo = mockUsers[credentials.email as keyof typeof mockUsers];

      set({
        isAuthenticated: true,
        currentUser: {
          id: Date.now().toString(),
          name: userInfo.name,
          email: credentials.email,
          userType: credentials.userType,
        },
      });

      // Initialize data after successful login
      get().initializeMockData();
      return true;
    }
    return false;
  },

  // Logout function
  logout: () => {
    set({
      isAuthenticated: false,
      currentUser: null,
      classes: [],
      attendanceRecords: [],
      learningTasks: [],
    });
  },

  // Initialize mock data (only if authenticated)
  initializeMockData: () => {
    const { isAuthenticated, currentUser } = get();
    if (!isAuthenticated || !currentUser) return;

    // Mock classes
    const mockClasses: Class[] = [
      {
        id: "1",
        name: "Computer Science Fundamentals",
        instructor: "Dr. Johnson",
        students: [
          currentUser.id,
          "student2",
          "student3",
          "student4",
          "student5",
        ],
        schedule: [
          {
            day: "Monday",
            startTime: "09:00",
            endTime: "10:30",
            room: "CS-101",
          },
          {
            day: "Wednesday",
            startTime: "09:00",
            endTime: "10:30",
            room: "CS-101",
          },
          {
            day: "Friday",
            startTime: "09:00",
            endTime: "10:30",
            room: "CS-101",
          },
        ],
      },
      {
        id: "2",
        name: "Data Structures & Algorithms",
        instructor: "Prof. Williams",
        students: [currentUser.id, "student2", "student3", "student6"],
        schedule: [
          {
            day: "Tuesday",
            startTime: "11:00",
            endTime: "12:30",
            room: "CS-102",
          },
          {
            day: "Thursday",
            startTime: "11:00",
            endTime: "12:30",
            room: "CS-102",
          },
        ],
      },
      {
        id: "3",
        name: "Database Management Systems",
        instructor: "Dr. Brown",
        students: [currentUser.id, "student4", "student5", "student7"],
        schedule: [
          {
            day: "Monday",
            startTime: "14:00",
            endTime: "15:30",
            room: "CS-103",
          },
          {
            day: "Wednesday",
            startTime: "14:00",
            endTime: "15:30",
            room: "CS-103",
          },
        ],
      },
      {
        id: "4",
        name: "Web Development",
        instructor: "Ms. Davis",
        students: [currentUser.id, "student3", "student6", "student8"],
        schedule: [
          {
            day: "Tuesday",
            startTime: "13:00",
            endTime: "14:30",
            room: "CS-104",
          },
          {
            day: "Friday",
            startTime: "13:00",
            endTime: "14:30",
            room: "CS-104",
          },
        ],
      },
    ];

    // Mock attendance records
    const mockAttendanceRecords: AttendanceRecord[] = [
      {
        id: "1",
        studentId: currentUser.id,
        classId: "1",
        date: "2025-09-16",
        status: "present",
        timestamp: new Date().toISOString(),
        method: "manual",
      },
      {
        id: "2",
        studentId: currentUser.id,
        classId: "2",
        date: "2025-09-17",
        status: "present",
        timestamp: new Date().toISOString(),
        method: "manual",
      },
      {
        id: "3",
        studentId: currentUser.id,
        classId: "3",
        date: "2025-09-16",
        status: "late",
        timestamp: new Date().toISOString(),
        method: "manual",
      },
      {
        id: "4",
        studentId: currentUser.id,
        classId: "4",
        date: "2025-09-17",
        status: "present",
        timestamp: new Date().toISOString(),
        method: "manual",
      },
      {
        id: "5",
        studentId: currentUser.id,
        classId: "1",
        date: "2025-09-18",
        status: "present",
        timestamp: new Date().toISOString(),
        method: "manual",
      },
      {
        id: "6",
        studentId: currentUser.id,
        classId: "3",
        date: "2025-09-18",
        status: "absent",
        timestamp: new Date().toISOString(),
        method: "manual",
      },
    ];

    // Mock students list
    const mockStudents: Array<{ id: string; name: string; studentId: string }> =
      [
        { id: currentUser.id, name: currentUser.name, studentId: "S001" },
        { id: "student2", name: "Alice Johnson", studentId: "S002" },
        { id: "student3", name: "Bob Smith", studentId: "S003" },
        { id: "student4", name: "Carol Lee", studentId: "S004" },
        { id: "student5", name: "David Kim", studentId: "S005" },
        { id: "student6", name: "Eva Green", studentId: "S006" },
        { id: "student7", name: "Frank Young", studentId: "S007" },
        { id: "student8", name: "Grace Hall", studentId: "S008" },
      ];

    // Mock learning tasks
    const mockLearningTasks: LearningTask[] = [
      {
        id: "1",
        title: "Complete Algorithm Assignment",
        subject: "Data Structures & Algorithms",
        dueDate: "2025-09-22",
        completed: false,
        priority: "high",
      },
      {
        id: "2",
        title: "Database Design Project",
        subject: "Database Management Systems",
        dueDate: "2025-09-25",
        completed: false,
        priority: "medium",
      },
      {
        id: "3",
        title: "React Component Practice",
        subject: "Web Development",
        dueDate: "2025-09-20",
        completed: true,
        priority: "medium",
      },
      {
        id: "4",
        title: "CS Fundamentals Quiz Preparation",
        subject: "Computer Science Fundamentals",
        dueDate: "2025-09-21",
        completed: false,
        priority: "high",
      },
      {
        id: "5",
        title: "Study SQL Joins",
        subject: "Database Management Systems",
        dueDate: "2025-09-23",
        completed: false,
        priority: "low",
      },
    ];

    set({
      classes: mockClasses,
      attendanceRecords: mockAttendanceRecords,
      learningTasks: mockLearningTasks,
      students: mockStudents,
    });
  },

  // Get attendance records for a specific student
  getAttendanceByStudent: (studentId: string) => {
    const { attendanceRecords } = get();
    return attendanceRecords.filter((record) => record.studentId === studentId);
  },

  // Toggle task completion status
  toggleTaskCompletion: (taskId: string) => {
    set((state) => ({
      learningTasks: state.learningTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));
  },

  // Add new class
  addClass: (classData: Omit<Class, "id">) => {
    const newClass: Class = {
      ...classData,
      id: Date.now().toString(),
    };
    set((state) => ({
      classes: [...state.classes, newClass],
    }));
  },

  // Enhanced Mark attendance for a student
  markAttendance: (args: {
    studentId: string;
    classId: string;
    status: "present" | "absent" | "late";
    date?: string;
    method?: string;
    qrPayload?: any;
    deviceInfo?: any;
    timestamp?: string;
  }) => {
    const { studentId, classId, status } = args;
    const newAttendanceRecord: AttendanceRecord = {
      id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      studentId,
      classId,
      date: args.date || new Date().toISOString().split("T")[0],
      status,
      timestamp: args.timestamp || new Date().toISOString(),
      method: (args.method as any) || "manual",
      qrPayload: args.qrPayload,
      deviceInfo: args.deviceInfo,
    };

    set((state) => {
      // Remove existing record for same student, class, and date if exists
      const filteredRecords = state.attendanceRecords.filter(
        (record) =>
          !(
            record.studentId === newAttendanceRecord.studentId &&
            record.classId === newAttendanceRecord.classId &&
            record.date === newAttendanceRecord.date
          )
      );

      return {
        attendanceRecords: [...filteredRecords, newAttendanceRecord],
      };
    });

    // Persist to localStorage
    const records = get().attendanceRecords;
    localStorage.setItem("attendanceRecords", JSON.stringify(records));
  },

  // Get attendance records for a specific class
  getAttendanceByClass: (classId: string) => {
    const { attendanceRecords } = get();
    return attendanceRecords.filter((record) => record.classId === classId);
  },

  // Generate QR code data for student
  generateStudentQR: (studentId: string) => {
    const qrData = {
      studentId,
      timestamp: Date.now(),
      type: "attendance",
      version: "1.0",
    };
    return JSON.stringify(qrData);
  },

  // Validate QR code format
  validateQRCode: (qrData: string) => {
    try {
      const payload = JSON.parse(qrData);
      return (
        payload &&
        typeof payload === "object" &&
        payload.type === "attendance" &&
        payload.studentId &&
        typeof payload.studentId === "string" &&
        payload.timestamp &&
        typeof payload.timestamp === "number"
      );
    } catch {
      return false;
    }
  },
}));

// Helper function to get current user
export const useCurrentUser = () => {
  const currentUser = useAppStore((state) => state.currentUser);
  return currentUser;
};

// Helper function to check authentication
export const useAuth = () => {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const login = useAppStore((state) => state.login);
  const logout = useAppStore((state) => state.logout);

  return {
    isAuthenticated,
    login,
    logout,
  };
};
