import { utils, write } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function sanitizeFilename(label: string) {
  return label.replace(/[^a-z0-9-_]+/gi, "_");
}

export function exportToExcel(label: string, headers: string[], rows: (string | number)[][]) {
  const worksheet = utils.aoa_to_sheet([headers, ...rows]);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Export");
  const buffer = write(workbook, { bookType: "xlsx", type: "array" });
  downloadBlob(
    new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    `${sanitizeFilename(label)}.xlsx`,
  );
  toast.success(`Excel généré : ${label}`);
}

export function exportToPdf(label: string, headers: string[], rows: (string | number)[][]) {
  const doc = new jsPDF();
  doc.setFontSize(13);
  doc.text(label, 14, 15);
  autoTable(doc, { head: [headers], body: rows, startY: 20, styles: { fontSize: 8 } });
  doc.save(`${sanitizeFilename(label)}.pdf`);
  toast.success(`PDF généré : ${label}`);
}
