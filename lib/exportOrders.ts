/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportOrdersToPDF = (orders: any[]) => {
  const doc = new jsPDF();

  // Add Title
  doc.setFontSize(18);
  doc.text("Orders Report", 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);

  // Table Columns
  const tableColumn = [
    "Order ID",
    "Customer",
    "Email",
    "Plan",
    "Amount",
    "Status",
    "Date",
  ];

  // Table Rows
  const tableRows = orders.map((order) => [
    `#${order.id.slice(-6)}`,
    `${order.user?.firstName ?? ""} ${order.user?.lastName ?? ""}`.trim(),
    order.user?.email ?? "",
    order.plan?.name ?? "",
    `$${Number(order.finalAmount).toFixed(2)}`,
    order.status === "SUCCEEDED" ? "Completed" : "Pending",
    new Date(order.createdAt).toLocaleDateString(),
  ]);

  // Generate Table
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    theme: "grid",
    headStyles: {
      fillColor: [243, 244, 246], // ✅ correct (RGB array)
      textColor: [0, 0, 0],
      fontStyle: "bold",
    },
  });

  // Save the PDF
  doc.save(`orders-report-${new Date().toISOString().slice(0, 10)}.pdf`);
};
