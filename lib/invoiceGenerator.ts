import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface OrderData {
  invoiceId: string;
  date: string;
  item: string;
  amount: number;
  status: string;
  paymentId: string;
  userName?: string;
  userEmail?: string;
}

export const generateOrderInvoicePDF = (order: OrderData) => {
  const doc = new jsPDF();
  
  // Name and Email from order data or fallback
  const userName = order.userName || "Customer Name";
  const userEmail = order.userEmail || "customer@example.com";

  // Add Brand/Logo Placeholder or Name
  doc.setFontSize(22);
  doc.setTextColor(79, 70, 229); // Brand color Indigo-600
  doc.text("Isobrain", 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Professional Dashboard Solutions", 14, 26);

  // Invoice Header
  doc.setFontSize(20);
  doc.setTextColor(0);
  doc.text("INVOICE", 140, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Invoice ID: ${order.invoiceId}`, 140, 28);
  doc.text(`Date: ${new Date(order.date).toLocaleDateString()}`, 140, 34);
  doc.text(`Status: ${order.status}`, 140, 40);

  // Divider
  doc.setDrawColor(229, 231, 235);
  doc.line(14, 45, 196, 45);

  // Billing Info
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text("Billed To:", 14, 55);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(userName, 14, 61);
  doc.text(userEmail, 14, 66);

  // Payment Details
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text("Payment Details:", 140, 55);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Payment ID: ${order.paymentId}`, 140, 61);
  doc.text("Method: Card/Online", 140, 66);

  // Table
  autoTable(doc, {
    startY: 80,
    head: [["Description", "Amount"]],
    body: [
      [order.item, `$${order.amount.toFixed(2)}`],
    ],
    foot: [
      ["Total", `$${order.amount.toFixed(2)}`],
    ],
    theme: "striped",
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    footStyles: {
      fillColor: [249, 250, 251],
      textColor: [0, 0, 0],
      fontStyle: "bold",
    },
    columnStyles: {
      1: { halign: "right" },
    },
  });

  // Footer
  const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Thank you for your business!", 14, finalY);
  doc.text("If you have any questions, please contact support@isobrain.ai", 14, finalY + 6);

  // Save the PDF
  doc.save(`invoice-${order.invoiceId}.pdf`);
};
