"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { OnboardingProgress } from "./OnboardingProgress";
import {
  useCompleteOnboardingMutation,
  useGetOnboardingQuery,
  useSaveOnboardingProgressMutation,
} from "@/lib/redux/features/user/onboardingApi";
import { useGetISOStandardsQuery } from "@/lib/redux/features/iso-standards/isoStandardApi";
import { cn } from "@/lib/utils";

type FormState = {
  firstName: string;
  lastName: string;
  industry: string;
  professionalRole: string;
  professionalRoleOther: string;
  targetStandardIds: string[];
};

const emptyForm: FormState = {
  firstName: "",
  lastName: "",
  industry: "",
  professionalRole: "",
  professionalRoleOther: "",
  targetStandardIds: [],
};

export function OnboardingWizard() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useGetOnboardingQuery();
  const [saveProgress, { isLoading: isSaving }] =
    useSaveOnboardingProgressMutation();
  const [completeOnboarding, { isLoading: isCompleting }] =
    useCompleteOnboardingMutation();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [standardSearch, setStandardSearch] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const { data: standardsResponse, isLoading: standardsLoading } =
    useGetISOStandardsQuery({ status: "ACTIVE", limit: 100, page: 1 });

  const industries = data?.data?.options?.industries ?? [];
  const professionalRoles = data?.data?.options?.professionalRoles ?? [];
  const standards = standardsResponse?.data ?? [];

  const filteredStandards = useMemo(() => {
    const q = standardSearch.trim().toLowerCase();
    if (!q) return standards;
    return standards.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.category?.name?.toLowerCase().includes(q),
    );
  }, [standards, standardSearch]);

  useEffect(() => {
    if (!data?.data || hydrated) return;
    const state = data.data;
    if (state.onboardingCompleted === true) {
      router.replace("/user");
      return;
    }
    const profile = state.profile;
    setForm({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      industry: profile.industry || "",
      professionalRole: profile.professionalRole || "",
      professionalRoleOther: profile.professionalRoleOther || "",
      targetStandardIds: profile.targetStandardIds || [],
    });
    setStep(Math.min(Math.max(state.onboardingStep || 1, 1), 4));
    setHydrated(true);
  }, [data, hydrated, router]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validateStep = (current: number): boolean => {
    const nextErrors: Record<string, string> = {};
    if (current === 1) {
      if (!form.firstName.trim()) nextErrors.firstName = "First name is required";
      if (!form.lastName.trim()) nextErrors.lastName = "Last name is required";
    }
    if (current === 2 && !form.industry) {
      nextErrors.industry = "Select your industry";
    }
    if (current === 3) {
      if (!form.professionalRole) {
        nextErrors.professionalRole = "Select your professional role";
      } else if (
        form.professionalRole === "Other" &&
        form.professionalRoleOther.trim().length < 2
      ) {
        nextErrors.professionalRoleOther = "Please describe your role";
      }
    }
    if (current === 4 && form.targetStandardIds.length === 0) {
      nextErrors.targetStandardIds = "Select at least one ISO standard";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const persistStep = async (nextStep: number) => {
    const payload: Record<string, unknown> = { onboardingStep: nextStep };
    if (step === 1) {
      payload.firstName = form.firstName.trim();
      payload.lastName = form.lastName.trim();
    }
    if (step === 2) payload.industry = form.industry;
    if (step === 3) {
      payload.professionalRole = form.professionalRole;
      if (form.professionalRole === "Other") {
        payload.professionalRoleOther = form.professionalRoleOther.trim();
      }
    }
    if (step === 4) payload.targetStandardIds = form.targetStandardIds;

    await saveProgress(payload).unwrap();
  };

  const handleContinue = async () => {
    if (!validateStep(step) || isSaving || isCompleting) return;
    try {
      if (step < 4) {
        const next = step + 1;
        await persistStep(next);
        setStep(next);
      } else {
        await completeOnboarding({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          industry: form.industry,
          professionalRole: form.professionalRole,
          ...(form.professionalRole === "Other"
            ? { professionalRoleOther: form.professionalRoleOther.trim() }
            : {}),
          targetStandardIds: form.targetStandardIds,
        }).unwrap();
        toast.success("Welcome aboard — your profile is ready.");
        router.replace("/user");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      toast.error(
        err?.data?.message || err?.message || "Could not save. Please try again.",
      );
    }
  };

  const handleBack = () => {
    if (step <= 1 || isSaving || isCompleting) return;
    setErrors({});
    setStep((s) => s - 1);
  };

  const toggleStandard = (id: string) => {
    setForm((prev) => {
      const exists = prev.targetStandardIds.includes(id);
      return {
        ...prev,
        targetStandardIds: exists
          ? prev.targetStandardIds.filter((x) => x !== id)
          : [...prev.targetStandardIds, id],
      };
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next.targetStandardIds;
      return next;
    });
  };

  if (isLoading || !hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--ib-acc)]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-[var(--ib-line)] bg-[var(--ib-card)] p-8 text-center">
        <p className="mb-4 text-sm font-medium text-[var(--ib-mute)]">
          We couldn&apos;t load your onboarding status.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-[10px] bg-[var(--ib-acc)] px-5 py-2.5 text-sm font-bold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  const busy = isSaving || isCompleting;
  const selectedTitles = standards
    .filter((s) => form.targetStandardIds.includes(s.id))
    .map((s) => s.title);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <div className="text-center">
        <p className="mb-2 text-[13px] font-bold tracking-[-0.02em] text-[var(--ib-ink)]">
          ISOBrain<span className="text-[var(--ib-acc)]">.AI</span>
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--ib-ink)] sm:text-3xl">
          Set up your learning profile
        </h1>
        <p className="mt-2 text-sm font-medium text-[var(--ib-mute)]">
          Four quick steps so we can personalize your Academy, Library, and AI
          tools later.
        </p>
      </div>

      <OnboardingProgress currentStep={step} />

      <div className="rounded-2xl border border-[var(--ib-line)] bg-[var(--ib-card)] p-6 shadow-[0_20px_50px_rgba(11,18,32,0.05)] sm:p-8">
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-[var(--ib-ink)]">Welcome</h2>
              <p className="mt-1 text-sm text-[var(--ib-mute)]">
                Confirm your name so certificates and progress stay accurate.
                Your email is already linked to this account.
              </p>
            </div>
            <div className="rounded-xl bg-[var(--ib-bg)] px-4 py-3 text-sm text-[var(--ib-mute)]">
              Signed in as{" "}
              <span className="font-semibold text-[var(--ib-ink)]">
                {data?.data?.profile?.email}
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="mb-1.5 ml-1 block text-sm font-bold text-[var(--ib-mute)]">
                  First name
                </label>
                <input
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  className="w-full rounded-[10px] border border-[var(--ib-line)] bg-[var(--ib-bg)] px-4 py-3 text-sm font-medium text-[var(--ib-ink)] outline-none focus:border-[var(--ib-acc)] focus:ring-4 focus:ring-[var(--ib-acc)]/10"
                  autoComplete="given-name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs font-semibold text-red-600">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="mb-1.5 ml-1 block text-sm font-bold text-[var(--ib-mute)]">
                  Last name
                </label>
                <input
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  className="w-full rounded-[10px] border border-[var(--ib-line)] bg-[var(--ib-bg)] px-4 py-3 text-sm font-medium text-[var(--ib-ink)] outline-none focus:border-[var(--ib-acc)] focus:ring-4 focus:ring-[var(--ib-acc)]/10"
                  autoComplete="family-name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs font-semibold text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-[var(--ib-ink)]">Industry</h2>
              <p className="mt-1 text-sm text-[var(--ib-mute)]">
                Which industry best describes your work? This helps tailor future
                AI guidance.
              </p>
            </div>
            <div>
              <label htmlFor="industry" className="mb-1.5 ml-1 block text-sm font-bold text-[var(--ib-mute)]">
                Industry
              </label>
              <select
                id="industry"
                value={form.industry}
                onChange={(e) => updateField("industry", e.target.value)}
                className="w-full rounded-[10px] border border-[var(--ib-line)] bg-[var(--ib-bg)] px-4 py-3 text-sm font-medium text-[var(--ib-ink)] outline-none focus:border-[var(--ib-acc)] focus:ring-4 focus:ring-[var(--ib-acc)]/10"
              >
                <option value="">Select industry...</option>
                {industries.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {errors.industry && (
                <p className="mt-1 text-xs font-semibold text-red-600">{errors.industry}</p>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-[var(--ib-ink)]">
                Professional role
              </h2>
              <p className="mt-1 text-sm text-[var(--ib-mute)]">
                Your role shapes how recommendations and learning paths will be
                framed later.
              </p>
            </div>
            <div>
              <label htmlFor="professionalRole" className="mb-1.5 ml-1 block text-sm font-bold text-[var(--ib-mute)]">
                Role
              </label>
              <select
                id="professionalRole"
                value={form.professionalRole}
                onChange={(e) => updateField("professionalRole", e.target.value)}
                className="w-full rounded-[10px] border border-[var(--ib-line)] bg-[var(--ib-bg)] px-4 py-3 text-sm font-medium text-[var(--ib-ink)] outline-none focus:border-[var(--ib-acc)] focus:ring-4 focus:ring-[var(--ib-acc)]/10"
              >
                <option value="">Select role...</option>
                {professionalRoles.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {errors.professionalRole && (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  {errors.professionalRole}
                </p>
              )}
            </div>
            {form.professionalRole === "Other" && (
              <div>
                <label htmlFor="professionalRoleOther" className="mb-1.5 ml-1 block text-sm font-bold text-[var(--ib-mute)]">
                  Describe your role
                </label>
                <input
                  id="professionalRoleOther"
                  value={form.professionalRoleOther}
                  onChange={(e) =>
                    updateField("professionalRoleOther", e.target.value)
                  }
                  className="w-full rounded-[10px] border border-[var(--ib-line)] bg-[var(--ib-bg)] px-4 py-3 text-sm font-medium text-[var(--ib-ink)] outline-none focus:border-[var(--ib-acc)] focus:ring-4 focus:ring-[var(--ib-acc)]/10"
                  placeholder="e.g. ISO Programme Manager"
                />
                {errors.professionalRoleOther && (
                  <p className="mt-1 text-xs font-semibold text-red-600">
                    {errors.professionalRoleOther}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-[var(--ib-ink)]">
                Target ISO standards
              </h2>
              <p className="mt-1 text-sm text-[var(--ib-mute)]">
                Choose the standards you want to learn or work toward. Selecting a
                standard does not mean you are certified.
              </p>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ib-mute)]" />
              <input
                value={standardSearch}
                onChange={(e) => setStandardSearch(e.target.value)}
                placeholder="Search standards..."
                className="w-full rounded-[10px] border border-[var(--ib-line)] bg-[var(--ib-bg)] py-3 pl-10 pr-4 text-sm font-medium text-[var(--ib-ink)] outline-none focus:border-[var(--ib-acc)] focus:ring-4 focus:ring-[var(--ib-acc)]/10"
                aria-label="Search ISO standards"
              />
            </div>

            <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-[var(--ib-line)] p-2">
              {standardsLoading && (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-[var(--ib-acc)]" />
                </div>
              )}
              {!standardsLoading && filteredStandards.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-[var(--ib-mute)]">
                  No standards match your search.
                </p>
              )}
              {filteredStandards.map((standard) => {
                const selected = form.targetStandardIds.includes(standard.id);
                return (
                  <button
                    key={standard.id}
                    type="button"
                    onClick={() => toggleStandard(standard.id)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                      selected
                        ? "bg-[var(--ib-acc)]/10 ring-1 ring-[var(--ib-acc)]/30"
                        : "hover:bg-[var(--ib-bg)]",
                    )}
                    aria-pressed={selected}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border",
                        selected
                          ? "border-[var(--ib-acc)] bg-[var(--ib-acc)] text-white"
                          : "border-[var(--ib-line)] bg-[var(--ib-card)]",
                      )}
                    >
                      {selected && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-[var(--ib-ink)]">
                        {standard.title}
                      </span>
                      {standard.category?.name && (
                        <span className="text-xs text-[var(--ib-mute)]">
                          {standard.category.name}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.targetStandardIds && (
              <p className="text-xs font-semibold text-red-600">
                {errors.targetStandardIds}
              </p>
            )}

            <div className="rounded-xl bg-[var(--ib-bg)] p-4 text-sm">
              <p className="mb-2 font-bold text-[var(--ib-ink)]">Review</p>
              <ul className="space-y-1 text-[var(--ib-mute)]">
                <li>
                  Name:{" "}
                  <span className="font-semibold text-[var(--ib-ink)]">
                    {form.firstName} {form.lastName}
                  </span>
                </li>
                <li>
                  Industry:{" "}
                  <span className="font-semibold text-[var(--ib-ink)]">
                    {form.industry || "—"}
                  </span>
                </li>
                <li>
                  Role:{" "}
                  <span className="font-semibold text-[var(--ib-ink)]">
                    {form.professionalRole === "Other"
                      ? form.professionalRoleOther
                      : form.professionalRole || "—"}
                  </span>
                </li>
                <li>
                  Standards:{" "}
                  <span className="font-semibold text-[var(--ib-ink)]">
                    {selectedTitles.length
                      ? selectedTitles.join(", ")
                      : `${form.targetStandardIds.length} selected`}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-[var(--ib-line)] pt-6">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1 || busy}
            className="inline-flex items-center gap-2 rounded-[10px] border border-[var(--ib-line)] bg-[var(--ib-card)] px-4 py-2.5 text-sm font-bold text-[var(--ib-ink)] transition hover:bg-[var(--ib-bg)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-[10px] bg-[var(--ib-acc)] px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_28px_-14px_rgba(27,77,219,0.55)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : step === 4 ? (
              <>
                Finish setup
                <Check className="h-4 w-4" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
