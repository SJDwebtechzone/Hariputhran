import { useState, useEffect, useRef, type ChangeEvent } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Loader2,
  DownloadCloud,
  Ban,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  SERVICE_ICON_OPTIONS,
  getServiceIcon,
} from "@/constants/serviceIcons";
import { ServiceCard } from "@/components/services/ServiceCard";
import {
  getServiceImageSrc,
  getDefaultServiceImage,
} from "@/utils/serviceImage";
import type { ServiceItemData } from "@/types/service";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");
const MAX_IMAGE_SIZE_BYTES = 200 * 1024; // 200 KB

function getAuthHeaders(): HeadersInit {
  const token =
    localStorage.getItem("hariputhran_token") ||
    sessionStorage.getItem("hariputhran_token") ||
    "";
  return {
    Authorization: `Bearer ${token}`,
  };
}

export function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State (No buttonLink input)
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState<string[]>([""]);
  const [buttonLabel, setButtonLabel] = useState("Discuss Your Project");
  const [iconKey, setIconKey] = useState<string | null>("none");
  const [isActive, setIsActive] = useState(true);

  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formTopRef = useRef<HTMLDivElement>(null);

  const fetchServices = async () => {
    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const res = await fetch(`${API_BASE}/api/admin/services`, {
        headers: getAuthHeaders(),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.status === 401) {
        toast.error("Session expired or unauthorized", {
          description: "Please sign in again to manage services.",
        });
        setServices([]);
        return;
      }

      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setServices(data.data);
      } else {
        toast.error("Failed to load services", { description: data.message || "Unknown error" });
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error(err);
      if (err.name === "AbortError") {
        toast.error("Request timed out", { description: "The backend server took too long to respond." });
      } else {
        toast.error("Network error", { description: "Could not connect to the backend server." });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleImportDefaults = async () => {
    setImporting(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const res = await fetch(`${API_BASE}/api/admin/services/import-defaults`, {
        method: "POST",
        headers: getAuthHeaders(),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Default Services Imported!", { description: data.message });
        await fetchServices();
      } else {
        toast.error("Import failed", { description: data.message });
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error(err);
      toast.error("Error importing services", { description: "Could not reach backend server." });
    } finally {
      setImporting(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setFeatures([""]);
    setButtonLabel("Discuss Your Project");
    setIconKey("none"); // Default for new service is No Icon
    setIsActive(true);
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(false);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (service: ServiceItemData) => {
    setEditingId(Number(service.id));
    setTitle(service.title || "");
    setDescription(service.description || "");
    setFeatures(
      service.features && service.features.length > 0 ? [...service.features] : [""]
    );
    setButtonLabel(service.button_label || "Discuss Your Project");
    setIconKey(service.icon_key || "none");
    setIsActive(service.is_active !== undefined ? service.is_active : true);
    setImageFile(null);
    setImagePreview(service.has_image ? getServiceImageSrc(service, 0) : null);
    setRemoveImage(false);
    setFormError(null);
    setModalOpen(true);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 200 KB
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      const errorMsg = `Selected file is ${(file.size / 1024).toFixed(1)} KB. Maximum allowed size is 200 KB. Please compress your image.`;
      setFormError(errorMsg);
      toast.error("Image too large", { description: errorMsg });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type.toLowerCase())) {
      const errorMsg = "Please upload a valid JPEG, PNG, or WebP image.";
      setFormError(errorMsg);
      toast.error("Invalid format", { description: errorMsg });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setFormError(null);
    setImageFile(file);
    setRemoveImage(false);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddFeature = () => {
    if (features.length >= 8) {
      toast.warning("Maximum 8 key features allowed.");
      return;
    }
    setFeatures([...features, ""]);
  };

  const handleFeatureChange = (index: number, val: string) => {
    const updated = [...features];
    updated[index] = val.slice(0, 80);
    setFeatures(updated);
  };

  const handleRemoveFeature = (index: number) => {
    const updated = features.filter((_, i) => i !== index);
    setFeatures(updated.length ? updated : [""]);
  };

  const handleIconSelect = (key: string) => {
    // If clicking the active icon again, deselect back to "none"
    if (iconKey === key) {
      setIconKey("none");
    } else {
      setIconKey(key);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError("Service title is required.");
      formTopRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (!description.trim()) {
      setFormError("Description is required.");
      formTopRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const cleanedFeatures = features.map((f) => f.trim()).filter(Boolean);

    setSaving(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("features", JSON.stringify(cleanedFeatures));
      formData.append("button_label", buttonLabel.trim() || "Discuss Your Project");
      // Optional icon: if "none" or null, send empty string so backend stores NULL
      formData.append("icon_key", iconKey && iconKey !== "none" ? iconKey : "");
      formData.append("is_active", String(isActive));

      if (imageFile) {
        formData.append("image", imageFile);
      } else if (removeImage) {
        formData.append("removeImage", "true");
      }

      const url = editingId
        ? `${API_BASE}/api/admin/services/${editingId}`
        : `${API_BASE}/api/admin/services`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(editingId ? "Service updated successfully!" : "Service published successfully!");
        setModalOpen(false);

        const savedId = data.data?.id;
        if (savedId) {
          setHighlightedId(Number(savedId));
          setTimeout(() => setHighlightedId(null), 3000);
        }

        await fetchServices();
      } else {
        const errMsg = data.message || "Failed to save service.";
        setFormError(errMsg);
        toast.error("Save failed", { description: errMsg });
        formTopRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error(err);
      const errMsg =
        err.name === "AbortError"
          ? "Request timed out after 20 seconds."
          : "An unexpected error occurred while saving.";
      setFormError(errMsg);
      toast.error("Error saving service", { description: errMsg });
      formTopRef.current?.scrollIntoView({ behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/services/${id}/active`, {
        method: "PATCH",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setServices((prev) =>
          prev.map((s) => (s.id === id ? { ...s, is_active: !currentStatus } : s))
        );
      } else {
        toast.error("Update failed", { description: data.message });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle status");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const newServices = [...services];
    const [moved] = newServices.splice(index, 1);
    newServices.splice(targetIndex, 0, moved);

    setServices(newServices);

    try {
      const orderPayload = newServices.map((s, idx) => ({
        id: s.id,
        sort_order: idx + 1,
      }));

      const res = await fetch(`${API_BASE}/api/admin/services/reorder`, {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order: orderPayload }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error("Reorder failed", { description: data.message });
        fetchServices();
      }
    } catch (err) {
      console.error(err);
      toast.error("Reorder error");
      fetchServices();
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/services/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Service deleted successfully.");
        setServices((prev) => prev.filter((s) => s.id !== id));
        setDeleteConfirmId(null);
      } else {
        toast.error("Delete failed", { description: data.message });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error deleting service");
    }
  };

  // Preview index calculation
  const editingIndex = editingId ? services.findIndex((s) => s.id === editingId) : -1;
  const previewIndex = editingIndex >= 0 ? editingIndex : services.length;
  const currentFallbackPhoto = getDefaultServiceImage(previewIndex);

  // Preview service object for real-time modal rendering
  const previewServiceObj: Partial<ServiceItemData> = {
    id: editingId || 999,
    title: title || "Your Service Title",
    description: description || "Service detailed description will appear here as you type.",
    features: features.map((f) => f.trim()).filter(Boolean),
    button_label: buttonLabel || "Discuss Your Project",
    button_link: "/contact",
    icon_key: iconKey && iconKey !== "none" ? iconKey : null,
    has_image: !!imagePreview && !removeImage,
    image_url: !removeImage && imagePreview ? imagePreview : null,
  };

  return (
    <AdminLayout
      activeNav="services"
      title="Core Services"
      subtitle="Manage, reorder, and configure core service offerings displayed on the public Services page."
    >
      {/* Top Banner Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-['Poppins',sans-serif] text-xl font-bold text-[#082342]">
            Service Offerings
          </h2>
          <p className="text-xs text-slate-500">
            {services.length} {services.length === 1 ? "service" : "services"} configured (
            {services.filter((s) => s.is_active).length} live on website)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={openCreateModal}
            className="h-10 gap-2 rounded-xl bg-[#f97316] px-5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-orange-500/20 hover:bg-[#ea580c]"
          >
            <Plus className="size-4" />
            Add New Service
          </Button>
        </div>
      </div>

      {/* Services List Table / Cards */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="size-8 animate-spin text-[#0284c7]" />
            <p className="font-mono text-xs text-slate-500">Loading services from database...</p>
          </div>
        </div>
      ) : services.length === 0 ? (
        <div className="flex min-h-[340px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="grid size-14 place-items-center rounded-2xl bg-sky-50 text-[#0284c7]">
            <Sparkles className="size-7" />
          </div>
          <h3 className="mt-4 font-['Poppins',sans-serif] text-base font-bold text-[#082342]">
            No services configured in database
          </h3>
          <p className="mt-1 max-w-md text-xs text-slate-500 leading-relaxed">
            The services table is currently empty. You can import the two standard services from the website, or create a brand new service from scratch.
          </p>
          
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={handleImportDefaults}
              disabled={importing}
              className="h-10 gap-2 rounded-xl bg-[#0284c7] px-5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#0369a1] disabled:opacity-50"
            >
              {importing ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <DownloadCloud className="size-4" />
                  IMPORT CURRENT WEBSITE SERVICES
                </>
              )}
            </Button>

            <Button
              onClick={openCreateModal}
              variant="outline"
              className="h-10 gap-2 rounded-xl border-slate-300 bg-white px-5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-100"
            >
              <Plus className="size-4" />
              Create Custom Service
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-4 pl-6 pr-3">Order</th>
                    <th className="px-4 py-4">Thumbnail</th>
                    <th className="px-4 py-4">Service Details</th>
                    <th className="px-4 py-4">Icon</th>
                    <th className="px-4 py-4">Features</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="py-4 pl-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {services.map((service, index) => {
                    const IconComponent = getServiceIcon(service.icon_key);
                    const isFirst = index === 0;
                    const isLast = index === services.length - 1;
                    const isHighlighted = highlightedId === Number(service.id);
                    const thumbnailSrc = getServiceImageSrc(service, index);
                    const fallbackImg = getDefaultServiceImage(index);

                    return (
                      <tr
                        key={service.id}
                        className={`transition-all duration-500 ${
                          isHighlighted
                            ? "bg-amber-50/80 ring-2 ring-amber-400 ring-inset"
                            : "hover:bg-slate-50/80"
                        }`}
                      >
                        {/* Order Reorder */}
                        <td className="py-4 pl-6 pr-3">
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-xs font-bold text-slate-400">
                              #{index + 1}
                            </span>
                            <div className="flex flex-col">
                              <button
                                disabled={isFirst}
                                onClick={() => handleMove(index, "up")}
                                className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-800 disabled:opacity-20"
                                title="Move Up"
                              >
                                <ArrowUp className="size-3.5" />
                              </button>
                              <button
                                disabled={isLast}
                                onClick={() => handleMove(index, "down")}
                                className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-800 disabled:opacity-20"
                                title="Move Down"
                              >
                                <ArrowDown className="size-3.5" />
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Thumbnail with onError fallback */}
                        <td className="px-4 py-4">
                          <div className="relative size-14 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
                            <img
                              src={thumbnailSrc}
                              alt={service.title}
                              onError={(e) => {
                                if (e.currentTarget.src !== fallbackImg) {
                                  console.warn(`[Thumbnail] Failed loading: ${e.currentTarget.src}, fallback to default.`);
                                  e.currentTarget.src = fallbackImg;
                                }
                              }}
                              className="size-full object-cover"
                            />
                            {!service.has_image && (
                              <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] font-mono text-white text-center py-0.5">
                                default
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Title & Description */}
                        <td className="px-4 py-4">
                          <div className="max-w-[280px]">
                            <div className="font-['Poppins',sans-serif] text-sm font-bold text-[#082342]">
                              {service.title}
                            </div>
                            <p className="mt-0.5 line-clamp-2 text-[11px] text-slate-500">
                              {service.description}
                            </p>
                          </div>
                        </td>

                        {/* Icon (Muted "None" when no icon) */}
                        <td className="px-4 py-4">
                          {IconComponent ? (
                            <div className="inline-flex items-center gap-2 rounded-lg bg-sky-50 px-2.5 py-1 text-xs font-semibold text-[#0284c7]">
                              <IconComponent className="size-4" />
                              <span>{service.icon_key}</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-400 font-mono">
                              <Ban className="size-3 text-slate-400" />
                              <span>None</span>
                            </div>
                          )}
                        </td>

                        {/* Key Features Count */}
                        <td className="px-4 py-4">
                          <div className="font-mono text-xs font-semibold text-slate-600">
                            {service.features?.length || 0} features
                          </div>
                        </td>

                        {/* Status Toggle */}
                        <td className="px-4 py-4">
                          <button
                            onClick={() => handleToggleActive(Number(service.id), !!service.is_active)}
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide transition-colors ${
                              service.is_active
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 hover:bg-emerald-100"
                                : "bg-slate-100 text-slate-500 ring-1 ring-slate-300 hover:bg-slate-200"
                            }`}
                          >
                            {service.is_active ? (
                              <>
                                <Eye className="size-3" /> Active
                              </>
                            ) : (
                              <>
                                <EyeOff className="size-3" /> Hidden
                              </>
                            )}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-4 pl-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditModal(service)}
                              className="h-8 gap-1 rounded-lg border-slate-200 bg-white px-2.5 text-xs text-slate-700 hover:bg-slate-100 hover:text-[#082342]"
                            >
                              <Edit2 className="size-3.5" />
                              Edit
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeleteConfirmId(Number(service.id))}
                              className="h-8 gap-1 rounded-lg border-red-200 bg-white px-2.5 text-xs text-red-600 hover:border-red-300 hover:bg-red-50"
                            >
                              <Trash2 className="size-3.5" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <div className="grid size-10 place-items-center rounded-xl bg-red-50">
                <AlertCircle className="size-6" />
              </div>
              <div>
                <h3 className="font-['Poppins',sans-serif] text-base font-bold text-[#082342]">
                  Delete Service?
                </h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-600">
              Are you sure you want to permanently remove this service from your core offerings?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmId(null)}
                className="h-9 rounded-xl border-slate-200 text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDelete(deleteConfirmId)}
                className="h-9 rounded-xl bg-red-600 px-4 text-xs font-bold text-white hover:bg-red-700"
              >
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="my-8 w-full max-w-5xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-[#082342] text-white">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <h3 className="font-['Poppins',sans-serif] text-base font-bold text-[#082342]">
                    {editingId ? "Edit Service" : "Create New Service"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure details, key features, photo, and CTA button.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body: Split Form + Live Preview */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div ref={formTopRef} />

              {/* Inline Error Banner */}
              {formError && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
                  <AlertCircle className="size-5 shrink-0 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-bold">Cannot save service</p>
                    <p className="mt-0.5 leading-relaxed">{formError}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form Inputs (Left 7 Cols) */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Title */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="title" className="text-xs font-bold text-slate-700">
                        Service Title <span className="text-red-500">*</span>
                      </Label>
                      <span className="font-mono text-[10px] text-sky-600">
                        Tip: Last word renders in cyan blue
                      </span>
                    </div>
                    <Input
                      id="title"
                      value={title}
                      maxLength={120}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Underground Utility Construction"
                      required
                      className="h-10 text-xs"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="desc" className="text-xs font-bold text-slate-700">
                        Description <span className="text-red-500">*</span>
                      </Label>
                      <span className="font-mono text-[10px] text-slate-400">
                        {description.length} / 600
                      </span>
                    </div>
                    <Textarea
                      id="desc"
                      rows={3}
                      value={description}
                      maxLength={600}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the scope, precision, quality, and standards of this service..."
                      required
                      className="text-xs resize-none"
                    />
                  </div>

                  {/* Optional Icon Selector Grid (No Asterisk) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-slate-700">
                        Service Icon
                      </Label>
                      <span className="font-mono text-[10px] text-slate-400">
                        Optional. Leave empty to hide the icon on the website.
                      </span>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {SERVICE_ICON_OPTIONS.map((opt) => {
                        const IconComponent = opt.icon;
                        const isSelected = iconKey === opt.key || (!iconKey && opt.key === "none");
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => handleIconSelect(opt.key)}
                            className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                              isSelected
                                ? "border-[#0284c7] bg-sky-50 text-[#0284c7] ring-2 ring-[#0284c7]/30"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <IconComponent className="size-5 mb-1" />
                            <span className="text-[10px] font-medium leading-tight line-clamp-1">
                              {opt.key === "none" ? "No icon" : opt.key}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Key Features (Dynamic List) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-slate-700">
                        Key Features / Bullets (Max 8)
                      </Label>
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        disabled={features.length >= 8}
                        className="text-xs font-bold text-[#0284c7] hover:underline disabled:opacity-40"
                      >
                        + Add Feature
                      </button>
                    </div>

                    <div className="space-y-2">
                      {features.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="font-mono text-xs text-slate-400 w-4">
                            {idx + 1}.
                          </span>
                          <Input
                            value={item}
                            maxLength={80}
                            onChange={(e) => handleFeatureChange(idx, e.target.value)}
                            placeholder={`e.g. Sewerage & Storm-Water Networks`}
                            className="h-9 text-xs"
                          />
                          {features.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveFeature(idx)}
                              className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50"
                            >
                              <X className="size-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button Label ONLY (No CTA Button Link input) */}
                  <div className="space-y-1.5">
                    <Label htmlFor="btnLabel" className="text-xs font-bold text-slate-700">
                      CTA Button Label
                    </Label>
                    <Input
                      id="btnLabel"
                      value={buttonLabel}
                      maxLength={40}
                      onChange={(e) => setButtonLabel(e.target.value)}
                      placeholder="Discuss Your Project"
                      className="h-9 text-xs"
                    />
                  </div>

                  {/* Photo Upload with 200 KB Limit & Fallback View */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-slate-700">
                        Service Photo (Max 200 KB)
                      </Label>
                      <span className="font-mono text-[10px] text-amber-600 font-semibold">
                        Max 200 KB (JPEG, PNG, WebP)
                      </span>
                    </div>

                    <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 transition-colors hover:border-[#0284c7]">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                        id="service-image-upload"
                      />

                      {imagePreview && !removeImage ? (
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="size-14 overflow-hidden rounded-lg border border-slate-200 bg-white">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="size-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800">
                                {imageFile ? imageFile.name : "Custom Image Attached"}
                              </p>
                              <p className="font-mono text-[10px] text-emerald-600 font-semibold">
                                {imageFile ? `${(imageFile.size / 1024).toFixed(1)} KB` : "Active Custom Image"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                              className="h-8 text-xs"
                            >
                              Replace
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleRemoveImage}
                              className="h-8 text-xs text-red-600 hover:bg-red-50 border-red-200"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="size-14 overflow-hidden rounded-lg border border-slate-200 bg-white">
                              <img
                                src={currentFallbackPhoto}
                                alt="Default"
                                className="size-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-700">
                                Default Website Photo (Fallback)
                              </p>
                              <p className="text-[10px] text-slate-400">
                                Upload a custom image to replace this default.
                              </p>
                            </div>
                          </div>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            className="h-8 text-xs gap-1.5 border-slate-300"
                          >
                            <Upload className="size-3.5" />
                            Upload Photo
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Active Visibility Toggle */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                    <div>
                      <Label htmlFor="active-toggle" className="text-xs font-bold text-slate-800">
                        Visible on Public Website
                      </Label>
                      <p className="text-[11px] text-slate-500">
                        When enabled, this service is active and rendered on the /service page.
                      </p>
                    </div>
                    <Switch
                      id="active-toggle"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                    />
                  </div>
                </div>

                {/* Live Preview Panel (Right 5 Cols) */}
                <div className="lg:col-span-5 flex flex-col">
                  <div className="sticky top-0 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Live Preview (Desktop Card)
                      </span>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                        Real-time
                      </span>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-[#F5FAFF] p-4 shadow-inner overflow-hidden">
                      <style>{`
                        .slant-photo-left { clip-path: polygon(0 0, 100% 0, calc(100% - 35px) 100%, 0 100%); }
                        .slant-card-right { clip-path: polygon(35px 0, 100% 0, 100% 100%, 0 100%); }
                        .slant-card-left { clip-path: polygon(0 0, 100% 0, calc(100% - 35px) 100%, 0 100%); }
                        .slant-photo-right { clip-path: polygon(35px 0, 100% 0, 100% 100%, 0 100%); }
                      `}</style>
                      <div className="scale-[0.85] origin-top-left w-[117%] pointer-events-none">
                        <ServiceCard service={previewServiceObj} index={previewIndex} />
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 italic text-center">
                      * Position #{previewIndex + 1}: renders with photo on the{" "}
                      <strong>{previewIndex % 2 === 0 ? "left" : "right"}</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="h-10 rounded-xl border-slate-200 text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="h-10 gap-2 rounded-xl bg-[#f97316] px-6 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#ea580c] disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-4" />
                      {editingId ? "Update Service" : "Publish Service"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
