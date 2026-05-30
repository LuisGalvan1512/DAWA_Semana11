"use client"

import React, { useState, useMemo } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProjectForm } from "@/components/ProjectForm"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { 
  AlertCircle, 
  Trash2, 
  Eye, 
  Plus, 
  CalendarIcon, 
  Edit3, 
  FolderKanban, 
  Activity, 
  Clock, 
  CheckCircle,
  Briefcase,
  UserCheck,
  Settings,
  ListTodo,
  Sun,
  Moon
} from "lucide-react"

// Types definitions
interface Member {
  userId: string;
  name: string;
  email: string;
  role: string;
  position: string;
  birthdate: string;
  phone: string;
  projectId: string;
  isActive: boolean;
}

interface Task {
  id: number;
  title: string;
  projectId: string;
  status: "Pendiente" | "En progreso" | "Completado";
  priority: "Baja" | "Media" | "Alta" | "Urgente";
  userId: string;
  dueDate: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  category: "Development" | "Design" | "Marketing" | "Other";
  status: "in-progress" | "completed" | "on-hold";
  progress: number;
  priority: string;
  members: string[];
  date: string;
}

// Initial Mock Data
const INITIAL_PROJECTS: Project[] = [
  {
    id: "1",
    name: "E-commerce Platform",
    description: "Plataforma de comercio electrónico con Next.js",
    category: "Development",
    status: "in-progress",
    progress: 65,
    priority: "high",
    members: ["1", "2"],
    date: "Hace 2 días",
  },
  {
    id: "2",
    name: "Mobile App",
    description: "Aplicación móvil con React Native",
    category: "Development",
    status: "in-progress",
    progress: 90,
    priority: "medium",
    members: ["3", "4"],
    date: "Hace 5 días",
  },
  {
    id: "3",
    name: "Dashboard Analytics",
    description: "Panel de análisis con visualizaciones de datos",
    category: "Development",
    status: "on-hold",
    progress: 20,
    priority: "low",
    members: ["1", "5"],
    date: "Hace 1 semana",
  },
];

const INITIAL_MEMBERS: Member[] = [
  { userId: "1", name: "María García", role: "Frontend Developer", email: "maria@example.com", position: "Senior", birthdate: "1994-05-15", phone: "+51 987 654 321", projectId: "1", isActive: true },
  { userId: "2", name: "Juan Pérez", role: "Backend Developer", email: "juan@example.com", position: "Junior", birthdate: "1997-09-20", phone: "+51 912 345 678", projectId: "1", isActive: true },
  { userId: "3", name: "Ana López", role: "UI/UX Designer", email: "ana@example.com", position: "Lead", birthdate: "1993-11-10", phone: "+51 934 567 890", projectId: "2", isActive: false },
  { userId: "4", name: "Carlos Ruiz", role: "DevOps Engineer", email: "carlos@example.com", position: "Senior", birthdate: "1990-03-25", phone: "+51 945 678 901", projectId: "2", isActive: true },
  { userId: "5", name: "Laura Martínez", role: "Project Manager", email: "laura@example.com", position: "Lead", birthdate: "1988-08-30", phone: "+51 956 789 012", projectId: "3", isActive: true },
];

const INITIAL_TASKS: Task[] = [
  { id: 1, title: "Implementar autenticación", projectId: "1", status: "En progreso", priority: "Alta", userId: "1", dueDate: "2025-11-15" },
  { id: 2, title: "Diseñar pantalla de perfil", projectId: "2", status: "Pendiente", priority: "Media", userId: "3", dueDate: "2025-11-20" },
  { id: 3, title: "Configurar CI/CD", projectId: "2", status: "Completado", priority: "Alta", userId: "4", dueDate: "2025-11-10" },
  { id: 4, title: "Optimizar queries SQL", projectId: "1", status: "En progreso", priority: "Urgente", userId: "2", dueDate: "2025-11-12" },
  { id: 5, title: "Documentar API endpoints", projectId: "3", status: "Pendiente", priority: "Baja", userId: "5", dueDate: "2025-11-25" },
];

