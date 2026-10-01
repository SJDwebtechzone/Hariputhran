import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Edit3,
  MapPin,
  Upload,
  RefreshCcw,
  AlertCircle,
  CheckCircle2,
  X,
  Image as ImageIcon,
  Loader2,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RecentWorkItem } from "@/types/recentWork";
import {
  fetchAdminRecentWorks,
  updateAdminRecentWork,
} from "@/admin-recent-works/api";
import {
  getRecentWorkImageSrc,
  handleRecentWorkImageError,
  DEFAULT_RECENT_WORK_IMAGES,
} from "@/utils/recentWorkImage";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

export function AdminRecentWorksView() {
  const [items, setItems] = useState<RecentWorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit Drawer / Modal state
  const [editingItem, setEditingItem] = useState<RecentWorkItem | null>(null);
  const [recentlySavedId, setRecentlySavedId] = useState<number | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminRecentWorks();
      setItems(data);
    } catch (err: any) {
      console.error("Failed to load admin recent works:", err);
      setError(err.message || "Failed to load recent works. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleSessionExpired = () => {
      toast.error("Session expired, please sign in again");
    };

    window.addEventListener("hariputhran_session_expired", handleSessionExpired);
    return () => {
      window.removeEventListener("hariputhran_session_expired", handleSessionExpired);
    };
  }, []);

  const openEditModal = (item: RecentWorkItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormLocation(item.location);
    setSelectedFile(null);
    setPreviewUrl(null);
    setRemoveImage(false);
    setFormError(null);
  };

  const closeEditModal = () => {
    if (saving) return;
    setEditingItem(null);
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setRemoveImage(false);
    setFormError(null);
  };

  const handleFileSelection = (file: File) => {
    setFormError(null);

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setFormError("Only JPG, PNG, and WebP images are allowed.");
      return;
    }

    // Validate size (200 KB)
    const sizeInKb = (file.size / 1024).toFixed(1);
    if (file.size > 200 * 1024) {
      setFormError(`Image is ${sizeInKb} KB. Maximum allowed is 200 KB. Please compress it and try again.`);
      return;
    }

    setSelectedFile(file);
    setRemoveImage(false);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleResetToDefaultPhoto = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setRemoveImage(true);
    setFormError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!formTitle.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (formTitle.trim().length > 120) {
      setFormError("Title must not exceed 120 characters.");
      return;
    }
    if (!formLocation.trim()) {
      setFormError("Location is required.");
      return;
    }
    if (formLocation.trim().length > 120) {
      setFormError("Location must not exceed 120 characters.");
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      const updated = await updateAdminRecentWork(editingItem.id, {
        title: formTitle.trim(),
        location: formLocation.trim(),
        image: selectedFile,
        removeImage: removeImage,
      });

      // Update state in place or refetch
      setItems((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );

      setRecentlySavedId(updated.id);
      setTimeout(() => setRecentlySavedId(null), 3000);

      toast.success(`Card 0${updated.position} updated successfully!`);
      closeEditModal();
    } catch (err: any) {
      console.error("Save failed:", err);
      setFormError(err.message || "Failed to update project card.");
    } finally {
      setSaving(false);
    }
  };

  // Determine current image for preview in modal
  const getCurrentModalImageSrc = () => {
    if (!editingItem) return "/images/recents/sewer.jpg";
    if (previewUrl) return previewUrl;
    if (removeImage) {
      return DEFAULT_RECENT_WORK_IMAGES[editingItem.position] || "/images/recents/sewer.jpg";
    }
    return getRecentWorkImageSrc(editingItem);
  };

  return (
    <AdminLayout activeNav="projects">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#0284c7]">
              <span className="h-0.5 w-6 bg-[#f97316]" />
              HOME SECTION MANAGER
            </div>
            <h1 className="mt-1 font-['Poppins',sans-serif] text-2xl font-bold tracking-tight text-[#082342] sm:text-3xl">
              Recent Works
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-2xl">
              Update the 4 project cards shown on the Home page. Heading and layout are fixed.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={loading}
              className="border-slate-200 bg-white font-mono text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RefreshCcw className={`mr-1.5 size-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-[#082342] font-mono text-xs font-semibold text-white hover:bg-[#0284c7]"
            >
              <Link to="/" hash="projects" target="_blank">
                View on Home Page <ExternalLink className="ml-1.5 size-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-6 flex items-center justify-between rounded-xl border border-sky-100 bg-sky-50/60 p-4 text-xs text-sky-950">
          <div className="flex items-center gap-2.5">
            <Sparkles className="size-4 shrink-0 text-[#0284c7]" />
            <span>
              <strong>Fixed 4-Card Layout:</strong> Exactly 4 cards are rendered on the Home page. You can customize the title, location, and upload a custom photo for each card (max 200 KB).
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-8">
          {/* Skeleton State */}
          {loading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"
                >
                  <div className="aspect-[4/3] w-full rounded-xl bg-slate-200" />
                  <div className="mt-4 h-4 w-3/4 rounded bg-slate-200" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-slate-200" />
                  <div className="mt-5 h-9 w-full rounded-lg bg-slate-200" />
                </div>
              ))}
            </div>
          )}

          {/* Error State with Retry Button */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50/80 p-8 text-center text-red-900 shadow-sm">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertCircle className="size-6" />
              </div>
              <h3 className="mt-4 font-semibold text-base">Failed to Load Recent Works</h3>
              <p className="mt-1 text-xs text-red-700 max-w-md mx-auto">{error}</p>
              <Button
                onClick={loadData}
                className="mt-5 bg-red-600 font-mono text-xs font-semibold text-white hover:bg-red-700"
              >
                <RefreshCcw className="mr-1.5 size-3.5" /> Retry
              </Button>
            </div>
          )}

          {/* 4 Cards Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((item) => {
                const isJustSaved = recentlySavedId === item.id;
                const cardImgSrc = getRecentWorkImageSrc(item);

                return (
                  <div
                    key={item.id}
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:shadow-md ${
                      isJustSaved
                        ? "border-emerald-500 ring-2 ring-emerald-400"
                        : "border-slate-200/90 hover:border-sky-300"
                    }`}
                  >
                    {/* Position Badge */}
                    <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-black/10 bg-black/60 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                      CARD 0{item.position}
                    </div>

                    {/* Image Source Badge */}
                    <div className="absolute right-3 top-3 z-10">
                      {item.hasImage ? (
                        <span className="rounded-full border border-sky-400/30 bg-[#0284c7]/90 px-2 py-0.5 font-mono text-[9.5px] font-bold text-white shadow-sm backdrop-blur-sm">
                          Custom Photo
                        </span>
                      ) : (
                        <span className="rounded-full border border-slate-300/40 bg-slate-800/80 px-2 py-0.5 font-mono text-[9.5px] font-medium text-slate-200 backdrop-blur-sm">
                          Default Photo
                        </span>
                      )}
                    </div>

                    {/* Card Image */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                      <img
                        src={cardImgSrc}
                        alt={item.title}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => handleRecentWorkImageError(e, item.position)}
                      />
                    </div>

                    {/* Card Info */}
                    <div className="flex flex-1 flex-col justify-between p-4">
                      <div>
                        <h3 className="font-['Poppins',sans-serif] text-sm font-bold text-[#082342] leading-snug">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-600">
                          <MapPin className="size-3.5 text-[#0284c7] shrink-0" />
                          <span className="line-clamp-1">{item.location}</span>
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="font-mono text-[10px] text-slate-400">
                          ID #{item.id}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => openEditModal(item)}
                          className="h-8 rounded-lg bg-[#082342] px-3 font-mono text-xs font-semibold text-white transition-colors hover:bg-[#0284c7]"
                        >
                          <Edit3 className="mr-1.5 size-3.5" /> Edit Card
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Edit Modal / Drawer */}
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={closeEditModal}
            />

            {/* Modal Box */}
            <div className="relative z-10 max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div>
                  <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0284c7]">
                    CARD 0{editingItem.position} • HOME PAGE
                  </div>
                  <h2 className="font-['Poppins',sans-serif] text-lg font-bold text-[#082342]">
                    Edit Recent Work Project
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={saving}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSave} className="p-6 space-y-5">
                {/* Form Error Message */}
                {formError && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
                    <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-600" />
                    <div className="leading-relaxed">{formError}</div>
                  </div>
                )}

                {/* Title Input */}
                <div>
                  <label className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-700">
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    maxLength={120}
                    required
                    placeholder="e.g. Sewer Manhole Construction"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-[#0284c7] focus:bg-white focus:ring-2 focus:ring-[#0284c7]/20"
                  />
                  <div className="mt-1 flex justify-end font-mono text-[10px] text-slate-400">
                    {formTitle.length}/120 characters
                  </div>
                </div>

                {/* Location Input */}
                <div>
                  <label className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-700">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1.5">
                    <MapPin className="absolute left-3.5 top-3 size-4 text-slate-400" />
                    <input
                      type="text"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      maxLength={120}
                      required
                      placeholder="e.g. Kaveri Nagar, Chennai"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-[#0284c7] focus:bg-white focus:ring-2 focus:ring-[#0284c7]/20"
                    />
                  </div>
                  <div className="mt-1 flex justify-end font-mono text-[10px] text-slate-400">
                    {formLocation.length}/120 characters
                  </div>
                </div>

                {/* Photo Upload & Preview Section */}
                <div>
                  <label className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-700">
                    Card Photo
                  </label>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    Recommended: 800 x 600 px (4:3), JPG or WebP, under 200 KB
                  </p>

                  {/* Drag & Drop Box */}
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2.5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-6 text-center transition hover:border-[#0284c7] hover:bg-sky-50/30"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="grid size-10 place-items-center rounded-full bg-white shadow-xs text-[#0284c7]">
                      <Upload className="size-5" />
                    </div>
                    <p className="mt-2 text-xs font-semibold text-slate-700">
                      Click to upload or drag & drop photo
                    </p>
                    <p className="mt-0.5 font-mono text-[10.5px] text-slate-400">
                      JPG, PNG, or WebP (max 200 KB)
                    </p>
                  </div>

                  {/* Selected File Details & Actions */}
                  {selectedFile && (
                    <div className="mt-3 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs text-emerald-900">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                        <span className="font-medium truncate max-w-[260px]">
                          {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          if (previewUrl) {
                            URL.revokeObjectURL(previewUrl);
                            setPreviewUrl(null);
                          }
                        }}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  )}

                  {/* Option to Reset to Default Photo */}
                  {(editingItem.hasImage || selectedFile) && (
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={handleResetToDefaultPhoto}
                        className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#0284c7] hover:text-[#f97316] transition-colors"
                      >
                        <RefreshCcw className="size-3.5" /> Reset to default photo
                      </button>
                    </div>
                  )}

                  {/* Live Card Preview */}
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Live Home Card Preview
                    </div>
                    <div className="mx-auto max-w-[280px] overflow-hidden rounded-xl border border-slate-100 bg-white shadow-md">
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                        <img
                          src={getCurrentModalImageSrc()}
                          alt={formTitle || "Preview"}
                          className="size-full object-cover"
                          onError={(e) => handleRecentWorkImageError(e, editingItem.position)}
                        />
                      </div>
                      <div className="p-3.5">
                        <h4 className="text-xs sm:text-[13px] font-bold text-[#082342] leading-snug">
                          {formTitle || "Project Title"}
                        </h4>
                        <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-600">
                          <MapPin className="size-3 text-[#0284c7] shrink-0" />
                          <span className="truncate">{formLocation || "Location, City"}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeEditModal}
                    disabled={saving}
                    className="border-slate-200 text-xs font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-[#082342] px-5 font-mono text-xs font-semibold text-white hover:bg-[#0284c7]"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-1.5 size-3.5 animate-spin" /> Saving Changes...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
export default AdminRecentWorksView;
