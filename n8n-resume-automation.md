# n8n Resume Automation Workflow

This document outlines the n8n automation workflow for automatically updating resume PDFs on your GitHub Pages website.

## Overview

The automation monitors a designated folder for new PDF uploads and automatically:
1. Processes the uploaded PDF
2. Renames it according to the naming convention
3. Uploads it to the GitHub repository
4. Replaces the existing file (ensuring latest version is always displayed)

## Workflow Steps

### 1. Trigger Node
- **Type**: File Trigger or Webhook
- **Configuration**: 
  - Monitor folder: `/path/to/resume/source/folder`
  - File types: `.pdf`
  - Or use webhook for manual triggers

### 2. File Processing Node
- **Type**: Code Node or Function Node
- **Purpose**: Determine resume type and set appropriate filename
- **Logic**:
  ```javascript
  // Extract filename from trigger
  const originalFilename = $input.first().json.filename;
  
  // Map original names to standardized names
  const filenameMapping = {
    'software_eng': 'software-engineering.pdf',
    'embedded_sys': 'embedded-systems.pdf', 
    'electrical_eng': 'electrical-engineering.pdf',
    // Add more mappings as needed
  };
  
  // Determine target filename (you can customize this logic)
  let targetFilename = 'software-engineering.pdf'; // default
  
  if (originalFilename.toLowerCase().includes('embedded')) {
    targetFilename = 'embedded-systems.pdf';
  } else if (originalFilename.toLowerCase().includes('electrical')) {
    targetFilename = 'electrical-engineering.pdf';
  }
  
  return {
    originalFilename,
    targetFilename,
    filePath: $input.first().binary.data
  };
  ```

### 3. GitHub Upload Node
- **Type**: GitHub Node
- **Configuration**:
  - **Repository**: `talundy/talundy.github.io`
  - **Branch**: `main`
  - **File Path**: `resumes/{{ $json.targetFilename }}`
  - **Content**: Binary data from previous node
  - **Message**: `Update {{ $json.targetFilename }} resume`

### 4. Notification Node (Optional)
- **Type**: Email, Slack, or Discord
- **Purpose**: Notify when resume is successfully updated
- **Message**: `Resume {{ $json.targetFilename }} has been successfully updated on the website.`

## File Naming Convention

The automation expects these standardized filenames:
- `software-engineering.pdf`
- `embedded-systems.pdf`
- `electrical-engineering.pdf`

## Setup Instructions

### 1. GitHub Token Setup
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate a new token with `repo` permissions
3. Add token to n8n credentials

### 2. n8n Workflow Configuration
1. Create new workflow in n8n
2. Add the nodes as described above
3. Configure each node with appropriate settings
4. Test the workflow with a sample PDF

### 3. Source Folder Setup
- Create a dedicated folder for resume uploads
- Use consistent naming in source files for easier mapping
- Example source filenames:
  - `resume_software_eng_v2.pdf`
  - `resume_embedded_systems_latest.pdf`
  - `resume_electrical_eng_2024.pdf`

## Testing the Workflow

1. Upload a test PDF to the source folder
2. Check that it appears in the GitHub repository under `resumes/`
3. Verify the carousel on your website shows the updated file
4. Test with different resume types to ensure proper mapping

## Troubleshooting

### Common Issues
- **File not uploading**: Check GitHub token permissions
- **Wrong filename**: Verify filename mapping logic in Code node
- **File not updating**: Ensure you're overwriting existing files in GitHub node

### Monitoring
- Check n8n execution logs for errors
- Monitor GitHub repository for successful commits
- Test website carousel functionality regularly

## Future Enhancements

- Add file validation (PDF format, size limits)
- Implement version history tracking
- Add automatic backup of previous versions
- Create webhook for real-time updates
- Add metadata extraction (creation date, file size)

## Security Considerations

- Keep GitHub token secure and rotate regularly
- Validate file types and sizes
- Consider adding virus scanning for uploaded files
- Implement rate limiting to prevent abuse
