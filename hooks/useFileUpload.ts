import { useUploadFileMutation } from "@/lib/redux/features/upload/uploadApi";
import { toast } from "sonner";

export const useFileUpload = () => {
  const [uploadFileMutation, { isLoading }] = useUploadFileMutation();

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file); // Some backends expect 'file', others 'image'. Based on user's error trace snippet, the multer middleware expects 'file' or it fails because it's the wrong field name or unsupported file type.

    try {
      const uploadResponse = await uploadFileMutation(formData).unwrap();

      if (uploadResponse.success && uploadResponse?.data?.url) {
        return uploadResponse.data.url;
      } else {
        toast.error(uploadResponse.message || "File upload failed.");
        return null;
      }
    } catch (err: unknown) {
      // The backend returns an error object as seen in user's prompt
      const error = err as {
        data?: { message?: string; err?: { storageErrors?: unknown[] } };
      };
      console.error("File upload failed:", error);
      toast.error(
        error?.data?.message || "Unsupported file type or upload failed.",
      );
      return null;
    }
  };

  return { uploadFile, isUploading: isLoading };
};
