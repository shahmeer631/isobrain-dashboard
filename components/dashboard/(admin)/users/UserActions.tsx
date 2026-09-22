"use client";

import React from "react";
import { DashboardModal } from "@/components/dashboard/DashboardModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useGetCoursesQuery } from "@/lib/redux/features/course/courseApi";
import { useGetGroupsQuery } from "@/lib/redux/features/groups/groupApi";

// --- Message Users Modal ---
export function MessageUsersModal({
  open,
  onOpenChange,
  count,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
}) {
  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title="Message Users"
    >
      <div className="space-y-6">
        <p className="text-sm font-medium text-slate-500">
          This message will be sent to{" "}
          <span className="text-slate-900 font-bold">{count}</span> selected
          users.
        </p>
        <div className="space-y-2">
          <Label>Subject</Label>
          <Input
            placeholder="Enter message subject"
            className="rounded-xl h-11"
          />
        </div>
        <div className="space-y-2">
          <Label>Message Body</Label>
          <Textarea
            placeholder="Type your message here..."
            className="rounded-xl min-h-[150px] resize-none"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1 rounded-xl h-11 font-bold"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button className="flex-1 bg-slate-900 text-white hover:bg-slate-800 rounded-xl h-11 font-bold">
            Send Message
          </Button>
        </div>
      </div>
    </DashboardModal>
  );
}

// --- Add to Group Modal ---
export function AddGroupModal({
  open,
  onOpenChange,
  count,
  onConfirm,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
  onConfirm: (groupId: string) => void;
  isLoading?: boolean;
}) {
  const { data: groupsData, isLoading: groupsLoading } = useGetGroupsQuery();
  const [selectedGroup, setSelectedGroup] = React.useState<string>("");

  const handleConfirm = () => {
    if (selectedGroup) {
      onConfirm(selectedGroup);
    }
  };

  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add to Group"
    >
      <div className="space-y-6">
        <p className="text-sm font-medium text-slate-500">
          This group assignment will be applied to{" "}
          <span className="text-slate-900 font-bold">{count}</span> selected
          {count === 1 ? ' user' : ' users'}.
        </p>
        <div className="space-y-2">
          <Label>Select Group</Label>
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="rounded-xl h-11">
              <SelectValue placeholder={groupsLoading ? "Loading groups..." : "Select a group"} />
            </SelectTrigger>
            <SelectContent>
              {groupsData?.data?.data?.map((group: { id: string; name: string }) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1 rounded-xl h-11 font-bold"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-slate-900 text-white hover:bg-slate-800 rounded-xl h-11 font-bold"
            onClick={handleConfirm}
            disabled={!selectedGroup || isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {isLoading ? "Adding..." : "Add to Group"}
          </Button>
        </div>
      </div>
    </DashboardModal>
  );
}

// --- Enroll Course Modal ---
export function EnrollCourseModal({
  open,
  onOpenChange,
  count,
  onConfirm,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
  onConfirm: (courseId: string) => void;
  isLoading?: boolean;
}) {
  const { data: coursesData, isLoading: coursesLoading } = useGetCoursesQuery();
  const [selectedCourse, setSelectedCourse] = React.useState<string>("");

  const handleConfirm = () => {
    if (selectedCourse) {
      onConfirm(selectedCourse);
    }
  };
  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title="Enroll in Course"
    >
      <div className="space-y-6">
        <p className="text-sm font-medium text-slate-500">
          This enrollment will be applied to{" "}
          <span className="text-slate-900 font-bold">{count}</span> selected
          {count === 1 ? ' user' : ' users'}.
        </p>
        <div className="space-y-2">
          <Label>Select Course</Label>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="rounded-xl h-11">
              <SelectValue placeholder={coursesLoading ? "Loading courses..." : "Select a course"} />
            </SelectTrigger>
            <SelectContent>
              {coursesData?.data?.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1 rounded-xl h-11 font-bold"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-slate-900 text-white hover:bg-slate-800 rounded-xl h-11 font-bold"
            onClick={handleConfirm}
            disabled={!selectedCourse || isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {isLoading ? "Enrolling..." : "Enroll Now"}
          </Button>
        </div>
      </div>
    </DashboardModal>
  );
}

// --- Unenroll Course Modal ---
export function UnenrollCourseModal({
  open,
  onOpenChange,
  count,
  onConfirm,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
  onConfirm: (courseId: string) => void;
  isLoading?: boolean;
}) {
  const { data: coursesData, isLoading: coursesLoading } = useGetCoursesQuery();
  const [selectedCourse, setSelectedCourse] = React.useState<string>("");

  const handleConfirm = () => {
    if (selectedCourse) {
      onConfirm(selectedCourse);
    }
  };

  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title="Unenroll from Course"
    >
      <div className="space-y-6">
        <p className="text-sm font-medium text-slate-500">
          This unenrollment will be applied to{" "}
          <span className="text-slate-900 font-bold">{count}</span> selected
          {count === 1 ? ' user' : ' users'}.
        </p>
        <div className="space-y-2">
          <Label>Select Course</Label>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="rounded-xl h-11">
              <SelectValue placeholder={coursesLoading ? "Loading courses..." : "Select a course"} />
            </SelectTrigger>
            <SelectContent>
              {coursesData?.data?.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1 rounded-xl h-11 font-bold"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-rose-600 text-white hover:bg-rose-700 rounded-xl h-11 font-bold shadow-lg shadow-rose-500/20"
            onClick={handleConfirm}
            disabled={!selectedCourse || isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {isLoading ? "Unenrolling..." : "Unenroll Now"}
          </Button>
        </div>
      </div>
    </DashboardModal>
  );
}

// --- Delete Confirmation Modal ---
export function DeleteConfirmModal({
  open,
  onOpenChange,
  count,
  onConfirm,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
  onConfirm?: () => void;
  isLoading?: boolean;
}) {
  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title={count === 1 ? "Delete User" : "Delete Users"}
    >
      <div className="flex flex-col items-center text-center gap-6">
        <div className="h-16 w-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900">
            Are you absolutely sure?
          </h3>
          <p className="text-slate-500 text-sm">
            You are about to delete{" "}
            <span className="text-slate-900 font-bold">{count}</span> {count === 1 ? 'user' : 'users'}.
            This action cannot be undone and will remove all their course
            progress and history.
          </p>
        </div>
        <div className="flex w-full gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1 rounded-xl h-11 font-bold"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-rose-600 text-white hover:bg-rose-700 rounded-xl h-11 font-bold shadow-lg shadow-rose-500/20"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : count === 1 ? "Delete User" : "Delete Users"}
          </Button>
        </div>
      </div>
    </DashboardModal>
  );
}
