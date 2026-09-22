"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { ReviewStats } from "@/components/dashboard/(admin)/reviews/ReviewStats";
import { RatingDistribution } from "@/components/dashboard/(admin)/reviews/RatingDistribution";
import {
  ReviewCard,
  ReviewData,
} from "@/components/dashboard/(admin)/reviews/ReviewCard";
import { ReviewSettings } from "@/components/dashboard/(admin)/reviews/ReviewSettings";
import Container from "@/components/ui/container";

const MOCK_REVIEWS: ReviewData[] = [
  {
    id: "1",
    userName: "Alice Williams",
    courseName: "ISO 9001:2015 Complete Guide",
    rating: 5,
    date: "2024-02-20",
    status: "Approved",
    comment:
      "Excellent course! The content is very clear and well-structured. The instructor explains complex concepts in an easy-to-understand manner.",
  },
  {
    id: "2",
    userName: "Alice Williams",
    courseName: "ISO 9001:2015 Complete Guide",
    rating: 5,
    date: "2024-02-20",
    status: "Approved",
    comment:
      "Excellent course! The content is very clear and well-structured. The instructor explains complex concepts in an easy-to-understand manner.",
  },
  {
    id: "3",
    userName: "Alice Williams",
    courseName: "ISO 9001:2015 Complete Guide",
    rating: 5,
    date: "2024-02-20",
    status: "Approved",
    comment:
      "Excellent course! The content is very clear and well-structured. The instructor explains complex concepts in an easy-to-understand manner.",
  },
  {
    id: "4",
    userName: "David Kim",
    courseName: "ISO 9001:2015 Complete Guide",
    rating: 5,
    date: "2024-02-17",
    status: "Pending",
    comment:
      "Amazing quality! Very informative and comprehensive. Highly recommend to anyone wanting to learn about quality management.",
  },
  {
    id: "5",
    userName: "Alice Williams",
    courseName: "ISO 9001:2015 Complete Guide",
    rating: 5,
    date: "2024-02-20",
    status: "Approved",
    comment:
      "Excellent course! The content is very clear and well-structured. The instructor explains complex concepts in an easy-to-understand manner.",
  },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewData[]>(MOCK_REVIEWS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Reviews");

  const filters = ["All Reviews", "Approved", "Pending"];

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.courseName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === "All Reviews" || review.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  const handleApprove = (id: string) => {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, status: "Approved" } : r)),
    );
  };

  const handleDelete = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
  };

  return (
    <Container>
      <PageHeader
        title="Course Reviews"
        subtitle="Manage and moderate student course reviews"
      />

      <ReviewStats />

      <RatingDistribution />

      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        filters={filters}
        placeholder="Search reviews by student or course..."
      />

      <div className="flex flex-col gap-4">
        {filteredReviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onApprove={handleApprove}
            onDelete={handleDelete}
            onView={(id) => console.log("View review:", id)}
          />
        ))}

        {filteredReviews.length === 0 && (
          <div className="py-20 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
            <p className="text-slate-500 font-medium">
              No reviews found matching your search.
            </p>
          </div>
        )}
      </div>

      <ReviewSettings />
    </Container>
  );
}