export default function DashboardPage() {
  // Global Shared States
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS)
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS)
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [activities, setActivities] = useState<any[]>([
    { user: "María García", action: "completó la tarea", task: "Diseño de UI", time: "Hace 5 min" },
    { user: "Juan Pérez", action: "comentó en", task: "API Backend", time: "Hace 1 hora" },
    { user: "Ana López", action: "creó un nuevo", task: "Proyecto Mobile", time: "Hace 2 horas" },
    { user: "Carlos Ruiz", action: "actualizó", task: "Documentación", time: "Hace 3 horas" },
  ])

  // System States
  const [loading, setLoading] = useState(false)
  const [alertError, setAlertError] = useState<string | null>(null)

  // Settings state
  const [settings, setSettings] = useState({
    workspaceName: "Workspace General",
    emailAlerts: true,
    darkMode: false,
    reportFrequency: "weekly",
    workedHours: 324
  })
  const [settingsSaveSuccess, setSettingsSaveSuccess] = useState(false)

  // On mount, load settings from localStorage safely (Next.js client-side only)
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedDark = localStorage.getItem("darkMode") === "true"
      const savedWorkspace = localStorage.getItem("workspaceName") || "Workspace General"
      const savedHours = localStorage.getItem("workedHours") ? parseInt(localStorage.getItem("workedHours")!) : 324
      const savedFreq = localStorage.getItem("reportFrequency") || "weekly"
      const savedEmail = localStorage.getItem("emailAlerts") !== "false"

      setSettings({
        workspaceName: savedWorkspace,
        emailAlerts: savedEmail,
        darkMode: savedDark,
        reportFrequency: savedFreq,
        workedHours: savedHours
      })

      if (savedDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [])

  // Member Form Dialog State
  const [memberDialogOpen, setMemberDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [memberBirthdate, setMemberBirthdate] = useState<Date | undefined>(new Date(1995, 0, 1))
  const [memberShowCalendar, setMemberShowCalendar] = useState(false)
  const [memberForm, setMemberForm] = useState({
    name: "",
    email: "",
    role: "",
    position: "Junior",
    phone: "",
    projectId: "1",
    isActive: true
  })

  // Task Form Dialog State
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [taskDueDate, setTaskDueDate] = useState<Date | undefined>(new Date())
  const [taskShowCalendar, setTaskShowCalendar] = useState(false)
  const [taskForm, setTaskForm] = useState({
    title: "",
    projectId: "1",
    status: "Pendiente" as any,
    priority: "Media" as any,
    userId: "1"
  })

  // Project Details Dialog State
  const [detailProject, setDetailProject] = useState<Project | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  // Pagination Tareas state (3 items per page)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 3
  
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return tasks.slice(start, start + pageSize)
  }, [tasks, currentPage])

  const totalPages = Math.ceil(tasks.length / pageSize)

  // dynamic kpi calculations based on states in memory
  const dynamicKpis = useMemo(() => {
    const totalProjects = projects.length
    const completedTasksCount = tasks.filter((t) => t.status === "Completado").length
    const activeMembersCount = members.filter((m) => m.isActive).length
    const totalWorkedHours = settings.workedHours

    return {
      totalProjects,
      completedTasksCount,
      activeMembersCount,
      totalWorkedHours
    }
  }, [projects, tasks, members, settings.workedHours])

  // CRUD Projects helper
  const handleAddProject = (newProject: any) => {
    setLoading(true)
    setTimeout(() => {
      setProjects((prev) => [newProject, ...prev])
      setActivities((prev) => [
        { user: "Administrador", action: "creó el proyecto", task: newProject.name, time: "Hace un momento" },
        ...prev
      ])
      setLoading(false)
    }, 800)
  }

  const handleDeleteProject = (id: string) => {
    setLoading(true)
    setTimeout(() => {
      const proj = projects.find((p) => p.id === id)
      setProjects((prev) => prev.filter((p) => p.id !== id))
      if (proj) {
        setActivities((prev) => [
          { user: "Administrador", action: "eliminó el proyecto", task: proj.name, time: "Hace un momento" },
          ...prev
        ])
      }
      setLoading(false)
    }, 800)
  }

  // CRUD Team members helpers
  const handleOpenNewMember = () => {
    setEditingMember(null)
    setMemberBirthdate(new Date(1995, 0, 1))
    setMemberShowCalendar(false)
    setMemberForm({
      name: "",
      email: "",
      role: "",
      position: "Junior",
      phone: "",
      projectId: projects[0]?.id || "1",
      isActive: true
    })
    setAlertError(null)
    setMemberDialogOpen(true)
  }

  const handleOpenEditMember = (member: Member) => {
    setEditingMember(member)
    setMemberBirthdate(member.birthdate ? new Date(member.birthdate) : new Date(1995, 0, 1))
    setMemberShowCalendar(false)
    setMemberForm({
      name: member.name,
      email: member.email,
      role: member.role,
      position: member.position,
      phone: member.phone,
      projectId: member.projectId,
      isActive: member.isActive
    })
    setAlertError(null)
    setMemberDialogOpen(true)
  }

  const handleSaveMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAlertError(null)

    if (!memberForm.name.trim()) {
      setAlertError("El nombre del miembro es obligatorio.")
      return
    }
    if (!memberForm.email.trim() || !memberForm.email.includes("@")) {
      setAlertError("Debes ingresar un correo electrónico válido.")
      return
    }
    if (!memberForm.role.trim()) {
      setAlertError("El rol técnico es obligatorio.")
      return
    }

    setLoading(true)
    setTimeout(() => {
      const birthStr = memberBirthdate ? memberBirthdate.toISOString().split("T")[0] : "1995-01-01"
      
      if (editingMember) {
        // Edit Member
        setMembers((prev) =>
          prev.map((m) =>
            m.userId === editingMember.userId
              ? {
                  ...m,
                  name: memberForm.name,
                  email: memberForm.email,
                  role: memberForm.role,
                  position: memberForm.position,
                  phone: memberForm.phone,
                  projectId: memberForm.projectId,
                  isActive: memberForm.isActive,
                  birthdate: birthStr,
                }
              : m
          )
        )
        setActivities((prev) => [
          { user: "Administrador", action: "actualizó al miembro", task: memberForm.name, time: "Hace un momento" },
          ...prev
        ])
      } else {
        // Add Member
        const newM: Member = {
          userId: Date.now().toString(),
          name: memberForm.name,
          email: memberForm.email,
          role: memberForm.role,
          position: memberForm.position,
          birthdate: birthStr,
          phone: memberForm.phone,
          projectId: memberForm.projectId,
          isActive: memberForm.isActive
        }
        setMembers((prev) => [...prev, newM])
        setActivities((prev) => [
          { user: "Administrador", action: "registró al miembro", task: memberForm.name, time: "Hace un momento" },
          ...prev
        ])
      }

      setLoading(false)
      setMemberDialogOpen(false)
    }, 800)
  }

  const handleDeleteMember = (userId: string) => {
    setLoading(true)
    setTimeout(() => {
      const memb = members.find((m) => m.userId === userId)
      setMembers((prev) => prev.filter((m) => m.userId !== userId))
      if (memb) {
        setActivities((prev) => [
          { user: "Administrador", action: "eliminó al miembro", task: memb.name, time: "Hace un momento" },
          ...prev
        ])
      }
      setLoading(false)
    }, 800)
  }

  // CRUD Tasks helpers
  const handleOpenNewTask = () => {
    setEditingTask(null)
    setTaskDueDate(new Date())
    setTaskShowCalendar(false)
    setTaskForm({
      title: "",
      projectId: projects[0]?.id || "1",
      status: "Pendiente",
      priority: "Media",
      userId: members[0]?.userId || "1"
    })
    setAlertError(null)
    setTaskDialogOpen(true)
  }

  const handleOpenEditTask = (task: Task) => {
    setEditingTask(task)
    setTaskDueDate(task.dueDate ? new Date(task.dueDate) : new Date())
    setTaskShowCalendar(false)
    setTaskForm({
      title: task.title,
      projectId: task.projectId,
      status: task.status,
      priority: task.priority,
      userId: task.userId
    })
    setAlertError(null)
    setTaskDialogOpen(true)
  }

  const handleSaveTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAlertError(null)

    if (!taskForm.title.trim()) {
      setAlertError("El título de la tarea es obligatorio.")
      return
    }

    setLoading(true)
    setTimeout(() => {
      const dueStr = taskDueDate ? taskDueDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0]

      if (editingTask) {
        // Edit Task
        setTasks((prev) =>
          prev.map((t) =>
            t.id === editingTask.id
              ? {
                  ...t,
                  title: taskForm.title,
                  projectId: taskForm.projectId,
                  status: taskForm.status,
                  priority: taskForm.priority,
                  userId: taskForm.userId,
                  dueDate: dueStr
                }
              : t
          )
        )
        setActivities((prev) => [
          { user: "Administrador", action: "actualizó la tarea", task: taskForm.title, time: "Hace un momento" },
          ...prev
        ])
      } else {
        // Add Task
        const newT: Task = {
          id: Date.now(),
          title: taskForm.title,
          projectId: taskForm.projectId,
          status: taskForm.status,
          priority: taskForm.priority,
          userId: taskForm.userId,
          dueDate: dueStr
        }
        setTasks((prev) => [...prev, newT])
        setActivities((prev) => [
          { user: "Administrador", action: "agregó la tarea", task: taskForm.title, time: "Hace un momento" },
          ...prev
        ])
      }

      setLoading(false)
      setTaskDialogOpen(false)
    }, 800)
  }

  const handleDeleteTask = (id: number) => {
    setLoading(true)
    setTimeout(() => {
      const task = tasks.find((t) => t.id === id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
      if (task) {
        setActivities((prev) => [
          { user: "Administrador", action: "eliminó la tarea", task: task.title, time: "Hace un momento" },
          ...prev
        ])
      }
      setLoading(false)
    }, 800)
  }

  // Settings Save simulation
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSettingsSaveSuccess(false)
    
    // Save to localStorage safely
    if (typeof window !== "undefined") {
      localStorage.setItem("workspaceName", settings.workspaceName)
      localStorage.setItem("workedHours", settings.workedHours.toString())
      localStorage.setItem("reportFrequency", settings.reportFrequency)
      localStorage.setItem("emailAlerts", settings.emailAlerts.toString())
      localStorage.setItem("darkMode", settings.darkMode.toString())
    }

    setTimeout(() => {
      setLoading(false)
      setSettingsSaveSuccess(true)
      setActivities((prev) => [
        { user: "Administrador", action: "actualizó las", task: "Configuraciones del Sistema", time: "Hace un momento" },
        ...prev
      ])
      setTimeout(() => setSettingsSaveSuccess(false), 3000)
    }, 800)
  }

  // badge variant helpers
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completado":
      case "completed":
        return "default"
      case "En progreso":
      case "in-progress":
        return "secondary"
      case "Pendiente":
      case "on-hold":
        return "outline"
      default:
        return "outline"
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Urgente":
      case "urgent":
        return "destructive"
      case "Alta":
      case "high":
        return "default"
      case "Media":
      case "medium":
        return "secondary"
      case "Baja":
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50/80 via-slate-50/95 to-slate-100/40 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/60 p-8 relative font-sans transition-colors duration-300">
      
      {/* Loading Spinner overlay */}
      {loading && (
        <div className="fixed inset-0 bg-slate-900/10 dark:bg-slate-950/25 backdrop-blur-xs flex items-center justify-center z-50">
          <Card className="flex flex-col items-center gap-3.5 p-6 bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800">
            <Spinner className="size-8 animate-spin text-slate-800 dark:text-slate-200" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Procesando solicitud...</p>
          </Card>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Crisp Enterprise Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200/80 dark:border-slate-800 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              {settings.workspaceName}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Plataforma de gestión y administración de proyectos y equipo de trabajo.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Elegant Header Theme Toggle Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const isDark = !settings.darkMode
                setSettings({ ...settings, darkMode: isDark })
                if (typeof window !== "undefined") {
                  localStorage.setItem("darkMode", isDark.toString())
                }
                if (isDark) {
                  document.documentElement.classList.add("dark")
                } else {
                  document.documentElement.classList.remove("dark")
                }
              }}
              className="h-9 w-9 rounded-lg border-border bg-card text-foreground hover:bg-accent transition-all duration-200 cursor-pointer"
              aria-label="Toggle theme"
            >
              {settings.darkMode ? (
                <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700 transition-transform duration-300" />
              )}
            </Button>

            {/* Custom ProjectForm Dialog trigger */}
            <ProjectForm 
              onAdd={handleAddProject} 
              availableMembers={members} 
            />
          </div>
        </div>

        {/* Minimalist Tabs Navigation */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-100/80 dark:bg-slate-900/50 p-1 rounded-lg border border-slate-200/20 w-fit">
            <TabsTrigger value="overview" className="px-4 py-2 text-xs font-semibold flex items-center gap-2">
              <Activity className="h-3.5 w-3.5" /> Resumen
            </TabsTrigger>
            <TabsTrigger value="projects" className="px-4 py-2 text-xs font-semibold flex items-center gap-2">
              <FolderKanban className="h-3.5 w-3.5" /> Proyectos
            </TabsTrigger>
            <TabsTrigger value="tasks" className="px-4 py-2 text-xs font-semibold flex items-center gap-2">
              <ListTodo className="h-3.5 w-3.5" /> Tareas
            </TabsTrigger>
            <TabsTrigger value="team" className="px-4 py-2 text-xs font-semibold flex items-center gap-2">
              <UserCheck className="h-3.5 w-3.5" /> Equipo
            </TabsTrigger>
            <TabsTrigger value="settings" className="px-4 py-2 text-xs font-semibold flex items-center gap-2">
              <Settings className="h-3.5 w-3.5" /> Configuración
            </TabsTrigger>
          </TabsList>

          {/* Tab: Overview (Resumen) */}
          <TabsContent value="overview" className="space-y-6">
            
            {/* Minimalist Stat Cards */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              
              <Card className="shadow-xs border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Total Proyectos
                  </CardTitle>
                  <FolderKanban className="h-4 w-4 text-slate-350" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {dynamicKpis.totalProjects}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Proyectos activos en memoria
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-xs border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Tareas Completadas
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-slate-350" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {dynamicKpis.completedTasksCount}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Tareas finalizadas
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-xs border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Horas Asignadas
                  </CardTitle>
                  <Clock className="h-4 w-4 text-slate-350" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {dynamicKpis.totalWorkedHours}h
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Horas de trabajo declaradas
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-xs border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Miembros Activos
                  </CardTitle>
                  <UserCheck className="h-4 w-4 text-slate-350" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {dynamicKpis.activeMembersCount}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Miembros disponibles
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity Card */}
            <Card className="shadow-xs border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">Actividad Reciente</CardTitle>
                <CardDescription className="text-xs">
                  Últimos eventos y acciones realizadas en el workspace.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {activities.map((activity, i) => (
                    <div key={i} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                      <Avatar className="h-8 w-8 rounded-full border border-slate-100 dark:border-slate-850">
                        <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs">
                          {activity.user[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                          {activity.user}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {activity.action} <span className="font-semibold text-slate-700 dark:text-slate-300">{activity.task}</span>
                        </p>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Projects */}
          <TabsContent value="projects" className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id} className="flex flex-col justify-between shadow-xs border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/40 transition-all hover:border-slate-300/80">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge variant="outline" className="text-[9px] uppercase tracking-wider font-bold">
                        {project.category}
                      </Badge>
                      <Badge variant={getStatusBadge(project.status)} className="text-[9px] font-bold">
                        {project.status === "in-progress" ? "En progreso" : project.status === "completed" ? "Completado" : "En espera"}
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{project.name}</CardTitle>
                    <CardDescription className="line-clamp-2 text-xs leading-normal mt-1">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1 font-semibold text-slate-500">
                        <span>Progreso</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-800 dark:bg-slate-200 transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center gap-1.5 font-medium text-slate-400">
                        <Briefcase className="h-3.5 w-3.5" />
                        {project.members.length} miembros
                      </div>
                      <div className="flex gap-1.5">
                        <Button 
                          size="xs" 
                          variant="outline"
                          onClick={() => {
                            setDetailProject(project)
                            setDetailOpen(true)
                          }}
                          className="h-7 text-xs font-semibold px-2.5"
                        >
                          <Eye className="h-3 w-3 mr-1" /> Detalles
                        </Button>
                        <Button 
                          size="xs" 
                          variant="destructive"
                          onClick={() => handleDeleteProject(project.id)}
                          className="h-7 w-7 p-0 flex items-center justify-center"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Project Details Modal */}
            {detailProject && (
              <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="max-w-md p-6 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">{detailProject.name}</DialogTitle>
                    <DialogDescription className="text-xs text-slate-500">
                      Información técnica y equipo asignado al proyecto.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-3 text-sm">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Descripción</h4>
                      <p className="text-slate-600 dark:text-slate-350 mt-1 leading-relaxed text-xs">{detailProject.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Categoría</h4>
                        <Badge variant="outline" className="mt-1 text-[10px]">{detailProject.category}</Badge>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Prioridad</h4>
                        <Badge variant={getPriorityBadge(detailProject.priority)} className="mt-1 text-[10px] capitalize">
                          {detailProject.priority === "high" ? "Alta" : detailProject.priority === "medium" ? "Media" : detailProject.priority === "low" ? "Baja" : "Urgente"}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Equipo Asignado</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                        {members
                          .filter((m) => detailProject.members.includes(m.userId))
                          .map((m) => (
                            <div key={m.userId} className="flex items-center gap-2 border border-slate-100 dark:border-slate-800/80 p-1.5 rounded-lg">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">{m.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-xs font-semibold text-slate-850 dark:text-slate-200">{m.name}</p>
                                <p className="text-[10px] text-slate-400">{m.role}</p>
                              </div>
                            </div>
                          ))}
                        {members.filter((m) => detailProject.members.includes(m.userId)).length === 0 && (
                          <p className="text-xs text-slate-450 italic">No hay miembros asignados a este proyecto.</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose render={<Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all" />}>
                      Cerrar Ficha
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>

          {/* Tab: Tasks (Tareas) */}
          <TabsContent value="tasks" className="space-y-6">
            <Card className="shadow-xs border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
                <div>
                  <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">Gestión de Tareas</CardTitle>
                  <CardDescription className="text-xs">
                    Administra y distribuye las tareas de tu equipo.
                  </CardDescription>
                </div>
                <Button size="sm" onClick={handleOpenNewTask} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-9 px-4 transition-all shadow-sm">
                  <Plus className="mr-1.5 h-4 w-4" /> Nueva Tarea
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-slate-200/80 dark:border-slate-800 overflow-hidden">
                  <Table>
                    <TableCaption className="text-[11px] pb-3 text-slate-450">Tareas paginadas en memoria ({tasks.length} en total)</TableCaption>
                    <TableHeader className="bg-slate-50/80 dark:bg-slate-900">
                      <TableRow className="border-b border-slate-200/80 dark:border-slate-800">
                        <TableHead className="font-semibold text-xs text-slate-500 uppercase tracking-wider py-3">Tarea</TableHead>
                        <TableHead className="font-semibold text-xs text-slate-500 uppercase tracking-wider py-3">Proyecto</TableHead>
                        <TableHead className="font-semibold text-xs text-slate-500 uppercase tracking-wider py-3">Estado</TableHead>
                        <TableHead className="font-semibold text-xs text-slate-500 uppercase tracking-wider py-3">Prioridad</TableHead>
                        <TableHead className="font-semibold text-xs text-slate-500 uppercase tracking-wider py-3">Asignado</TableHead>
                        <TableHead className="font-semibold text-xs text-slate-500 uppercase tracking-wider py-3">Fecha Límite</TableHead>
                        <TableHead className="font-semibold text-xs text-slate-500 uppercase tracking-wider py-3 text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/85">
                      {paginatedTasks.map((task) => {
                        const projName = projects.find((p) => p.id === task.projectId)?.name || "N/A"
                        const assigneeName = members.find((m) => m.userId === task.userId)?.name || "N/A"
                        return (
                          <TableRow key={task.id} className="hover:bg-slate-50/20 border-b border-slate-100 dark:border-slate-800/50">
                            <TableCell className="font-bold text-slate-800 dark:text-slate-100 text-xs py-3.5">{task.title}</TableCell>
                            <TableCell className="text-xs text-slate-600 dark:text-slate-400 py-3.5">{projName}</TableCell>
                            <TableCell className="py-3.5">
                              <Badge variant={getStatusBadge(task.status)} className="text-[9px] py-0.5 font-bold">
                                {task.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-3.5">
                              <Badge variant={getPriorityBadge(task.priority)} className="text-[9px] py-0.5 font-bold capitalize">
                                {task.priority}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-slate-600 dark:text-slate-400 py-3.5">{assigneeName}</TableCell>
                            <TableCell className="text-xs text-slate-500 py-3.5">{task.dueDate}</TableCell>
                            <TableCell className="text-right flex items-center justify-end gap-1.5 py-3.5">
                              <Button 
                                variant="outline" 
                                size="xs" 
                                onClick={() => handleOpenEditTask(task)}
                                className="h-7 w-7 p-0 flex items-center justify-center border-slate-200"
                              >
                                <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="xs" 
                                onClick={() => handleDeleteTask(task.id)}
                                className="h-7 w-7 p-0 flex items-center justify-center"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                      {tasks.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-slate-450 text-xs italic">
                            No hay tareas registradas. Crea una nueva tarea para comenzar.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="pt-5">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            text="Anterior"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-40 text-xs" : "cursor-pointer text-xs font-semibold"}
                          />
                        </PaginationItem>
                        {Array.from({ length: totalPages }).map((_, i) => {
                          const pNum = i + 1
                          return (
                            <PaginationItem key={pNum}>
                              <PaginationLink
                                isActive={currentPage === pNum}
                                onClick={() => setCurrentPage(pNum)}
                                className="cursor-pointer font-bold text-xs h-8 w-8"
                              >
                                {pNum}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        })}
                        <PaginationItem>
                          <PaginationNext
                            text="Siguiente"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            className={currentPage === totalPages ? "pointer-events-none opacity-40 text-xs" : "cursor-pointer text-xs font-semibold"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Task Dialog Modal Form */}
            <Dialog open={taskDialogOpen} onOpenChange={(isOpen) => {
              setTaskDialogOpen(isOpen)
              if (!isOpen) setAlertError(null)
            }}>
              <DialogContent className="max-w-md p-6 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800">
                <form onSubmit={handleSaveTaskSubmit} className="space-y-4">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                      {editingTask ? "Editar Tarea" : "Nueva Tarea"}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500">
                      Ingresa el título, proyecto, responsable y plazos correspondientes.
                    </DialogDescription>
                  </DialogHeader>

                  {/* Form Validation Alert */}
                  {alertError && (
                    <Alert variant="destructive" className="py-2.5 px-3">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle className="text-xs font-bold">Campos Requeridos</AlertTitle>
                      <AlertDescription className="text-xs">{alertError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3.5 text-xs py-2">
                    <div className="grid gap-1.5">
                      <Label htmlFor="task-title" className="font-bold text-[11px] uppercase tracking-wide text-slate-400">Título de la Tarea *</Label>
                      <Input
                        id="task-title"
                        placeholder="Ej. Escribir manual de endpoints de API"
                        value={taskForm.title}
                        onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                        className="focus:ring-2 focus:ring-slate-800/10 border-slate-200"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-1.5">
                        <Label className="font-bold text-[11px] uppercase tracking-wide text-slate-400">Proyecto Asociado *</Label>
                        <Select
                          value={taskForm.projectId}
                          onValueChange={(val) => setTaskForm({ ...taskForm, projectId: val || "1" })}
                        >
                          <SelectTrigger className="border-slate-200 text-xs">
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            {projects.map((p) => (
                              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-1.5">
                        <Label className="font-bold text-[11px] uppercase tracking-wide text-slate-400">Asignar a *</Label>
                        <Select
                          value={taskForm.userId}
                          onValueChange={(val) => setTaskForm({ ...taskForm, userId: val || "1" })}
                        >
                          <SelectTrigger className="border-slate-200 text-xs">
                            <SelectValue placeholder="Miembro" />
                          </SelectTrigger>
                          <SelectContent>
                            {members.map((m) => (
                              <SelectItem key={m.userId} value={m.userId}>{m.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-1.5">
                        <Label className="font-bold text-[11px] uppercase tracking-wide text-slate-400">Estado *</Label>
                        <Select
                          value={taskForm.status}
                          onValueChange={(val) => setTaskForm({ ...taskForm, status: val as any })}
                        >
                          <SelectTrigger className="border-slate-200 text-xs">
                            <SelectValue placeholder="Estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pendiente">Pendiente</SelectItem>
                            <SelectItem value="En progreso">En progreso</SelectItem>
                            <SelectItem value="Completado">Completado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-1.5">
                        <Label className="font-bold text-[11px] uppercase tracking-wide text-slate-400">Prioridad *</Label>
                        <Select
                          value={taskForm.priority}
                          onValueChange={(val) => setTaskForm({ ...taskForm, priority: val as any })}
                        >
                          <SelectTrigger className="border-slate-200 text-xs">
                            <SelectValue placeholder="Prioridad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Baja">Baja</SelectItem>
                            <SelectItem value="Media">Media</SelectItem>
                            <SelectItem value="Alta">Alta</SelectItem>
                            <SelectItem value="Urgente">Urgente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Dateline (Date selector) */}
                    <div className="grid gap-1.5 relative">
                      <Label className="font-bold text-[11px] uppercase tracking-wide text-slate-400 flex justify-between items-center">
                        <span>Fecha de Vencimiento *</span>
                        <span className="text-slate-800 dark:text-slate-200 font-bold">{taskDueDate?.toISOString().split("T")[0]}</span>
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setTaskShowCalendar(!taskShowCalendar)}
                        className="w-full flex items-center justify-between text-slate-700 dark:text-slate-300 border-slate-200"
                      >
                        <span className="text-xs">Seleccionar Fecha del Calendario</span>
                        <CalendarIcon className="h-4 w-4 text-slate-400" />
                      </Button>
                      
                      {taskShowCalendar && (
                        <div className="absolute top-full left-0 z-40 bg-white dark:bg-slate-900 border rounded-lg shadow-lg mt-1 p-1">
                          <Calendar
                            mode="single"
                            selected={taskDueDate}
                            onSelect={(date) => {
                              setTaskDueDate(date)
                              setTaskShowCalendar(false)
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <DialogFooter className="pt-4 flex gap-2">
                    <DialogClose render={<Button type="button" variant="outline" className="flex-1" />}>
                      Cancelar
                    </DialogClose>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex-1 transition-all">
                      Guardar Tarea
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Tab: Team (Equipo) */}
          <TabsContent value="team" className="space-y-6">
            <Card className="shadow-xs border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
                <div>
                  <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">Miembros del Equipo</CardTitle>
                  <CardDescription className="text-xs">
                    Administra los integrantes de tu organización, roles y asignación de proyectos.
                  </CardDescription>
                </div>
                <Button size="sm" onClick={handleOpenNewMember} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-9 px-4 transition-all shadow-sm">
                  <Plus className="mr-1.5 h-4 w-4" /> Registrar Miembro
                </Button>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {members.map((member) => {
                    const projName = projects.find((p) => p.id === member.projectId)?.name || "Ninguno"
                    return (
                      <div key={member.userId} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 first:pt-0 last:pb-0 gap-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10 border border-slate-100 dark:border-slate-800">
                            <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 font-bold text-sm">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{member.name}</p>
                              <Badge variant="outline" className="text-[9px] font-bold py-0">{member.position}</Badge>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{member.role} &bull; {member.email}</p>
                            <p className="text-[10px] text-slate-400 mt-1">
                              F. Nacimiento: <strong className="text-slate-500">{member.birthdate}</strong> &bull; Telf: <strong className="text-slate-500">{member.phone}</strong> &bull; Proyecto: <strong className="text-slate-600 dark:text-slate-400 font-semibold">{projName}</strong>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={member.isActive}
                              onCheckedChange={(checked) => {
                                setMembers((prev) =>
                                  prev.map((m) =>
                                    m.userId === member.userId ? { ...m, isActive: checked } : m
                                  )
                                )
                                setActivities((prev) => [
                                  { user: "Administrador", action: checked ? "activó a" : "desactivó a", task: member.name, time: "Hace un momento" },
                                  ...prev
                                ])
                              }}
                            />
                            <Label className="text-xs font-semibold text-slate-500">
                              {member.isActive ? "Activo" : "Ausente"}
                            </Label>
                          </div>
                          
                          <div className="flex gap-1.5 ml-2">
                            <Button size="xs" variant="outline" onClick={() => handleOpenEditMember(member)} className="h-7 border-slate-200 text-xs px-2.5">
                              Editar
                            </Button>
                            <Button size="xs" variant="destructive" onClick={() => handleDeleteMember(member.userId)} className="h-7 w-7 p-0 flex items-center justify-center">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {members.length === 0 && (
                    <p className="text-center py-6 text-slate-500 italic text-xs">
                      No hay miembros registrados. Agrega uno nuevo para iniciar la gestión.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Member Dialog Modal Form */}
            <Dialog open={memberDialogOpen} onOpenChange={(isOpen) => {
              setMemberDialogOpen(isOpen)
              if (!isOpen) setAlertError(null)
            }}>
              <DialogContent className="max-w-md p-6 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800">
                <form onSubmit={handleSaveMemberSubmit} className="space-y-4">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                      {editingMember ? "Editar Miembro" : "Registrar Miembro"}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500">
                      Ingresa el perfil profesional y detalles de contacto del integrante.
                    </DialogDescription>
                  </DialogHeader>

                  {/* Form Validation Alert */}
                  {alertError && (
                    <Alert variant="destructive" className="py-2.5 px-3">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle className="text-xs font-bold">Campos Requeridos</AlertTitle>
                      <AlertDescription className="text-xs">{alertError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3.5 text-xs py-2">
                    <div className="grid gap-1.5">
                      <Label htmlFor="memb-name" className="font-bold text-[11px] uppercase tracking-wide text-slate-400">Nombre Completo *</Label>
                      <Input
                        id="memb-name"
                        placeholder="Ej. María García"
                        value={memberForm.name}
                        onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                        className="focus:ring-2 focus:ring-slate-800/10 border-slate-200"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-1.5">
                        <Label htmlFor="memb-email" className="font-bold text-[11px] uppercase tracking-wide text-slate-400">Correo Electrónico *</Label>
                        <Input
                          id="memb-email"
                          type="email"
                          placeholder="maria@example.com"
                          value={memberForm.email}
                          onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                          className="focus:ring-2 focus:ring-slate-800/10 border-slate-200"
                        />
                      </div>

                      <div className="grid gap-1.5">
                        <Label htmlFor="memb-phone" className="font-bold text-[11px] uppercase tracking-wide text-slate-400">Teléfono</Label>
                        <Input
                          id="memb-phone"
                          placeholder="+51 987 654 321"
                          value={memberForm.phone}
                          onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                          className="focus:ring-2 focus:ring-slate-800/10 border-slate-200"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-1.5">
                        <Label htmlFor="memb-role" className="font-bold text-[11px] uppercase tracking-wide text-slate-400">Rol Técnico *</Label>
                        <Input
                          id="memb-role"
                          placeholder="Ej. UI/UX Designer"
                          value={memberForm.role}
                          onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                          className="focus:ring-2 focus:ring-slate-800/10 border-slate-200"
                        />
                      </div>

                      <div className="grid gap-1.5">
                        <Label className="font-bold text-[11px] uppercase tracking-wide text-slate-400">Jerarquía / Posición</Label>
                        <Select
                          value={memberForm.position}
                          onValueChange={(val) => setMemberForm({ ...memberForm, position: val || "Junior" })}
                        >
                          <SelectTrigger className="border-slate-200 text-xs">
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Junior">Junior</SelectItem>
                            <SelectItem value="Semi-Senior">Semi-Senior</SelectItem>
                            <SelectItem value="Senior">Senior</SelectItem>
                            <SelectItem value="Lead">Lead</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-1.5">
                        <Label className="font-bold text-[11px] uppercase tracking-wide text-slate-400">Asignar Proyecto</Label>
                        <Select
                          value={memberForm.projectId}
                          onValueChange={(val) => setMemberForm({ ...memberForm, projectId: val || "1" })}
                        >
                          <SelectTrigger className="border-slate-200 text-xs">
                            <SelectValue placeholder="Proyecto" />
                          </SelectTrigger>
                          <SelectContent>
                            {projects.map((p) => (
                              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-2 pt-6">
                        <Switch
                          id="memb-active"
                          checked={memberForm.isActive}
                          onCheckedChange={(checked) => setMemberForm({ ...memberForm, isActive: checked })}
                        />
                        <Label htmlFor="memb-active" className="font-semibold text-xs cursor-pointer text-slate-600">Miembro Activo</Label>
                      </div>
                    </div>

                    {/* Birthdate (Date selector) */}
                    <div className="grid gap-1.5 relative">
                      <Label className="font-bold text-[11px] uppercase tracking-wide text-slate-400 flex justify-between items-center">
                        <span>Fecha de Nacimiento *</span>
                        <span className="text-slate-800 dark:text-slate-200 font-bold">{memberBirthdate?.toISOString().split("T")[0]}</span>
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setMemberShowCalendar(!memberShowCalendar)}
                        className="w-full flex items-center justify-between text-slate-700 dark:text-slate-350 border-slate-200"
                      >
                        <span className="text-xs">Seleccionar Fecha del Calendario</span>
                        <CalendarIcon className="h-4 w-4 text-slate-400" />
                      </Button>
                      
                      {memberShowCalendar && (
                        <div className="absolute top-full left-0 z-40 bg-white dark:bg-slate-900 border rounded-lg shadow-lg mt-1 p-1">
                          <Calendar
                            mode="single"
                            selected={memberBirthdate}
                            onSelect={(date) => {
                              setMemberBirthdate(date)
                              setMemberShowCalendar(false)
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <DialogFooter className="pt-4 flex gap-2">
                    <DialogClose render={<Button type="button" variant="outline" className="flex-1" />}>
                      Cancelar
                    </DialogClose>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex-1 transition-all">
                      Guardar Miembro
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Tab: Settings (Configuración) */}
          <TabsContent value="settings">
            <Card className="shadow-xs border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">Configuración General</CardTitle>
                <CardDescription className="text-xs">
                  Administra las preferencias y opciones operativas del workspace.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveSettings} className="space-y-4 max-w-md">
                  {settingsSaveSuccess && (
                    <Alert className="bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 py-2.5">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <AlertTitle className="text-xs font-bold">Éxito</AlertTitle>
                      <AlertDescription className="text-xs">Las configuraciones se guardaron correctamente en la memoria.</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="sett-workspace" className="text-xs font-bold uppercase tracking-wide text-slate-400">Nombre del Workspace</Label>
                    <Input
                      id="sett-workspace"
                      value={settings.workspaceName}
                      onChange={(e) => setSettings({ ...settings, workspaceName: e.target.value })}
                      className="focus:ring-2 focus:ring-slate-800/10 border-slate-200 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="sett-hours" className="text-xs font-bold uppercase tracking-wide text-slate-400">Simular Horas Trabajadas Totales</Label>
                    <Input
                      id="sett-hours"
                      type="number"
                      value={settings.workedHours.toString()}
                      onChange={(e) => setSettings({ ...settings, workedHours: parseInt(e.target.value) || 0 })}
                      className="focus:ring-2 focus:ring-slate-800/10 border-slate-200 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wide text-slate-400">Frecuencia de Reportes</Label>
                    <Select
                      value={settings.reportFrequency}
                      onValueChange={(val) => setSettings({ ...settings, reportFrequency: val || "weekly" })}
                    >
                      <SelectTrigger className="border-slate-200 text-xs">
                        <SelectValue placeholder="Frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Diario</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-slate-200/80 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
                    <div className="space-y-0.5">
                      <Label htmlFor="sett-email" className="text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer">Notificaciones por Correo</Label>
                      <p className="text-[10px] text-slate-400">Recibir alertas en bandeja ante cambios del CRUD.</p>
                    </div>
                    <Switch
                      id="sett-email"
                      checked={settings.emailAlerts}
                      onCheckedChange={(checked) => setSettings({ ...settings, emailAlerts: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border border-slate-200/80 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
                    <div className="space-y-0.5">
                      <Label htmlFor="sett-dark" className="text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer">Modo Oscuro Experimental</Label>
                      <p className="text-[10px] text-slate-400">Activa el background de contraste extendido.</p>
                    </div>
                    <Switch
                      id="sett-dark"
                      checked={settings.darkMode}
                      onCheckedChange={(checked) => {
                        setSettings({ ...settings, darkMode: checked })
                        if (typeof window !== "undefined") {
                          localStorage.setItem("darkMode", checked.toString())
                        }
                        if (checked) {
                          document.documentElement.classList.add("dark")
                        } else {
                          document.documentElement.classList.remove("dark")
                        }
                      }}
                    />
                  </div>

                  <div className="pt-2">
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-9 transition-all shadow-xs">
                      Guardar Configuración
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
