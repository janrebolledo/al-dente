const PDFDocument = require('pdfkit');

export async function POST(req) {
  try {
    const resume = await req.json();

    const {
      personalDetails,
      education,
      experience,
      projects,
      certifications,
      skills,
    } = resume;

    const pdfBuffer = await new Promise((resolve, reject) => {
      // Initialize PDF
      const doc = new PDFDocument({
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      // Collect chunks for response
      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Utility: Add Section Heading (Bold)
      const addSectionHeading = (text) => {
        doc.moveDown();
        doc.font('Times-Bold').fontSize(11).text(text); // Bold font for headings
        doc
          .moveTo(50, doc.y)
          .lineTo(doc.page.width - 50, doc.y)
          .stroke();
        doc.moveDown(0.5);
      };

      // Utility: Add Text with Default Options
      const addText = (text, options = {}) => {
        const { font = 'Times-Roman', fontSize = 12, ...rest } = options;
        doc.font(font).fontSize(fontSize).text(text, rest);
      };

      // PDF Content
      addText(personalDetails.name, {
        font: 'Times-Bold',
        fontSize: 16,
        align: 'center',
      });
      doc.moveDown(0.5);
      addText(
        `${personalDetails.phone} | ${personalDetails.email} | ${personalDetails.social_media.linkedin} | ${personalDetails.social_media.github} | ${personalDetails.website}`,
        { align: 'center' }
      );

      // Education Section
      addSectionHeading('Education');
      education.forEach((school) => {
        addText(school.institute, { font: 'Times-Bold', continued: true });
        addText(`    ${school.location}`, { align: 'right' });
        addText(school.course, { font: 'Times-Italic', continued: true });
        addText(`    ${school.year}`, { font: 'Times-Italic', align: 'right' });
        doc.moveDown(0.5);
      });

      // Experience Section
      addSectionHeading('Experience');
      experience.forEach((exp) => {
        addText(exp.title, { font: 'Times-Bold', continued: true });
        addText(`    ${exp.duration}`, { align: 'right' });
        addText(exp.company, { font: 'Times-Italic', continued: true }); // Italicized company name
        addText(`    ${exp.location}`, {
          font: 'Times-Italic',
          align: 'right',
        });
        doc.moveDown(0.5);
        exp.description.forEach((point) => {
          addText(`• ${point}`, { indent: 10 }); // Bullet point indent set to 10
        });
        doc.moveDown(0.5);
      });

      // Projects Section
      addSectionHeading('Projects');
      projects.forEach((project) => {
        addText(project.name, { font: 'Times-Bold', continued: true });
        if (project.technologies.length) {
          addText(` | `, {
            continued: true,
          });
          addText(project.technologies.join(', '), {
            font: 'Times-Italic',
            continued: true,
          });
        }
        addText(`    ${project.duration}`, { align: 'right' });
        doc.moveDown(0.5);
        project.description.forEach((point) => {
          addText(`• ${point}`, { indent: 10 }); // Bullet point indent set to 10
        });
        doc.moveDown(0.5);
      });

      // Certifications Section
      addSectionHeading('Certifications');
      certifications.forEach((cert) => {
        addText(cert.name, { font: 'Times-Bold', continued: true });
        addText(`    ${cert.year}`, { align: 'right' });
      });

      // Skills Section
      addSectionHeading('Skills');
      addText(skills.join(', '), { align: 'left' });

      doc.end();
    });

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${personalDetails.name} Resume.pdf`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
