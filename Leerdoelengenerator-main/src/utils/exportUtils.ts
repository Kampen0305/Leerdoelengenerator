import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { KDStructure } from '../types/kd';

interface ExportData {
  originalObjective: string;
  context: {
    education: string;
    level: string;
    domain: string;
    assessment: string;
    voLevel?: string;
    voGrade?: number;
  };
  aiReadyObjective: string;
  rationale: string;
  suggestedActivities: string[];
  suggestedAssessments: string[];
  kdContext?: {
    title: string;
    code: string;
    relatedCompetencies: any[];
  } | null;
  exportDate: string;
  generatedBy: string;
}

export class ExportUtils {
  static exportToPDF(data: ExportData): void {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize: number = 12, isBold: boolean = false, color: string = '#000000') => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      pdf.setTextColor(color);
      
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, margin, yPosition);
      yPosition += (lines.length * fontSize * 0.4) + 8;
      
      // Check if we need a new page
      if (yPosition > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        yPosition = margin;
      }
    };

    // Header with DigitEd branding
    addText('DigitEd', 24, true, '#059669');
    addText('AI Curriculum Designer', 20, true, '#ea580c');
    addText('AI-Ready Leeruitkomst Rapport', 16, true, '#374151');
    yPosition += 10;

    // Export info
    addText(`Gegenereerd op: ${data.exportDate}`, 10, false, '#6b7280');
    addText(`Door: ${data.generatedBy}`, 10, false, '#6b7280');
    yPosition += 15;

    // Context section
    addText('CONTEXT', 14, true, '#059669');
    addText(`Onderwijstype: ${data.context.education}`, 12);
    const levelLine =
      data.context.education === 'VO'
        ? `VO-niveau: ${data.context.voLevel} | Leerjaar: ${data.context.voGrade}`
        : `Niveau: ${data.context.level}`;
    addText(levelLine, 12);
    addText(`Beroepsdomein: ${data.context.domain}`, 12);
    if (data.context.assessment) {
      addText(`Huidige toetsvorm: ${data.context.assessment}`, 12);
    }
    
    if (data.kdContext) {
      yPosition += 5;
      addText('KD CONTEXT', 14, true, '#ea580c');
      addText(`Kwalificatiedossier: ${data.kdContext.title} (${data.kdContext.code})`, 12);
      if (data.kdContext.relatedCompetencies.length > 0) {
        addText(`Gerelateerde competenties: ${data.kdContext.relatedCompetencies.map(c => c.title).join(', ')}`, 12);
      }
    }
    yPosition += 15;

    // Original vs AI-Ready comparison
    addText('VERGELIJKING LEERDOELEN', 14, true, '#059669');
    yPosition += 5;
    
    addText('Origineel leerdoel:', 12, true, '#dc2626');
    addText(data.originalObjective, 12, false, '#374151');
    yPosition += 10;
    
    addText('AI-ready leerdoel:', 12, true, '#059669');
    addText(data.aiReadyObjective, 12, false, '#374151');
    yPosition += 15;

    // Rationale
    addText('TOELICHTING', 14, true, '#ea580c');
    addText(data.rationale, 12, false, '#374151');
    yPosition += 15;

    // Learning Activities
    addText('VOORGESTELDE LEERACTIVITEITEN', 14, true, '#059669');
    data.suggestedActivities.forEach((activity, index) => {
      addText(`${index + 1}. ${activity}`, 12, false, '#374151');
    });
    yPosition += 15;

    // Assessment Methods
    addText('VOORGESTELDE TOETSVORMEN', 14, true, '#ea580c');
    data.suggestedAssessments.forEach((assessment, index) => {
      addText(`${index + 1}. ${assessment}`, 12, false, '#374151');
    });

    // Footer
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor('#6b7280');
      pdf.text(`Pagina ${i} van ${pageCount}`, pageWidth - margin, pdf.internal.pageSize.getHeight() - 10, { align: 'right' });
    }

    // Save the PDF
    const fileName = `digited-ai-ready-leerdoel-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  }

  static async exportToWord(data: ExportData): Promise<void> {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Header with DigitEd branding
          new Paragraph({
            children: [
              new TextRun({
                text: "DigitEd",
                bold: true,
                size: 36,
                color: "059669"
              }),
              new TextRun({
                text: " AI Curriculum Designer",
                bold: true,
                size: 32,
                color: "ea580c"
              })
            ],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: "AI-Ready Leeruitkomst Rapport",
                bold: true,
                size: 24,
                color: "374151"
              })
            ],
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),

          // Export info
          new Paragraph({
            children: [
              new TextRun({
                text: `Gegenereerd op: ${data.exportDate} | Door: ${data.generatedBy}`,
                italics: true,
                size: 18,
                color: "6b7280"
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 }
          }),

          // Context section
          new Paragraph({
            children: [
              new TextRun({
                text: "CONTEXT",
                bold: true,
                size: 22,
                color: "059669"
              })
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 }
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "Onderwijstype: ", bold: true }),
              new TextRun({ text: data.context.education })
            ],
            spacing: { after: 100 }
          }),

          new Paragraph({
            children: [
              new TextRun({ text: data.context.education === 'VO' ? 'VO-niveau: ' : 'Niveau: ', bold: true }),
              new TextRun({ text: data.context.education === 'VO' ? `${data.context.voLevel} | Leerjaar ${data.context.voGrade}` : data.context.level })
            ],
            spacing: { after: 100 }
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "Beroepsdomein: ", bold: true }),
              new TextRun({ text: data.context.domain })
            ],
            spacing: { after: 100 }
          }),

          ...(data.context.assessment ? [
            new Paragraph({
              children: [
                new TextRun({ text: "Huidige toetsvorm: ", bold: true }),
                new TextRun({ text: data.context.assessment })
              ],
              spacing: { after: 100 }
            })
          ] : []),

          // KD Context if available
          ...(data.kdContext ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "KD CONTEXT",
                  bold: true,
                  size: 20,
                  color: "ea580c"
                })
              ],
              spacing: { before: 300, after: 200 }
            }),

            new Paragraph({
              children: [
                new TextRun({ text: "Kwalificatiedossier: ", bold: true }),
                new TextRun({ text: `${data.kdContext.title} (${data.kdContext.code})` })
              ],
              spacing: { after: 100 }
            }),

            ...(data.kdContext.relatedCompetencies.length > 0 ? [
              new Paragraph({
                children: [
                  new TextRun({ text: "Gerelateerde competenties: ", bold: true }),
                  new TextRun({ text: data.kdContext.relatedCompetencies.map(c => c.title).join(', ') })
                ],
                spacing: { after: 100 }
              })
            ] : [])
          ] : []),

          // Comparison section
          new Paragraph({
            children: [
              new TextRun({
                text: "VERGELIJKING LEERDOELEN",
                bold: true,
                size: 22,
                color: "059669"
              })
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 600, after: 300 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Origineel leerdoel:",
                bold: true,
                color: "dc2626"
              })
            ],
            spacing: { after: 100 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: data.originalObjective,
                italics: true
              })
            ],
            spacing: { after: 300 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "AI-ready leerdoel:",
                bold: true,
                color: "059669"
              })
            ],
            spacing: { after: 100 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: data.aiReadyObjective,
                italics: true
              })
            ],
            spacing: { after: 400 }
          }),

          // Rationale
          new Paragraph({
            children: [
              new TextRun({
                text: "TOELICHTING",
                bold: true,
                size: 22,
                color: "ea580c"
              })
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: data.rationale
              })
            ],
            spacing: { after: 400 }
          }),

          // Learning Activities
          new Paragraph({
            children: [
              new TextRun({
                text: "VOORGESTELDE LEERACTIVITEITEN",
                bold: true,
                size: 22,
                color: "059669"
              })
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 }
          }),

          ...data.suggestedActivities.map((activity, index) => 
            new Paragraph({
              children: [
                new TextRun({
                  text: `${index + 1}. ${activity}`
                })
              ],
              spacing: { after: 150 }
            })
          ),

          // Assessment Methods
          new Paragraph({
            children: [
              new TextRun({
                text: "VOORGESTELDE TOETSVORMEN",
                bold: true,
                size: 22,
                color: "ea580c"
              })
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 }
          }),

          ...data.suggestedAssessments.map((assessment, index) => 
            new Paragraph({
              children: [
                new TextRun({
                  text: `${index + 1}. ${assessment}`
                })
              ],
              spacing: { after: 150 }
            })
          )
        ]
      }]
    });

    // Generate and save the document
    const buffer = await Packer.toBuffer(doc);
    const fileName = `digited-ai-ready-leerdoel-${new Date().toISOString().split('T')[0]}.docx`;
    saveAs(new Blob([buffer]), fileName);
  }

  static exportToJSON(data: ExportData): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const fileName = `digited-ai-ready-leerdoel-${new Date().toISOString().split('T')[0]}.json`;
    saveAs(blob, fileName);
  }
}