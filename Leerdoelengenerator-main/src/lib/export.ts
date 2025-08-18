import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, HeadingLevel } from 'docx';
import jsPDF from 'jspdf';

export interface ExportMetadata {
  title: string;
  date: string;
  baan: string;
  sector: string;
  niveau: string;
}

export interface ExportSection {
  title: string;
  content: string;
}

export async function exportToDocx(metadata: ExportMetadata, sections: ExportSection[]): Promise<void> {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: metadata.title, heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ text: `Datum: ${metadata.date}` }),
          new Paragraph({ text: `Baan: ${metadata.baan}` }),
          new Paragraph({ text: `Sector/Niveau: ${metadata.sector} / ${metadata.niveau}` }),
          ...sections.flatMap((section, idx) => [
            new Paragraph({ text: section.title, heading: HeadingLevel.HEADING_2, pageBreakBefore: idx !== 0 }),
            new Paragraph({ text: section.content }),
          ]),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${metadata.title}.docx`);
}

export function exportToPdf(metadata: ExportMetadata, sections: ExportSection[]): void {
  const doc = new jsPDF();
  doc.setProperties({ title: metadata.title });
  doc.setFont('Helvetica', 'normal');
  let y = 20;

  doc.setFontSize(18);
  doc.text(metadata.title, 10, y);
  y += 10;

  doc.setFontSize(12);
  doc.text(`Datum: ${metadata.date}`, 10, y);
  y += 6;
  doc.text(`Baan: ${metadata.baan}`, 10, y);
  y += 6;
  doc.text(`Sector/Niveau: ${metadata.sector} / ${metadata.niveau}`, 10, y);

  sections.forEach((section) => {
    doc.addPage();
    y = 20;
    doc.setFontSize(16);
    doc.text(section.title, 10, y);
    y += 10;
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(section.content, 180);
    doc.text(lines, 10, y);
  });

  doc.save(`${metadata.title}.pdf`);
}
