"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Award, Calendar, Copy, Loader2, Share2 } from "lucide-react";
import { toast } from "sonner";

type PublicCertificate = {
  id: string;
  issuedAt?: string;
  studentName?: string;
  isMastery?: boolean;
  industry?: string;
  managementLevel?: string;
  jobFunction?: string;
  course?: { title?: string; instructor?: string };
  template?: { name?: string };
  shareUrl?: string;
};

export default function PublicCertificatePage() {
  const params = useParams();
  const id = String(params?.id || "");
  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState<PublicCertificate | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const apiBase =
          process.env.NEXT_PUBLIC_API_URL?.trim() ||
          "https://api.isobrain.ai/api/v1";
        const res = await fetch(`${apiBase}/certificates/${id}`);
        const json = await res.json();
        if (!res.ok || !json?.data) {
          throw new Error(json?.message || "Certificate not found");
        }
        if (!cancelled) setCertificate(json.data);
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || "Certificate not found");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : certificate?.shareUrl || "";

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "ISO Competency Certificate",
          text: `${certificate?.studentName || "A learner"} earned an ISOBrain Competency certificate.`,
          url: shareUrl,
        });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied");
    } catch {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Share link copied");
      } catch {
        toast.error("Could not share certificate");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--ib-bg)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--ib-acc)]" />
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--ib-bg)] p-6">
        <div className="max-w-md rounded-3xl border border-[var(--ib-line)] bg-[var(--ib-card)] p-8 text-center shadow-xl">
          <Award className="mx-auto mb-4 h-10 w-10 text-[var(--ib-mute)]" />
          <h1 className="text-xl font-black text-[var(--ib-ink)]">
            Certificate unavailable
          </h1>
          <p className="mt-2 text-sm text-[var(--ib-mute)]">
            {error || "This certificate could not be found."}
          </p>
        </div>
      </div>
    );
  }

  const issued = certificate.issuedAt
    ? new Date(certificate.issuedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="min-h-screen bg-[var(--ib-bg)] px-4 py-10 md:px-8">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-[var(--ib-line)] bg-[var(--ib-card)] shadow-2xl">
        <div className="bg-[linear-gradient(160deg,#0B1B4A_0%,#1B4DDB_55%,#C9A227_140%)] px-8 py-12 text-center text-white">
          <Award className="mx-auto mb-4 h-14 w-14 text-amber-300" />
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-80">
            {certificate.isMastery
              ? "CPD Certificate of Competency"
              : "Certificate of Completion"}
          </p>
          <h1 className="mt-3 text-3xl font-black">
            {certificate.studentName || "ISOBrain Learner"}
          </h1>
          <p className="mt-4 text-sm font-medium opacity-90">
            {certificate.isMastery
              ? "has demonstrated competency in ISO Mastery Lab"
              : `has completed ${certificate.course?.title || "a course"}`}
          </p>
        </div>

        <div className="space-y-6 p-8">
          <div className="space-y-2">
            <h2 className="text-lg font-black text-[var(--ib-ink)]">
              {certificate.course?.title || "ISO Mastery Lab – Certificate of Competency"}
            </h2>
            <p className="text-sm text-[var(--ib-mute)]">
              Instructor: {certificate.course?.instructor || "ISOBrain Mastery Lab"}
            </p>
          </div>

          {(certificate.industry ||
            certificate.managementLevel ||
            certificate.jobFunction) && (
            <div className="rounded-2xl border border-[var(--ib-line)] bg-[var(--ib-bg)] p-4 text-sm text-[var(--ib-ink)]">
              <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-[var(--ib-mute)]">
                RACI competency profile
              </p>
              <p>
                {[
                  certificate.industry,
                  certificate.managementLevel,
                  certificate.jobFunction,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-4 text-xs text-[var(--ib-mute)]">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Issued {issued}
            </span>
            <span className="inline-flex items-center gap-2 font-mono">
              ID: {certificate.id}
            </span>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-[var(--ib-line)] pt-6">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--ib-acc)] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(shareUrl);
                toast.success("Link copied");
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--ib-line)] bg-[var(--ib-bg)] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--ib-ink)]"
            >
              <Copy className="h-4 w-4" />
              Copy link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
