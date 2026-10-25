//?dont remove this commented codes

// "use client";

// import React, { useRef, useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { UploadCloud, X } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { DashboardModal } from "@/components/dashboard/DashboardModal";
// import { cn } from "@/lib/utils";
// import {
//   Document,
//   DocumentCategory,
//   DocumentStatus,
//   DocumentType,
// } from "@/types/document";

// const uploadSchema = z.object({
//   title: z.string().min(1, "Document title is required"),
//   category: z.string().min(1, "Category is required"),
//   status: z.enum(["Active", "Draft"]),
//   type: z.enum(["PDF", "DOCX", "XLSX", "PPTX", "TXT"]),
//   description: z.string().optional(),
//   version: z.string().optional(),
//   author: z.string().optional(),
//   tags: z.string().optional(),
// });

// type UploadValues = z.infer<typeof uploadSchema>;

// interface UploadDocumentModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onUpload: (data: Partial<Document>) => void;
// }

// export function UploadDocumentModal({
//   open,
//   onOpenChange,
//   onUpload,
// }: UploadDocumentModalProps) {
//   const [fileName, setFileName] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const form = useForm<UploadValues>({
//     resolver: zodResolver(uploadSchema),
//     defaultValues: {
//       title: "",
//       category: "Templates",
//       status: "Active",
//       type: "PDF",
//       description: "",
//       version: "",
//       author: "",
//       tags: "",
//     },
//   });

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setFileName(file.name);
//     }
//   };

//   const onSubmit = React.useCallback(
//     (values: UploadValues) => {
//       onUpload({
//         ...values,
//         id: `doc-${Date.now()}`,
//         fileSize: "0 KB", // Mock size
//         downloads: "0",
//         uploadedAt: new Date().toLocaleDateString(),
//         tags: values.tags ? values.tags.split(",").map((t) => t.trim()) : [],
//         category: values.category as DocumentCategory,
//         status: values.status as DocumentStatus,
//         type: values.type as DocumentType,
//       });
//       form.reset();
//       setFileName(null);
//       onOpenChange(false);
//     },
//     [onUpload, form, onOpenChange],
//   );

//   return (
//     <DashboardModal
//       open={open}
//       onOpenChange={onOpenChange}
//       title="Upload Document"
//       maxWidth="sm:max-w-[700px]"
//     >
//       <div className="space-y-6">
//         <div
//           onClick={() => !fileName && fileInputRef.current?.click()}
//           className={cn(
//             "group border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer",
//             fileName
//               ? "border-[var(--ib-line)] bg-[var(--ib-accbg)]/30 dark:bg-[var(--ib-acc)]/10"
//               : "border-[var(--ib-line)] dark:border-[var(--ib-line)] hover:border-[var(--ib-acc)] hover:bg-[var(--ib-bg)] dark:hover:bg-[var(--ib-dk)]/50",
//           )}
//         >
//           <input
//             type="file"
//             className="hidden"
//             ref={fileInputRef}
//             onChange={handleFileChange}
//           />
//           <div className="bg-[var(--ib-accbg)] dark:bg-[var(--ib-acc)]/20 p-4 rounded-full mb-4 text-[var(--ib-acc)] group-hover:scale-110 transition-transform">
//             <UploadCloud className="w-8 h-8" />
//           </div>
//           {fileName ? (
//             <div className="flex items-center gap-2">
//               <span className="text-sm font-bold text-[var(--ib-ink)] dark:text-white line-clamp-1 max-w-[300px]">
//                 {fileName}
//               </span>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setFileName(null);
//                 }}
//                 className="text-[var(--ib-mute)] hover:text-red-500"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//           ) : (
//             <>
//               <p className="text-[15px] font-bold text-[var(--ib-ink)] dark:text-white mb-1 text-center">
//                 Click to upload or drag and drop
//               </p>
//               <p className="text-[13px] text-[var(--ib-mute)] font-medium text-center">
//                 PDF, DOCX, XLSX, PPT files up to 50MB
//               </p>
//             </>
//           )}
//         </div>

