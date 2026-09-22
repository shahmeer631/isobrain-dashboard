import jsPDF from "jspdf";
import { ISingleCertificateData } from "@/types/userDashboardTypes";

export const generateCertificatePDF = (
  certificate: ISingleCertificateData,
  userName: string,
) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  // Draw Background Pattern/Gradient (Simulated with Multiple Rectangles)
  // Base color (Deep Indigo-Blue)
  doc.setFillColor(107, 75, 255); // #6B4BFF
  doc.rect(0, 0, width, height, "F");

  // Accent Gradient/Slope at bottom
  doc.setFillColor(139, 76, 255); // #8B4CFF
  doc.triangle(0, height, width, height, width, height - 60, "F");

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.text(
    certificate.template.title || "Certificate of Completion",
    width / 2,
    45,
    {
      align: "center",
    },
  );

  // Subtitle
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text(
    certificate.template.subtitle || "This certifies that",
    width / 2,
    60,
    {
      align: "center",
    },
  );

  // User Name
  doc.setFontSize(42);
  doc.setFont("helvetica", "bold");
  doc.text(userName, width / 2, 85, { align: "center" });

  // Body Text
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text(
    certificate.template.bodyText || "has successfully completed the course",
    width / 2,
    105,
    { align: "center" },
  );

  // Course Title
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(certificate.course.title, width / 2, 125, { align: "center" });

  // Date
  const issuedDate = new Date(certificate.issuedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Issued on ${issuedDate}`, width / 2, 140, { align: "center" });

  // Signatures
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);

  // Left Signature
  doc.line(40, 175, 120, 175);
  doc.setFontSize(10);
  doc.text(certificate.template.signature1 || "Course Instructor", 80, 182, {
    align: "center",
  });

  // Right Signature
  doc.line(width - 40, 175, width - 120, 175);
  doc.text(
    certificate.template.signature2 || "Director of ISO Brain",
    width - 80,
    182,
    {
      align: "center",
    },
  );

  // Footer & ID
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255, 0.6); // Alpha doesn't work well in old jsPDF but ok
  doc.text(
    `${certificate.template.footerText || "www.isobrain.ai"} | Certificate ID: ${certificate.id}`,
    width / 2,
    195,
    { align: "center" },
  );

  // Save PDF
  doc.save(`certificate-${certificate.id}.pdf`);
};
