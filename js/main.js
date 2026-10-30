// ========================================
// Navigation & Section Switching
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = item.getAttribute('data-section');

            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                    if (targetSection === 'riwayat') animateSkillBars();
                    if (targetSection === 'tugas') renderAssignments();
                }
            });
        });
    });

    // ========================================
    // Dark Mode Toggle
    // ========================================
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    });

    // ========================================
    // Skill Bar Animation
    // ========================================
    function animateSkillBars() {
        document.querySelectorAll('.skill-fill').forEach(fill => {
            const width = fill.style.width;
            fill.style.width = '0%';
            setTimeout(() => { fill.style.width = width; }, 100);
        });
    }

    // ========================================
    // Profile Image Fallback
    // ========================================
    const profileImg = document.getElementById('profileImg');
    if (profileImg) {
        profileImg.addEventListener('error', () => {
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
                <rect width="200" height="200" fill="#e0e0e0"/>
                <circle cx="100" cy="80" r="40" fill="#888"/>
                <ellipse cx="100" cy="180" rx="60" ry="50" fill="#888"/>
                <text x="100" y="90" text-anchor="middle" fill="white" font-family="Inter,sans-serif" font-size="36" font-weight="700">F</text>
            </svg>`;
            profileImg.src = 'data:image/svg+xml,' + encodeURIComponent(svg);
        });
    }

    // ========================================
    // Entrance Animation
    // ========================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.service-card, .project-card, .timeline-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    const activeSection = document.querySelector('.section.active');
    if (activeSection) {
        activeSection.querySelectorAll('.service-card, .project-card, .timeline-item').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }

    // ========================================
    // Admin Authentication System
    // ========================================

    // -------------------------------------------------------
    // ⚠️  GANTI PASSWORD DI SINI
    //     Jalankan di Console browser:
    //     crypto.subtle.digest('SHA-256', new TextEncoder().encode('PASSWORD_BARU'))
    //       .then(h => console.log(Array.from(new Uint8Array(h)).map(b=>b.toString(16).padStart(2,'0')).join('')))
    //     Lalu copy hash-nya ke bawah.
    // -------------------------------------------------------
    // Default password: fadli2026
    const ADMIN_HASH = 'a1b2c3d4'; // placeholder, real hash set below
    
    // SHA-256 hash function
    async function sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Pre-computed hash of "fadli2026"
    let adminPasswordHash = '';
    
    // Compute the hash on load
    sha256('fadli2026').then(hash => {
        adminPasswordHash = hash;
    });

    let isAdmin = sessionStorage.getItem('portfolio_admin') === 'true';

    const btnAdminLogin = document.getElementById('btnAdminLogin');
    const btnAdminLogout = document.getElementById('btnAdminLogout');
    const loginModal = document.getElementById('loginModal');
    const btnLoginCancel = document.getElementById('btnLoginCancel');
    const btnLoginSubmit = document.getElementById('btnLoginSubmit');
    const adminPassword = document.getElementById('adminPassword');
    const loginError = document.getElementById('loginError');
    const togglePassword = document.getElementById('togglePassword');

    // Toggle admin UI
    function updateAdminUI() {
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach(el => {
            el.style.display = isAdmin ? '' : 'none';
        });
        btnAdminLogin.style.display = isAdmin ? 'none' : '';
        renderAssignments();
    }

    // Open login modal
    btnAdminLogin.addEventListener('click', () => {
        adminPassword.value = '';
        loginError.style.display = 'none';
        loginModal.classList.add('active');
        setTimeout(() => adminPassword.focus(), 100);
    });

    // Close login modal
    function closeLoginModal() {
        loginModal.classList.remove('active');
        adminPassword.value = '';
        loginError.style.display = 'none';
    }

    btnLoginCancel.addEventListener('click', closeLoginModal);
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) closeLoginModal();
    });

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = adminPassword.type === 'password' ? 'text' : 'password';
        adminPassword.type = type;
        togglePassword.querySelector('i').className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    });

    // Login submit
    async function handleLogin() {
        const password = adminPassword.value;
        if (!password) {
            adminPassword.focus();
            return;
        }

        const hash = await sha256(password);
        if (hash === adminPasswordHash) {
            isAdmin = true;
            sessionStorage.setItem('portfolio_admin', 'true');
            closeLoginModal();
            updateAdminUI();
        } else {
            loginError.style.display = 'block';
            adminPassword.value = '';
            adminPassword.focus();
            // Shake animation
            loginModal.querySelector('.modal').style.animation = 'none';
            setTimeout(() => {
                loginModal.querySelector('.modal').style.animation = 'shake 0.4s ease';
            }, 10);
        }
    }

    btnLoginSubmit.addEventListener('click', handleLogin);
    adminPassword.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleLogin();
    });

    // Logout
    btnAdminLogout.addEventListener('click', () => {
        isAdmin = false;
        sessionStorage.removeItem('portfolio_admin');
        updateAdminUI();
    });

    // Initialize admin UI on load
    updateAdminUI();

    // ========================================
    // Assignment Manager (CRUD + localStorage)
    // ========================================
    const STORAGE_KEY = 'portfolio_assignments';
    const assignmentModal = document.getElementById('assignmentModal');
    const btnAdd = document.getElementById('btnAddAssignment');
    const btnCancel = document.getElementById('btnCancel');
    const btnSave = document.getElementById('btnSave');
    const btnAddEntry = document.getElementById('btnAddEntry');
    const fileEntriesContainer = document.getElementById('fileEntries');
    const assignmentsList = document.getElementById('assignmentsList');
    const modalTitle = document.getElementById('modalTitle');
    const editIdInput = document.getElementById('editId');

    function getAssignments() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    function saveAssignments(assignments) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
    }

    function detectFileType(url) {
        const lower = url.toLowerCase();
        if (lower.includes('drive.google.com') || lower.includes('docs.google.com')) return 'gdrive';
        if (lower.includes('github.com')) return 'github';
        if (lower.endsWith('.pdf')) return 'pdf';
        if (lower.endsWith('.doc') || lower.endsWith('.docx')) return 'word';
        if (lower.endsWith('.ppt') || lower.endsWith('.pptx')) return 'ppt';
        if (lower.endsWith('.xls') || lower.endsWith('.xlsx')) return 'excel';
        if (lower.endsWith('.zip') || lower.endsWith('.rar')) return 'archive';
        return 'link';
    }

    function getFileIcon(type) {
        const icons = {
            gdrive: 'fab fa-google-drive',
            github: 'fab fa-github',
            pdf: 'fas fa-file-pdf',
            word: 'fas fa-file-word',
            ppt: 'fas fa-file-powerpoint',
            excel: 'fas fa-file-excel',
            archive: 'fas fa-file-archive',
            link: 'fas fa-link',
            file: 'fas fa-file'
        };
        return icons[type] || icons.link;
    }

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function addFileEntry(name = '', url = '') {
        const entry = document.createElement('div');
        entry.className = 'file-entry';
        entry.innerHTML = `
            <input type="text" class="entry-name" placeholder="Nama file / deskripsi" value="${escapeHtml(name)}">
            <input type="text" class="entry-url" placeholder="Link Google Drive / URL" value="${escapeHtml(url)}">
            <button type="button" class="btn-remove-entry" title="Hapus"><i class="fas fa-times"></i></button>
        `;
        entry.querySelector('.btn-remove-entry').addEventListener('click', () => entry.remove());
        fileEntriesContainer.appendChild(entry);
    }

    function openAddModal() {
        if (!isAdmin) return;
        modalTitle.textContent = 'Tambah Tugas';
        editIdInput.value = '';
        document.getElementById('assignmentName').value = '';
        document.getElementById('assignmentSubject').value = '';
        fileEntriesContainer.innerHTML = '';
        addFileEntry();
        assignmentModal.classList.add('active');
    }

    function openEditModal(id) {
        if (!isAdmin) return;
        const assignments = getAssignments();
        const assignment = assignments.find(a => a.id === id);
        if (!assignment) return;

        modalTitle.textContent = 'Edit Tugas';
        editIdInput.value = id;
        document.getElementById('assignmentName').value = assignment.name;
        document.getElementById('assignmentSubject').value = assignment.subject || '';
        fileEntriesContainer.innerHTML = '';

        if (assignment.files && assignment.files.length > 0) {
            assignment.files.forEach(f => addFileEntry(f.name, f.url));
        } else {
            addFileEntry();
        }
        assignmentModal.classList.add('active');
    }

    function closeAssignmentModal() {
        assignmentModal.classList.remove('active');
    }

    function saveAssignment() {
        if (!isAdmin) return;
        const name = document.getElementById('assignmentName').value.trim();
        const subject = document.getElementById('assignmentSubject').value.trim();
        const editId = editIdInput.value;

        if (!name) {
            const nameInput = document.getElementById('assignmentName');
            nameInput.focus();
            nameInput.style.borderColor = '#dc2626';
            setTimeout(() => { nameInput.style.borderColor = ''; }, 2000);
            return;
        }

        const entries = fileEntriesContainer.querySelectorAll('.file-entry');
        const files = [];
        entries.forEach(entry => {
            const entryName = entry.querySelector('.entry-name').value.trim();
            const entryUrl = entry.querySelector('.entry-url').value.trim();
            if (entryName || entryUrl) {
                files.push({
                    name: entryName || 'File',
                    url: entryUrl,
                    type: entryUrl ? detectFileType(entryUrl) : 'file'
                });
            }
        });

        const assignments = getAssignments();

        if (editId) {
            const index = assignments.findIndex(a => a.id === editId);
            if (index !== -1) {
                assignments[index].name = name;
                assignments[index].subject = subject;
                assignments[index].files = files;
                assignments[index].updatedAt = new Date().toISOString();
            }
        } else {
            assignments.unshift({
                id: 'asg_' + Date.now(),
                name,
                subject,
                files,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }

        saveAssignments(assignments);
        closeAssignmentModal();
        renderAssignments();
    }

    function deleteAssignment(id) {
        if (!isAdmin) return;
        if (!confirm('Yakin ingin menghapus tugas ini?')) return;
        const assignments = getAssignments().filter(a => a.id !== id);
        saveAssignments(assignments);
        renderAssignments();
    }

    function renderAssignments() {
        const assignments = getAssignments();

        if (assignments.length === 0) {
            assignmentsList.innerHTML = `
                <div class="assignment-empty">
                    <i class="fas fa-book-open"></i>
                    <p>Belum ada tugas</p>
                    ${isAdmin ? '<p class="hint">Klik "Tambah Tugas" untuk menambahkan tugas kuliah</p>' : '<p class="hint">Belum ada tugas yang ditambahkan</p>'}
                </div>
            `;
            return;
        }

        assignmentsList.innerHTML = assignments.map(a => `
            <div class="assignment-card" data-id="${a.id}">
                <div class="assignment-card-header">
                    <h4><i class="fas fa-book"></i> ${escapeHtml(a.name)}</h4>
                    ${isAdmin ? `
                        <div class="assignment-actions">
                            <button class="btn-edit" title="Edit" onclick="editAssignment('${a.id}')">
                                <i class="fas fa-pen"></i>
                            </button>
                            <button class="btn-delete" title="Hapus" onclick="deleteAssignmentById('${a.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    ` : ''}
                </div>
                ${a.subject ? `<div class="assignment-meta"><i class="fas fa-graduation-cap"></i> ${escapeHtml(a.subject)}</div>` : ''}
                <div class="assignment-meta"><i class="fas fa-clock"></i> ${formatDate(a.updatedAt || a.createdAt)}</div>
                ${a.files && a.files.length > 0 ? `
                    <div class="assignment-files">
                        ${a.files.map(f => {
                            if (f.url) {
                                return `
                                    <a href="${escapeHtml(f.url)}" class="assignment-file" target="_blank" rel="noopener">
                                        <i class="${getFileIcon(f.type)}"></i>
                                        <span class="file-name">${escapeHtml(f.name)}</span>
                                        <span class="file-type">${f.type}</span>
                                    </a>`;
                            } else {
                                return `
                                    <div class="assignment-file">
                                        <i class="${getFileIcon('file')}"></i>
                                        <span class="file-name">${escapeHtml(f.name)}</span>
                                        <span class="file-type">file</span>
                                    </div>`;
                            }
                        }).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    // Global functions for onclick handlers
    window.editAssignment = (id) => openEditModal(id);
    window.deleteAssignmentById = (id) => deleteAssignment(id);

    // Event listeners
    btnAdd.addEventListener('click', openAddModal);
    btnCancel.addEventListener('click', closeAssignmentModal);
    btnSave.addEventListener('click', saveAssignment);
    btnAddEntry.addEventListener('click', () => addFileEntry());

    assignmentModal.addEventListener('click', (e) => {
        if (e.target === assignmentModal) closeAssignmentModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (assignmentModal.classList.contains('active')) closeAssignmentModal();
            if (loginModal.classList.contains('active')) closeLoginModal();
        }
    });

    // Initial render
    renderAssignments();
});

// Shake animation (added via JS for login error)
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-10px); }
        40% { transform: translateX(10px); }
        60% { transform: translateX(-6px); }
        80% { transform: translateX(6px); }
    }
`;
document.head.appendChild(shakeStyle);
