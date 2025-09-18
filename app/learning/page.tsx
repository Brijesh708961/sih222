"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Target,
  Clock,
  Star,
  Play,
  CheckCircle,
  TrendingUp,
  Brain,
  Lightbulb,
  Award,
  ChevronRight,
} from "lucide-react"

export default function LearningPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const learningGoals = [
    {
      title: "Master Finite Automata Theory",
      subject: "Theory of Computation",
      progress: 75,
      deadline: "End of Semester",
      priority: "high",
      tasks: 12,
      completed: 9,
    },
    {
      title: "Database Design & Optimization",
      subject: "Database Management System",
      progress: 60,
      deadline: "Next Month",
      priority: "medium",
      tasks: 8,
      completed: 5,
    },
    {
      title: "Network Security Fundamentals",
      subject: "Cyber Security",
      progress: 40,
      deadline: "In 3 Weeks",
      priority: "high",
      tasks: 15,
      completed: 6,
    },
  ]

  const recommendedTasks = [
    {
      title: "Practice Regular Expressions",
      subject: "Theory of Computation",
      difficulty: "Medium",
      estimatedTime: "30 min",
      points: 50,
      type: "practice",
      description: "Solve 10 regular expression problems to strengthen your automata foundation",
      skills: ["Problem Solving", "Mathematical Reasoning"],
    },
    {
      title: "SQL Query Optimization Quiz",
      subject: "Database Management System",
      difficulty: "Easy",
      estimatedTime: "15 min",
      points: 25,
      type: "quiz",
      description: "Test your knowledge of indexing, joins, and query performance tuning",
      skills: ["Database Design", "Query Optimization"],
    },
    {
      title: "Cryptography Study Guide",
      subject: "Cyber Security",
      difficulty: "Hard",
      estimatedTime: "45 min",
      points: 75,
      type: "study",
      description: "Review symmetric and asymmetric encryption algorithms and protocols",
      skills: ["Cryptography", "Security Analysis"],
    },
    {
      title: "Linux Command Line Workshop",
      subject: "Linux Lab",
      difficulty: "Medium",
      estimatedTime: "60 min",
      points: 60,
      type: "workshop",
      description: "Learn advanced shell scripting and system administration commands",
      skills: ["System Administration", "Shell Scripting"],
    },
  ]

  const achievements = [
    { title: "Math Wizard", description: "Completed 50 math problems", icon: "🧮", earned: true },
    { title: "Code Master", description: "Solved 25 programming challenges", icon: "💻", earned: true },
    { title: "Study Streak", description: "7 days of consistent learning", icon: "🔥", earned: true },
    { title: "Quiz Champion", description: "Scored 90%+ on 10 quizzes", icon: "🏆", earned: false },
  ]

  const learningStats = {
    totalPoints: 1250,
    weeklyGoal: 300,
    currentWeekPoints: 180,
    streak: 7,
    completedTasks: 42,
    averageScore: 87.5,
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-chart-2/10 text-chart-2"
      case "Medium":
        return "bg-chart-1/10 text-chart-1"
      case "Hard":
        return "bg-chart-4/10 text-chart-4"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "practice":
        return <Target className="w-4 h-4" />
      case "quiz":
        return <Brain className="w-4 h-4" />
      case "study":
        return <BookOpen className="w-4 h-4" />
      case "workshop":
        return <Lightbulb className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation userType="student" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Personalized Learning</h1>
            <p className="text-muted-foreground">AI-powered recommendations tailored to your learning goals</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-chart-1/10 text-chart-1">
              <Star className="w-3 h-3 mr-1" />
              {learningStats.totalPoints} Points
            </Badge>
            <Button size="sm">
              <Target className="w-4 h-4 mr-2" />
              Set New Goal
            </Button>
          </div>
        </div>

        {/* Learning Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Star className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-1">{learningStats.totalPoints}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-2">
                {learningStats.currentWeekPoints}/{learningStats.weeklyGoal}
              </div>
              <Progress
                value={(learningStats.currentWeekPoints / learningStats.weeklyGoal) * 100}
                className="h-2 mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
              <Award className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-3">{learningStats.streak}</div>
              <p className="text-xs text-muted-foreground">days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <CheckCircle className="h-4 w-4 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-4">{learningStats.averageScore}%</div>
              <p className="text-xs text-muted-foreground">Last 10 activities</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="recommendations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="goals">Learning Goals</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recommended Tasks */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      AI-Powered Recommendations
                    </CardTitle>
                    <CardDescription>Personalized learning activities based on your progress and goals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recommendedTasks.map((task, index) => (
                        <div key={index} className="p-4 rounded-lg border border-border">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                                {getTypeIcon(task.type)}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium mb-1">{task.title}</h4>
                                <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {task.estimatedTime}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Star className="w-3 h-3" />
                                    {task.points} points
                                  </span>
                                  <Badge variant="secondary" className={getDifficultyColor(task.difficulty)}>
                                    {task.difficulty}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <Button size="sm">
                              <Play className="w-4 h-4 mr-2" />
                              Start
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-3">
                            {task.skills.map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Current Focus */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Focus</CardTitle>
                    <CardDescription>Your priority learning area</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-primary" />
                        <span className="font-medium text-primary">Theory of Computation</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Focus on finite automata and formal languages to improve your theoretical CS foundation
                      </p>
                      <Progress value={75} className="h-2 mb-2" />
                      <p className="text-xs text-muted-foreground">75% complete</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Learning Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Learning Insights</CardTitle>
                    <CardDescription>AI analysis of your progress</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 rounded-lg bg-chart-2/5 border border-chart-2/20">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-chart-2" />
                        <span className="font-medium text-sm">Strong Progress</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        You're excelling in problem-solving tasks. Keep up the great work!
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-chart-1/5 border border-chart-1/20">
                      <div className="flex items-center gap-2 mb-1">
                        <Lightbulb className="w-4 h-4 text-chart-1" />
                        <span className="font-medium text-sm">Recommendation</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Consider spending more time on database concepts to balance your CS learning.
                      </p>
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
                      <BookOpen className="w-4 h-4 mr-2" />
                      Study Session
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Brain className="w-4 h-4 mr-2" />
                      Take Quiz
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Target className="w-4 h-4 mr-2" />
                      Practice Problems
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="goals">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Learning Goals
                </CardTitle>
                <CardDescription>Track your academic objectives and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {learningGoals.map((goal, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{goal.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{goal.subject}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {goal.deadline}
                            </span>
                            <span>
                              {goal.completed}/{goal.tasks} tasks completed
                            </span>
                            <Badge variant={goal.priority === "high" ? "destructive" : "default"} className="text-xs">
                              {goal.priority} priority
                            </Badge>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Achievements
                </CardTitle>
                <CardDescription>Your learning milestones and badges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        achievement.earned ? "border-chart-1/20 bg-chart-1/5" : "border-border bg-muted/20 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                        {achievement.earned && <CheckCircle className="w-5 h-5 text-chart-2" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
