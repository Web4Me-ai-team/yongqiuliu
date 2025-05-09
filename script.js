// Colorful Template JavaScript

// Function to show specific section
function showSection(id) {
    document.querySelectorAll('main section').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

// Function to handle typing effect
function setupTypingEffect() {
    const text = "ello, I'm";
    const typingText = document.getElementById('typing-text');
    let index = 0;
    let isDeleting = false;

    function typeEffect() {
        if (isDeleting) {
            typingText.innerText = text.substring(0, index--);
        } else {
            typingText.innerText = text.substring(0, index++);
        }
        let speed = isDeleting ? 75 : 150;
        if (!isDeleting && index === text.length + 1) {
            speed = 1200; // Pause at full text before deleting
            isDeleting = true;
        } else if (isDeleting && index === 0) {
            isDeleting = false;
            speed = 500; // Pause before typing again
        }
        setTimeout(typeEffect, speed);
    }
    
    typeEffect();
}

// Function to handle timeline item interactions
function setupTimelineItems() {
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.addEventListener('mouseenter', function () {
            document.querySelectorAll('.timeline-item.active').forEach(activeItem => {
                if (activeItem !== this) {
                    activeItem.classList.remove('active');
                }
            });
            this.classList.add('active');
        });

        item.addEventListener('click', function () {
            document.querySelectorAll('.timeline-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Project carousel functionality
let currentSlide = 0;

function updateCarousel() {
    const container = document.querySelector('.projects-container');
    if (!container) return;
    
    container.style.transform = `translateX(-${currentSlide * 100}%)`;
}

// Function to parse URL parameters for resume data
function getResumeData() {
    const urlParams = new URLSearchParams(window.location.search);
    const resumeDataParam = urlParams.get('resumeData');
    
    if (resumeDataParam) {
        try {
            return JSON.parse(decodeURIComponent(resumeDataParam));
        } catch (error) {
            console.error('Error parsing resume data:', error);
            return null;
        }
    }
    return null;
}

// Function to populate sections with resume data
function populateResumeData() {
    const resumeData = getResumeData();
    if (!resumeData) return;
    
    // Update Personal Info
    if (resumeData.personalInfo) {
        const info = resumeData.personalInfo;
        
        // Update name, title, and summary
        if (info.name) document.querySelector('h1').textContent = info.name;
        if (info.Summary) document.querySelector('.summary').textContent = info.Summary;
        
        // Update contact information
        if (info.email) {
            const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
            emailLinks.forEach(link => {
                link.href = `mailto:${info.email}`;
            });
        }
        
        if (info.phone) {
            const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
            phoneLinks.forEach(link => {
                link.href = `tel:${info.phone}`;
            });
        }
        
        // Update social links
        if (info.socialLinks) {
            const socialLinks = document.querySelectorAll('.contacts a');
            socialLinks.forEach(link => {
                const label = link.getAttribute('aria-label').toLowerCase();
                
                if (label.includes('linkedin') && info.socialLinks.linkedin) {
                    link.href = info.socialLinks.linkedin;
                }
                
                if (label.includes('twitter') && info.socialLinks['Social Media']) {
                    link.href = info.socialLinks['Social Media'];
                }
                
                if (label.includes('scholar') && info.socialLinks['Google Scholar']) {
                    link.href = info.socialLinks['Google Scholar'];
                }
            });
        }
    }
    
    // Update Research Interests
    if (resumeData.researchInterests && resumeData.researchInterests.length) {
        const container = document.getElementById('research-interests-container');
        if (container) {
            container.innerHTML = '';
            
            resumeData.researchInterests.forEach(interest => {
                const interestEl = document.createElement('div');
                interestEl.className = 'research-card';
                interestEl.innerHTML = `
                    <h3 class="research-field">${interest.field || ''}</h3>
                    <p class="research-description">${interest.description || ''}</p>
                `;
                container.appendChild(interestEl);
            });
        }
    }
    
    // Update Education
    if (resumeData.education && resumeData.education.length) {
        const container = document.getElementById('education-container');
        if (container) {
            const timeline = container.querySelector('.timeline');
            if (timeline) {
                timeline.innerHTML = '';
                
                resumeData.education.forEach(edu => {
                    const thesisHTML = edu.thesis 
                        ? `<p class="thesis"><strong>Thesis:</strong> "${edu.thesis}"</p>`
                        : '';
                    
                    const graduationDate = edu.graduationDate || '';
                    
                    const eduEl = document.createElement('div');
                    eduEl.className = 'timeline-item';
                    eduEl.innerHTML = `
                        <div class="timeline-date">${graduationDate}</div>
                        <div class="timeline-content">
                            <h3>${edu.degree || ''}</h3>
                            <span class="school">${edu.school || ''}</span>
                            <p class="field">${edu.field || ''}</p>
                            ${thesisHTML}
                        </div>
                    `;
                    timeline.appendChild(eduEl);
                });
            }
        }
    }
    
    // Update Work Experience
    if (resumeData.workExperience && resumeData.workExperience.length) {
        const container = document.getElementById('experience-container');
        if (container) {
            const timeline = container.querySelector('.timeline');
            if (timeline) {
                timeline.innerHTML = '';
                
                resumeData.workExperience.forEach(exp => {
                    let descriptionHTML = '';
                    if (exp.description && exp.description.length) {
                        const listItems = exp.description.map(desc => `<li>${desc}</li>`).join('');
                        descriptionHTML = `
                            <div class="description-container">
                                <ul class="description-list">
                                    ${listItems}
                                </ul>
                            </div>
                        `;
                    }
                    
                    let techniquesHTML = '';
                    if (exp.techniques && exp.techniques.length) {
                        const tags = exp.techniques.map(tech => `<span class="technique-tag">${tech}</span>`).join('');
                        techniquesHTML = `
                            <div class="techniques">
                                ${tags}
                            </div>
                        `;
                    }
                    
                    const expEl = document.createElement('div');
                    expEl.className = 'timeline-item';
                    expEl.innerHTML = `
                        <div class="timeline-date">${exp.duration || ''}</div>
                        <div class="timeline-content">
                            <h3 class="position">${exp.position || ''}</h3>
                            <span class="institution">${exp.institution || ''}</span>
                            ${descriptionHTML}
                            ${techniquesHTML}
                        </div>
                    `;
                    timeline.appendChild(expEl);
                });
            }
        }
    }
    
    // Update Technical Skills
    if (resumeData.technicalSkills && resumeData.technicalSkills.length) {
        const container = document.getElementById('technical-skills-container');
        if (container) {
            container.innerHTML = '';
            
            // Map of skills to appropriate Font Awesome icons
            const skillIconMap = {
                'python': 'fa-brands fa-python',
                'tensorflow': 'fa-solid fa-brain',
                'pytorch': 'fa-solid fa-fire',
                'c++': 'fa-solid fa-code',
                'java': 'fa-brands fa-java',
                'javascript': 'fa-brands fa-js',
                'html': 'fa-brands fa-html5',
                'css': 'fa-brands fa-css3-alt',
                'sql': 'fa-solid fa-database',
                'git': 'fa-brands fa-git-alt',
                'cloud': 'fa-solid fa-cloud',
                'data analysis': 'fa-solid fa-chart-line',
                'machine learning': 'fa-solid fa-robot',
                'deep learning': 'fa-solid fa-network-wired',
                'computer vision': 'fa-solid fa-eye',
                'nlp': 'fa-solid fa-comment-dots',
                'research': 'fa-solid fa-microscope',
                'teaching': 'fa-solid fa-chalkboard-teacher'
            };
            
            resumeData.technicalSkills.forEach(skill => {
                const lowerSkill = skill.toLowerCase();
                let iconClass = 'fa-solid fa-rectangle-list'; // default icon
                
                // Check if we have a specific icon for this skill
                for (const [key, value] of Object.entries(skillIconMap)) {
                    if (lowerSkill.includes(key)) {
                        iconClass = value;
                        break;
                    }
                }
                
                const skillEl = document.createElement('div');
                skillEl.className = 'skill-item';
                skillEl.innerHTML = `
                    <i class="${iconClass}"></i>
                    <span>${skill}</span>
                `;
                container.appendChild(skillEl);
            });
        }
    }
    
    // Update Publications
    if (resumeData.publications && resumeData.publications.length) {
        const container = document.getElementById('publications-container');
        if (container) {
            container.innerHTML = '';
            
            resumeData.publications.forEach(pub => {
                let authorsText = '';
                if (pub.authors && pub.authors.length) {
                    authorsText = pub.authors.join(', ');
                }
                
                const pubEl = document.createElement('div');
                pubEl.className = 'publication-card';
                pubEl.innerHTML = `
                    <h3 class="publication-title">${pub.title || ''}</h3>
                    <div class="publication-meta">
                        <span class="publication-journal">${pub.journal || ''}</span>
                        <span class="publication-year">${pub.year || ''}</span>
                    </div>
                    <p class="publication-authors">${authorsText}</p>
                    ${pub.links ? `
                    <div class="publication-links">
                        <a href="${ensureHttpPrefix(pub.links)}" target="_blank">
                            <i class="fa-solid fa-external-link-alt"></i> View Paper
                        </a>
                    </div>` : ''}
                `;
                container.appendChild(pubEl);
            });
        }
    }
    
    // Update Projects
    if (resumeData.projects && resumeData.projects.length) {
        const container = document.getElementById('projects-container');
        if (container) {
            container.innerHTML = '';
            
            resumeData.projects.forEach(proj => {
                let techHTML = '';
                if (proj.technologies && proj.technologies.length) {
                    const tags = proj.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('');
                    techHTML = `
                        <div class="project-tech">
                            ${tags}
                        </div>
                    `;
                }
                
                let outcomesHTML = '';
                if (proj.outcomes && proj.outcomes.length) {
                    const listItems = proj.outcomes.map(outcome => 
                        `<li><i class="fa-solid fa-check"></i> ${outcome}</li>`
                    ).join('');
                    
                    outcomesHTML = `
                        <div class="project-outcomes">
                            <h4>Outcomes:</h4>
                            <ul>
                                ${listItems}
                            </ul>
                        </div>
                    `;
                }
                
                const projEl = document.createElement('div');
                projEl.className = 'project-card';
                projEl.innerHTML = `
                    <h3 class="project-title">${proj.title || ''}</h3>
                    <span class="project-duration">${proj.duration || ''}</span>
                    <p class="project-description">${proj.description || ''}</p>
                    ${techHTML}
                    ${outcomesHTML}
                `;
                container.appendChild(projEl);
            });
            
            // Reset current slide to 0
            currentSlide = 0;
            updateCarousel();
        }
    }
    
    // Update Teaching Experience
    if (resumeData.teachingExperience && resumeData.teachingExperience.length) {
        const container = document.getElementById('teaching-container');
        if (container) {
            const timeline = container.querySelector('.timeline');
            if (timeline) {
                timeline.innerHTML = '';
                
                resumeData.teachingExperience.forEach(teach => {
                    let coursesHTML = '';
                    if (teach.courses && teach.courses.length) {
                        const listItems = teach.courses.map(course => `<li>${course}</li>`).join('');
                        coursesHTML = `
                            <div class="courses-container">
                                <h4>Courses:</h4>
                                <ul>${listItems}</ul>
                            </div>
                        `;
                    }
                    
                    const teachEl = document.createElement('div');
                    teachEl.className = 'timeline-item';
                    teachEl.innerHTML = `
                        <div class="timeline-date">${teach.duration || ''}</div>
                        <div class="timeline-content">
                            <h3 class="teaching-role">${teach.role || ''}</h3>
                            <span class="teaching-institution">${teach.institution || ''}</span>
                            ${coursesHTML}
                        </div>
                    `;
                    timeline.appendChild(teachEl);
                });
            }
        }
    }
    
    // Update Honors & Awards
    if (resumeData.honorsAndAwards && resumeData.honorsAndAwards.length) {
        const container = document.getElementById('awards-container');
        if (container) {
            const timeline = container.querySelector('.timeline');
            if (timeline) {
                timeline.innerHTML = '';
                
                resumeData.honorsAndAwards.forEach(award => {
                    const awardEl = document.createElement('div');
                    awardEl.className = 'timeline-item';
                    awardEl.innerHTML = `
                        <div class="timeline-date">${award.year || ''}</div>
                        <div class="timeline-content">
                            <h3 class="award-name">${award.name || ''}</h3>
                            <span class="award-issuer">${award.issuer || ''}</span>
                        </div>
                    `;
                    timeline.appendChild(awardEl);
                });
            }
        }
    }
    
    // Reset timeline item interactions
    setupTimelineItems();
}

// Ensure URL has http or https prefix
function ensureHttpPrefix(url) {
    if (!url) return '';
    return url.match(/^https?:\/\//) ? url : `https://${url}`;
}

// Fix all external links
function fixExternalLinks() {
    // Find all a tags with href attributes
    const allLinks = document.querySelectorAll('a[href]');
    
    allLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Skip internal links (starting with # or /) and mailto/tel links
        if (!href || href.startsWith('#') || href.startsWith('/') || 
            href.startsWith('mailto:') || href.startsWith('tel:')) {
            return;
        }
        
        // Skip links that already have a protocol
        if (href.match(/^https?:\/\//)) {
            return;
        }
        
        // Add https:// prefix to external links
        link.setAttribute('href', `https://${href}`);
    });
}

// Initialize everything when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Default section on page load
    showSection('profile');
    
    // Initialize the typing effect
    setupTypingEffect();
    
    // Initialize timeline interactions
    setupTimelineItems();
    
    // Initialize project carousel
    updateCarousel();
    
    // Populate data from URL parameters
    populateResumeData();
    
    // 修复外部链接
    fixExternalLinks();
}); 