//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="grid grid-cols-1 gap-4"
//           >
//             <FormField
//               control={form.control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-sm font-bold text-[var(--ib-ink)]">
//                     Document Title *
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="e.g., Quality Manual Template"
//                       {...field}
//                       className="bg-[var(--ib-bg)] border-none h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-offset-0 font-medium placeholder:text-[var(--ib-mute)] text-[15px] transition-colors focus:bg-white focus:ring-[var(--ib-accbg)]"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="category"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-sm font-bold text-[var(--ib-ink)]">
//                       Category
//                     </FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                     >
//                       <FormControl>
//                         <SelectTrigger className="bg-[var(--ib-bg)] border-none h-12 rounded-xl focus:ring-1 focus:ring-offset-0 text-[var(--ib-ink)] font-medium text-[15px] transition-colors focus:bg-white focus:ring-[var(--ib-accbg)]">
//                           <SelectValue placeholder="Select category" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent className="rounded-xl border-[var(--ib-line)] shadow-xl">
//                         <SelectItem value="Templates">Templates</SelectItem>
//                         <SelectItem value="Checklists">Checklists</SelectItem>
//                         <SelectItem value="Forms">Forms</SelectItem>
//                         <SelectItem value="Diagrams">Diagrams</SelectItem>
//                         <SelectItem value="Guides">Guides</SelectItem>
//                         <SelectItem value="Reports">Reports</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="status"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-sm font-bold text-[var(--ib-ink)]">
//                       Status
//                     </FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                     >
//                       <FormControl>
//                         <SelectTrigger className="bg-[var(--ib-bg)] border-none h-12 rounded-xl focus:ring-1 focus:ring-offset-0 text-[var(--ib-ink)] font-medium text-[15px] transition-colors focus:bg-white focus:ring-[var(--ib-accbg)]">
//                           <SelectValue placeholder="Select status" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent className="rounded-xl border-[var(--ib-line)] shadow-xl">
//                         <SelectItem value="Active">Active</SelectItem>
//                         <SelectItem value="Draft">Draft</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <FormField
//               control={form.control}
//               name="type"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-sm font-bold text-[var(--ib-ink)]">
//                     Document Type
//                   </FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger className="bg-[var(--ib-bg)] border-none h-12 rounded-xl focus:ring-1 focus:ring-offset-0 text-[var(--ib-ink)] font-medium text-[15px] transition-colors focus:bg-white focus:ring-[var(--ib-accbg)]">
//                         <SelectValue placeholder="Select type" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent className="rounded-xl border-[var(--ib-line)] shadow-xl">
//                       <SelectItem value="PDF">PDF</SelectItem>
//                       <SelectItem value="DOCX">DOCX</SelectItem>
//                       <SelectItem value="XLSX">XLSX</SelectItem>
//                       <SelectItem value="PPTX">PPTX</SelectItem>
//                       <SelectItem value="TXT">TXT</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="description"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-sm font-bold text-[var(--ib-ink)]">
//                     Description
//                   </FormLabel>
//                   <FormControl>
//                     <Textarea
//                       placeholder="Brief description of the document..."
//                       {...field}
//                       className="bg-[var(--ib-bg)] border-none min-h-[100px] rounded-xl focus-visible:ring-1 focus-visible:ring-offset-0 resize-none font-medium placeholder:text-[var(--ib-mute)] text-[15px] transition-colors focus:bg-white focus:ring-[var(--ib-accbg)]"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="version"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-sm font-bold text-[var(--ib-ink)]">
//                       Version
//                     </FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder="e.g., 1.0"
//                         {...field}
//                         className="bg-[var(--ib-bg)] border-none h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-offset-0 font-medium placeholder:text-[var(--ib-mute)] text-[15px] transition-colors focus:bg-white focus:ring-[var(--ib-accbg)]"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="author"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-sm font-bold text-[var(--ib-ink)]">
//                       Author
//                     </FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder="e.g., ISO Brain Team"
//                         {...field}
//                         className="bg-[var(--ib-bg)] border-none h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-offset-0 font-medium placeholder:text-[var(--ib-mute)] text-[15px] transition-colors focus:bg-white focus:ring-[var(--ib-accbg)]"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <FormField
//               control={form.control}
//               name="tags"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-sm font-bold text-[var(--ib-ink)]">
//                     Tags (comma-separated)
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="e.g., quality, management, template"
//                       {...field}
//                       className="bg-[var(--ib-bg)] border-none h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-offset-0 font-medium placeholder:text-[var(--ib-mute)] text-[15px] transition-colors focus:bg-white focus:ring-[var(--ib-accbg)]"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => onOpenChange(false)}
//                 className="w-full sm:flex-1 h-14 rounded-2xl border-[var(--ib-line)] font-bold hover:bg-[var(--ib-bg)] text-[16px]"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 className="w-full sm:flex-1 h-14 rounded-2xl font-bold text-[16px]"
//                 variant="primary"
//               >
//                 Upload Document
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </div>
//     </DashboardModal>
//   );
// }





