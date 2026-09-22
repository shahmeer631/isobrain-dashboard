"use client";

import React, { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, Loader2, ListOrdered, FileText } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Container from "@/components/ui/container";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { DashboardModal } from "@/components/dashboard/DashboardModal";
import { DeleteConfirmationModal } from "@/components/dashboard/(admin)/bundles/DeleteConfirmationModal";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  ICategory,
} from "@/lib/redux/features/category/categoryApi";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";

// Schema validation for Category form
const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  courseDesc: z.string().min(1, "Course Description is required"),
  standardDesc: z.string().min(1, "Standard Description is required"),
  standardSub: z.string().min(1, "Standard Subtitle is required"),
  order: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "Order must be a number" }).min(0, "Order must be positive")
  ),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All Categories");

  // Fetch API
  const { data: categoriesResponse, isLoading, isError } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<ICategory | null>(null);

  // Form initialization
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      courseDesc: "",
      standardDesc: "",
      standardSub: "",
      order: 1,
    },
  });

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingCategory(null);
    form.reset({
      name: "",
      description: "",
      courseDesc: "",
      standardDesc: "",
      standardSub: "",
      order: (categoriesResponse?.data?.length || 0) + 1,
    });
    setIsFormModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (category: ICategory) => {
    setEditingCategory(category);
    form.reset({
      name: category?.name || "",
      description: category?.description || "",
      courseDesc: category?.courseDesc || "",
      standardDesc: category?.standardDesc || "",
      standardSub: category?.standardSub || "",
      order: category?.order ?? 1,
    });
    setIsFormModalOpen(true);
  };

  // Submit Form
  const onSubmit = async (values: CategoryFormValues) => {
    try {
      if (editingCategory) {
        const res = await updateCategory({
          id: editingCategory.id,
          body: values,
        }).unwrap();
        if (res?.success) {
          toast.success(res?.message || "Category updated successfully");
          setIsFormModalOpen(false);
        }
      } else {
        const res = await createCategory(values).unwrap();
        if (res?.success) {
          toast.success(res?.message || "Category created successfully");
          setIsFormModalOpen(false);
        }
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    }
  };

  // Delete Action
  const handleOpenDelete = (category: ICategory) => {
    setCategoryToDelete(category);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    try {
      const res = await deleteCategory(categoryToDelete.id).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Category deleted successfully");
        setIsDeleteOpen(false);
        setCategoryToDelete(null);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to delete category");
    }
  };

  // Client-side search and filtering
  const categoriesList = useMemo(() => {
    return categoriesResponse?.data || [];
  }, [categoriesResponse]);

  const filteredCategories = useMemo(() => {
    if (!categoriesList) return [];
    return categoriesList.filter((category) => {
      const search = searchQuery.toLowerCase();
      const matchesSearch =
        category?.name?.toLowerCase()?.includes(search) ||
        category?.slug?.toLowerCase()?.includes(search) ||
        category?.standardSub?.toLowerCase()?.includes(search) ||
        category?.id?.toLowerCase()?.includes(search);

      return matchesSearch;
    });
  }, [categoriesList, searchQuery]);

  return (
    <Container>
      {/* Page Header */}
      <PageHeader
        title="Category Management"
        subtitle="Manage and organize course categories & standards"
        actions={
          <Button variant="primary" className="h-11" onClick={handleOpenCreate}>
            <Plus className="w-5 h-5 mr-2" />
            Create Category
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <FilterBar
        activeFilter={activeTab}
        filters={["All Categories"]}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setActiveFilter={setActiveTab}
        placeholder="Search categories by name, slug, standard subtitle..."
      />

      {/* Categories Grid/List */}
      {isLoading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden p-6 space-y-4">
          <div className="flex gap-4 border-b pb-4">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-32 hidden md:block" />
            <Skeleton className="h-5 w-48 hidden lg:block" />
            <Skeleton className="h-5 w-24 hidden sm:block" />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b last:border-b-0 justify-between">
              <div className="flex items-center gap-4 flex-1">
                <Skeleton className="h-5 w-10" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-5 w-36 hidden md:block" />
                <Skeleton className="h-5 w-48 hidden lg:block" />
                <Skeleton className="h-5 w-28 hidden sm:block" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <Skeleton className="h-9 w-9 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 font-medium text-lg">Failed to load categories.</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-separate border-spacing-0 min-w-[600px] sm:min-w-0">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="p-5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400 w-[80px]">
                    Order
                  </th>
                  <th className="p-5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Name
                  </th>
                  <th className="p-5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400 hidden md:table-cell">
                    Slug
                  </th>
                  <th className="p-5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400 hidden lg:table-cell">
                    Standard Subtitle
                  </th>
                  <th className="p-5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400 hidden sm:table-cell">
                    Dates
                  </th>
                  <th className="p-5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400 text-right w-[120px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr
                    key={category?.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-5 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                        <ListOrdered className="w-3.5 h-3.5 text-slate-400" />
                        {category?.order ?? "-"}
                      </div>
                    </td>
                    <td className="p-5 border-b border-slate-100 dark:border-slate-800">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {category?.name || "N/A"}
                      </div>
                      <div className="text-[11px] text-slate-400 md:hidden mt-0.5 font-mono">
                        {category?.slug || "N/A"}
                      </div>
                    </td>
                    <td className="p-5 border-b border-slate-100 dark:border-slate-800 text-sm text-slate-500 font-mono hidden md:table-cell">
                      {category?.slug || "N/A"}
                    </td>
                    <td className="p-5 border-b border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 max-w-[250px] truncate hidden lg:table-cell">
                      {category?.standardSub || "N/A"}
                    </td>
                    <td className="p-5 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-400 space-y-1 hidden sm:table-cell">
                      <div>Created: {category?.createdAt ? new Date(category.createdAt).toLocaleDateString() : "N/A"}</div>
                      <div>Updated: {category?.updatedAt ? new Date(category.updatedAt).toLocaleDateString() : "N/A"}</div>
                    </td>
                    <td className="p-5 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 bg-white dark:bg-slate-800 shadow-xs border border-slate-100 dark:border-slate-700 hover:bg-slate-50 rounded-xl"
                          onClick={() => handleOpenEdit(category)}
                        >
                          <Edit2 className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 bg-white dark:bg-slate-800 shadow-xs border border-slate-100 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600 rounded-xl"
                          onClick={() => handleOpenDelete(category)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-24 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <FileText className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No categories found</h3>
          <p className="text-slate-500 max-w-xs mx-auto">
            Try adjusting your search query or create a new category to get started.
          </p>
        </div>
      )}

      {/* Form Dialog Modal */}
      <DashboardModal
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        title={editingCategory ? "Edit Category" : "Create Category"}
        maxWidth="sm:max-w-[650px]"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Category Name <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Food Safety Management"
                        className="h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-[14px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Standard Subtitle */}
              <FormField
                control={form.control}
                name="standardSub"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Standard Subtitle <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Ensuring Safety from Farm to Fork"
                        className="h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-[14px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sort Order */}
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Display Order <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 5"
                        className="h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-[14px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* General Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    General Description (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional brief description of the category..."
                      className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-[14px] min-h-[80px] resize-y"
                      value={field.value || ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Course Description */}
            <FormField
              control={form.control}
              name="courseDesc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Course Page Description <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description shown on courses matching this category..."
                      className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-[14px] min-h-[100px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Standard Page Description */}
            <FormField
              control={form.control}
              name="standardDesc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Standards Page Description <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description shown on standards page matching this category..."
                      className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-[14px] min-h-[100px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:flex-1 h-12 rounded-xl text-slate-600 font-bold border-slate-200 dark:border-slate-800"
                onClick={() => setIsFormModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:flex-1 h-12"
                variant="primary"
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editingCategory ? (
                  "Save Changes"
                ) : (
                  "Create Category"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DashboardModal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Category"
        description={`Are you sure you want to delete the category "${categoryToDelete?.name}"? All associated content mapping might be disrupted.`}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </Container>
  );
}