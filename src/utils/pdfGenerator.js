export const buildDocumentChecklistTemplate = (documents = []) => {
  const readyCount = documents.filter((doc) => doc.ready).length;
  const totalCount = documents.length;

  return {
    title: 'Frankfurt Document Checklist',
    category: 'documents',
    description: `${readyCount} of ${totalCount} documents ready. Use this checklist to track the paperwork needed for your Frankfurt relocation.`,
    tasks: documents.map((doc) => {
      const status = doc.ready ? 'Ready' : 'Not ready';
      const notes = doc.notes?.trim() ? ` Notes: ${doc.notes.trim()}` : '';

      return {
        title: doc.name,
        description: `${status} - ${doc.description}${notes}`,
      };
    }),
  };
};

export const downloadPDF = async (template) => {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(13, 148, 136); // Teal-600
  doc.text(template.title, 14, 20);

  // Subheader
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.text(`Category: ${template.category.toUpperCase()}`, 14, 30);
  doc.text(`Generated on: ${date}`, 14, 36);

  // Description
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  const splitDesc = doc.splitTextToSize(template.description, 180);
  doc.text(splitDesc, 14, 46);

  // Tasks Table
  const tableData = template.tasks.map((task, index) => [
    index + 1,
    task.title,
    task.description
  ]);

  autoTable(doc, {
    startY: 60,
    head: [['#', 'Task', 'Description']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [13, 148, 136] }, // Teal-600
    styles: { fontSize: 10, cellPadding: 4 },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 60 },
      2: { cellWidth: 'auto' }
    }
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${pageCount} - Frankfurt Expat Services`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  doc.save(`${template.title.replace(/\s+/g, '_')}.pdf`);
};