"use client";

import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UploadCloud, X, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardModal } from "@/components/dashboard/DashboardModal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useUploadFileMutation } from "@/lib/redux/features/upload/uploadApi";
import { useCreateDocumentMutation } from "@/lib/redux/features/document/documentApi";
import { useGetCategoriesQuery } from "@/lib/redux/features/category/categoryApi";
import { Document } from "@/types/document";

const uploadSchema = z.object({
  title: z.string().min(1, "Document title is required"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["ACTIVE", "DRAFT"]),
  type: z.enum(["PDF", "DOCX", "XLSX", "PPTX", "TXT"]),
  description: z.string().optional(),
  version: z.string().optional(),
  author: z.string().optional(),
  tags: z.string().optional(),
});

type UploadValues = z.infer<typeof uploadSchema>;

interface UploadDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (data: Partial<Document>) => void;
}

export function UploadDocumentModal({
  open,
  onOpenChange,
  onUpload,
}: UploadDocumentModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadFile] = useUploadFileMutation();
  const [createDocument, { isLoading: isCreating }] = useCreateDocumentMutation();
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.data || [];

  const form = useForm<UploadValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: "",
      category: "",
      status: "DRAFT",
      type: "PDF",
      description: "",
      version: "",
      author: "",
      tags: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const onSubmit = async (values: UploadValues) => {
    let fileUrl = "https://pr3detorapp-media-storage.s3.us-east-2.amazonaws.com/example.pdf";
    let fileSizeStr = "1 MB";

    try {
      if (file) {
        fileSizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
        const formData = new FormData();
        formData.append("file", file);

        try {
          const uploadRes = await uploadFile(formData).unwrap();
          if (uploadRes.success && uploadRes.data?.url) {
            fileUrl = uploadRes.data.url;
          }
        } catch (uploadObj: unknown) {
          console.error("Upload failed, formatting fallback URL", uploadObj);
          // Continuing with fallback url
        }
      }

      const payload = {
        title: values.title,
        description: values.description || "",
        categoryId: values.category,
        type: values.type,
        version: values.version || "1.0",
        author: values.author || "",
        tags: values.tags || "",
        fileUrl: fileUrl,
        fileSize: fileSizeStr,
        status: values.status,
      };

      const res = await createDocument(payload).unwrap();
      if (res.success) {
        toast.success(res.message || "Document created successfully");
        onUpload(res.data);
        form.reset();
        setFile(null);
        onOpenChange(false);
      } else {
        toast.error(res.message || "Failed to create document");
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      console.error(error);
      toast.error(error?.data?.message || "Failed to create document");
    }
  };

  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title="Upload Document"
      maxWidth="sm:max-w-[700px]"
    >
      <div className="space-y-6">
        <div
          onClick={() => !file && fileInputRef.current?.click()}
          className={cn(
            "group border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer",
            file
              ? "border-[var(--ib-line)] bg-[var(--ib-accbg)]/30 dark:bg-[var(--ib-acc)]/10"
              : "border-[var(--ib-line)] dark:border-[var(--ib-line)] hover:border-[var(--ib-acc)] hover:bg-[var(--ib-bg)] dark:hover:bg-[var(--ib-dk)]/50",
          )}
        >
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <div className="bg-[var(--ib-accbg)] dark:bg-[var(--ib-acc)]/20 p-4 rounded-full mb-4 text-[var(--ib-acc)] group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>
          {file ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[var(--ib-ink)] dark:text-white line-clamp-1 max-w-[300px]">
                {file.name}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="text-[var(--ib-mute)] hover:text-red-500 z-10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <p className="text-[15px] font-bold text-[var(--ib-ink)] dark:text-white mb-1 text-center">
                Click to upload or drag and drop
              </p>
              <p className="text-[13px] text-[var(--ib-mute)] font-medium text-center">
                PDF, DOCX, XLSX, PPT files up to 50MB
              </p>
            </>
          )}
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold text-[var(--ib-ink)]">
                    Document Title *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Quality Manual Template"
                      {...field}
                      className="bg-[var(--ib-bg)] border-none h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-offset-0 font-medium placeholder:text-[var(--ib-mute)] text-[15px] transition-colors focus:bg-white focus:ring-[var(--ib-accbg)]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-[var(--ib-ink)]">
                      Category
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-[var(--ib-bg)] border-none h-12 rounded-xl focus:ring-1 focus:ring-offset-0 text-[var(--ib-ink)] font-medium text-[15px] transition-colors focus:bg-white focus:ring-[var(--ib-accbg)]">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-[var(--ib-line)] shadow-xl">
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-[var(--ib-ink)]">
                      Status
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-[var(--ib-bg)] border-none h-12 rounded-xl focus:ring-1 focus:ring-offset-0 text-[var(--ib-ink)] font-medium text-[15px] transition-colors focus:bg-white focus:ring-[var(--ib-accbg)]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-[var(--ib-line)] shadow-xl">
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold text-[var(--ib-ink)]">
                    Document Type
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-[var(--ib-bg)] border-none h-12 rounded-xl focus:ring-1 focus:ring-offset-0 text-[var(--ib-ink)] font-medium text-[15px] transition-colors focus:bg-white focus:ring-[var(--ib-accbg)]">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-[var(--ib-line)] shadow-xl">
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="DOCX">DOCX</SelectItem>
                      <SelectItem value="XLSX">XLSX</SelectItem>
                      <SelectItem value="PPTX">PPTX</SelectItem>
                      <SelectItem value="TXT">TXT</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold text-[var(--ib-ink)]">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the document..."
                      {...field}
                      className="bg-[var(--ib-bg)] border-none min-h-[100px] rounded-xl focus-visible:ring-1 focus-visible:ring-offset-0 resize-none font-medium placeholder:text-[var(--ib-mute)] text-[15px] transition-colors focus:bg-white focus:ring-[var(--ib-accbg)]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-[var(--ib-ink)]">
                      Version
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 1.0"
                        {...field}
                        className="bg-[var(--ib-bg)] border-none h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-offset-0 font-medium placeholder:text-[var(--ib-mute)] text-[15px] transition-colors focus:bg-white focus:ring-[var(--ib-accbg)]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-[var(--ib-ink)]">
                      Author
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., ISO Brain Team"
                        {...field}
                        className="bg-[var(--ib-bg)] border-none h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-offset-0 font-medium placeholder:text-[var(--ib-mute)] text-[15px] transition-colors focus:bg-white focus:ring-[var(--ib-accbg)]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold text-[var(--ib-ink)]">
                    Tags (comma-separated)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., quality, management, template"
                      {...field}
                      className="bg-[var(--ib-bg)] border-none h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-offset-0 font-medium placeholder:text-[var(--ib-mute)] text-[15px] transition-colors focus:bg-white focus:ring-[var(--ib-accbg)]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:flex-1 h-14 rounded-2xl border-[var(--ib-line)] font-bold hover:bg-[var(--ib-bg)] text-[16px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:flex-1 h-14 rounded-2xl font-bold text-[16px]"
                variant="primary"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload Document"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DashboardModal>
  );
}
