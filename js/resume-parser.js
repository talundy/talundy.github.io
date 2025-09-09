// Resume Parser - Converts text resume to structured data
class ResumeParser {
    constructor() {
        this.sections = {};
    }

    parseResumeText(text) {
        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        let currentSection = null;
        let currentContent = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Check if this is a section header (all caps or title case)
            if (this.isSectionHeader(line)) {
                // Save previous section if exists
                if (currentSection) {
                    this.sections[currentSection] = this.processSectionContent(currentSection, currentContent);
                }
                
                // Start new section
                currentSection = this.normalizeSectionName(line);
                currentContent = [];
            } else {
                currentContent.push(line);
            }
        }

        // Save the last section
        if (currentSection) {
            this.sections[currentSection] = this.processSectionContent(currentSection, currentContent);
        }

        return this.sections;
    }

    isSectionHeader(line) {
        // Section headers are typically all caps or title case
        const sectionHeaders = [
            'PROFESSIONAL SUMMARY', 'WORK EXPERIENCE', 'EDUCATION', 
            'PROJECTS', 'CERTIFICATIONS', 'RELEVANT COURSEWORK', 'TECHNICAL SKILLS'
        ];
        
        return sectionHeaders.some(header => 
            line.toUpperCase() === header || 
            line === header ||
            (line.length > 3 && line === line.toUpperCase())
        );
    }

    normalizeSectionName(line) {
        const sectionMap = {
            'PROFESSIONAL SUMMARY': 'summary',
            'WORK EXPERIENCE': 'experience',
            'EDUCATION': 'education',
            'PROJECTS': 'projects',
            'CERTIFICATIONS': 'certifications',
            'RELEVANT COURSEWORK': 'coursework',
            'TECHNICAL SKILLS': 'skills'
        };

        return sectionMap[line.toUpperCase()] || line.toLowerCase().replace(/\s+/g, '_');
    }

    processSectionContent(sectionName, content) {
        switch (sectionName) {
            case 'summary':
                return { type: 'text', content: content.join(' ') };
            
            case 'experience':
                return this.parseExperience(content);
            
            case 'education':
                return this.parseEducation(content);
            
            case 'projects':
                return this.parseProjects(content);
            
            case 'certifications':
                return this.parseCertifications(content);
            
            case 'coursework':
                return this.parseCoursework(content);
            
            case 'skills':
                return this.parseSkills(content);
            
            default:
                return { type: 'text', content: content.join('\n') };
        }
    }

    parseExperience(content) {
        const experiences = [];
        let currentExp = null;

        for (const line of content) {
            // Check if this is a job title/company line (contains "at" or has specific format)
            if (line.includes('at') || this.isJobHeader(line)) {
                if (currentExp) {
                    experiences.push(currentExp);
                }
                currentExp = this.parseJobHeader(line);
            } else if (currentExp && line.trim()) {
                if (!currentExp.description) {
                    currentExp.description = [];
                }
                currentExp.description.push(line);
            }
        }

        if (currentExp) {
            experiences.push(currentExp);
        }

        return { type: 'experiences', content: experiences };
    }

    isJobHeader(line) {
        // Job headers typically have company name, position, and date
        return line.includes('–') || line.includes('-') || 
               (line.length > 20 && !line.includes('•') && !line.includes('- '));
    }

    parseJobHeader(line) {
        // Parse lines like "Piadina at Hotel San Luis Obispo" and "Server		June 2022 – Current"
        const parts = line.split('\t').filter(part => part.trim());
        
        if (parts.length >= 2) {
            return {
                company: parts[0].trim(),
                position: parts[1].trim(),
                date: parts[2] ? parts[2].trim() : '',
                description: []
            };
        } else {
            // Handle single line format
            const atIndex = line.indexOf(' at ');
            if (atIndex > -1) {
                return {
                    company: line.substring(atIndex + 4).trim(),
                    position: line.substring(0, atIndex).trim(),
                    date: '',
                    description: []
                };
            }
        }

        return {
            company: line,
            position: '',
            date: '',
            description: []
        };
    }

    parseEducation(content) {
        const education = [];
        let currentEdu = null;

        for (const line of content) {
            if (this.isEducationHeader(line)) {
                if (currentEdu) {
                    education.push(currentEdu);
                }
                currentEdu = this.parseEducationHeader(line);
            } else if (currentEdu && line.trim()) {
                if (!currentEdu.details) {
                    currentEdu.details = [];
                }
                currentEdu.details.push(line);
            }
        }

        if (currentEdu) {
            education.push(currentEdu);
        }

        return { type: 'education', content: education };
    }

    isEducationHeader(line) {
        // Education headers typically contain university names
        return line.includes('University') || line.includes('College') || 
               line.includes('Institute') || line.includes('School');
    }

    parseEducationHeader(line) {
        const parts = line.split('\t').filter(part => part.trim());
        
        if (parts.length >= 2) {
            return {
                institution: parts[0].trim(),
                degree: parts[1].trim(),
                location: parts[2] ? parts[2].trim() : '',
                details: []
            };
        }

        return {
            institution: line,
            degree: '',
            location: '',
            details: []
        };
    }

    parseProjects(content) {
        const projects = [];
        let currentProject = null;

        for (const line of content) {
            if (this.isProjectHeader(line)) {
                if (currentProject) {
                    projects.push(currentProject);
                }
                currentProject = this.parseProjectHeader(line);
            } else if (currentProject && line.trim()) {
                if (!currentProject.description) {
                    currentProject.description = [];
                }
                currentProject.description.push(line);
            }
        }

        if (currentProject) {
            projects.push(currentProject);
        }

        return { type: 'projects', content: projects };
    }

    isProjectHeader(line) {
        // Project headers typically have project name and role/type
        return line.includes('Project') || line.includes('–') || 
               (line.length > 10 && !line.includes('•') && !line.includes('- '));
    }

    parseProjectHeader(line) {
        const parts = line.split('\t').filter(part => part.trim());
        
        if (parts.length >= 2) {
            return {
                name: parts[0].trim(),
                role: parts[1].trim(),
                date: parts[2] ? parts[2].trim() : '',
                description: []
            };
        }

        return {
            name: line,
            role: '',
            date: '',
            description: []
        };
    }

    parseCertifications(content) {
        return { type: 'certifications', content: content };
    }

    parseCoursework(content) {
        return { type: 'coursework', content: content };
    }

    parseSkills(content) {
        const skills = {};
        
        for (const line of content) {
            if (line.includes(':')) {
                const [category, skillsList] = line.split(':');
                skills[category.trim()] = skillsList.split(',').map(skill => skill.trim());
            }
        }

        return { type: 'skills', content: skills };
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResumeParser;
}
