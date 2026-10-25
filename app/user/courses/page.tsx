import { Suspense } from "react";
import CoursesPageClient from "./CoursesPageClient";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyCoursesPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 pb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
          <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 rounded-[14px]" />
            ))}
          </div>
        </div>
      }
    >
      <CoursesPageClient />
    </Suspense>
  );
}
