# Resume Files

This directory contains tailored resume PDFs for different specializations.

## File Naming Convention

- `software-engineering.pdf` - Software Engineering focused resume
- `embedded-systems.pdf` - Embedded Systems focused resume  
- `electrical-engineering.pdf` - Electrical Engineering focused resume

## n8n Automation

These files are automatically updated via n8n workflow. When a new PDF is uploaded to the designated source folder, it will:

1. Be renamed to match the expected naming convention
2. Be uploaded to this GitHub repository
3. Replace the existing file (ensuring latest version is always displayed)

## Adding New Resume Types

To add a new resume type:
1. Update the carousel in `Experience Page/experience.html`
2. Add corresponding CSS styles in `styles/job.css`
3. Update this README with the new file naming convention
4. Configure n8n workflow to handle the new file type
