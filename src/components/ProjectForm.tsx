"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle } from "lucide-react"

interface Member {
  userId: string;
  name: string;
}

interface ProjectFormProps {
  onAdd?: (project: any) => void;
  availableMembers?: Member[];
}

export function ProjectForm({ onAdd, availableMembers = [] }: ProjectFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    priority: "",
  })
  
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])

  const handleToggleMember = (userId: string) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== userId))
    } else {
      setSelectedMembers([...selectedMembers, userId])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    // Form validations
    if (!formData.name.trim()) {
      setValidationError("El nombre del proyecto es obligatorio.")
      return
    }
    if (!formData.category) {
      setValidationError("Debes seleccionar una categoría.")
      return
    }
    if (!formData.priority) {
      setValidationError("Debes seleccionar la prioridad del proyecto.")
      return
    }

    // Simulate backend request with Spinner
    setLoading(true)
    setTimeout(() => {
      if (onAdd) {
        onAdd({
          id: Date.now().toString(),
          name: formData.name,
          description: formData.description,
          category: formData.category === "web" ? "Development" : formData.category === "mobile" ? "Development" : formData.category === "design" ? "Design" : "Marketing",
          status: "in-progress",
          progress: 0,
          priority: formData.priority,
          members: selectedMembers.length > 0 ? selectedMembers : ["1"], // Default to first member
          date: "Hace un momento",
        })
      }

      // Clear and close
      setFormData({ name: "", description: "", category: "", priority: "" })
      setSelectedMembers([])
      setValidationError(null)
      setLoading(false)
      setOpen(false)
    }, 800)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (!isOpen) {
        setValidationError(null)
      }
    }}>
      <DialogTrigger render={<Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm transition-all" />}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        Nuevo Proyecto
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] p-6 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Crear Nuevo Proyecto</DialogTitle>
            <DialogDescription className="text-slate-500 text-sm">
              Completa la información del proyecto. Click en guardar cuando termines.
            </DialogDescription>
          </DialogHeader>

          {/* Validation Alert */}
          {validationError && (
            <Alert variant="destructive" className="py-2.5 px-3">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertTitle className="text-xs font-bold">Error de Validación</AlertTitle>
              <AlertDescription className="text-xs">{validationError}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-semibold">
                Nombre del Proyecto <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Mi Proyecto Increíble"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="focus:ring-2 focus:ring-primary/20"
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm font-semibold">Descripción</Label>
              <Input
                id="description"
                placeholder="Breve descripción del proyecto..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="focus:ring-2 focus:ring-primary/20"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category" className="text-sm font-semibold">
                  Categoría <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value || "" })}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">Desarrollo Web</SelectItem>
                    <SelectItem value="mobile">Desarrollo Mobile</SelectItem>
                    <SelectItem value="design">Diseño</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="priority" className="text-sm font-semibold">
                  Prioridad <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value || "" })}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Team Members Field */}
            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Miembros del Equipo</Label>
              <div className="flex flex-wrap gap-2 pt-1 max-h-32 overflow-y-auto border border-slate-100 dark:border-slate-800 p-2 rounded-lg bg-slate-50/50 dark:bg-slate-900/50">
                {availableMembers.map((member) => {
                  const isSelected = selectedMembers.includes(member.userId);
                  return (
                    <button
                      key={member.userId}
                      type="button"
                      onClick={() => handleToggleMember(member.userId)}
                      disabled={loading}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary dark:bg-primary dark:text-primary-foreground dark:border-primary shadow-xs"
                          : "bg-transparent border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      {member.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          <DialogFooter className="pt-4 flex gap-2">
            <DialogClose render={<Button type="button" variant="outline" className="flex-1" disabled={loading} />}>
              Cancelar
            </DialogClose>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex-1 flex items-center justify-center gap-1.5 transition-all" disabled={loading}>
              {loading ? (
                <>
                  <Spinner className="size-4 animate-spin text-white" />
                  Guardando...
                </>
              ) : (
                "Crear Proyecto"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
