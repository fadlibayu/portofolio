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
    //     Ubah nilai ADMIN_PASSWORD di bawah ini.
    // -------------------------------------------------------
    const ADMIN_PASSWORD = 'fadli2026';

    // Simple hash function (djb2) — works on file://, http://, https://
    function simpleHash(str) {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash) + str.charCodeAt(i);
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(36);
    }

    const ADMIN_TOKEN = simpleHash(ADMIN_PASSWORD + '_portfolio_admin');

    let isAdmin = sessionStorage.getItem('portfolio_admin') === ADMIN_TOKEN;

    const btnAdminLogin = document.getElementById('btnAdminLogin');
    const btnAdminLogout = document.getElementById('btnAdminLogout');
    const loginModal = document.getElementById('loginModal');
    const btnLoginCancel = document.getElementById('btnLoginCancel');
    const btnLoginSubmit = document.getElementById('btnLoginSubmit');
    const adminPasswordInput = document.getElementById('adminPassword');
    const loginError = document.getElementById('loginError');
    const togglePassword = document.getElementById('togglePassword');

    // Toggle admin UI visibility
    function updateAdminUI() {
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach(el => {
            el.style.display = isAdmin ? '' : 'none';
        });
        if (btnAdminLogin) {
            btnAdminLogin.style.display = isAdmin ? 'none' : '';
        }
        renderAssignments();
    }

    // Open login modal
    if (btnAdminLogin) {
        btnAdminLogin.addEventListener('click', () => {
            adminPasswordInput.value = '';
            loginError.style.display = 'none';
            loginModal.classList.add('active');
            setTimeout(() => adminPasswordInput.focus(), 100);
        });
    }

    // Close login modal
    function closeLoginModal() {
        loginModal.classList.remove('active');
        adminPasswordInput.value = '';
        loginError.style.display = 'none';
    }

    if (btnLoginCancel) {
        btnLoginCancel.addEventListener('click', closeLoginModal);
    }
    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) closeLoginModal();
        });
    }

    // Toggle password visibility
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const type = adminPasswordInput.type === 'password' ? 'text' : 'password';
            adminPasswordInput.type = type;
            togglePassword.querySelector('i').className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        });
    }

    // Login submit
    function handleLogin() {
        const password = adminPasswordInput.value;
        if (!password) {
            adminPasswordInput.focus();
            return;
        }

        if (password === ADMIN_PASSWORD) {
            isAdmin = true;
            sessionStorage.setItem('portfolio_admin', ADMIN_TOKEN);
            closeLoginModal();
            updateAdminUI();
        } else {
            loginError.style.display = 'block';
            adminPasswordInput.value = '';
            adminPasswordInput.focus();
            // Shake animation
            const modalEl = loginModal.querySelector('.modal');
            modalEl.style.animation = 'none';
            setTimeout(() => {
                modalEl.style.animation = 'shake 0.4s ease';
            }, 10);
        }
    }

    if (btnLoginSubmit) {
        btnLoginSubmit.addEventListener('click', handleLogin);
    }
    if (adminPasswordInput) {
        adminPasswordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
    }

    // Logout
    if (btnAdminLogout) {
        btnAdminLogout.addEventListener('click', () => {
            isAdmin = false;
            sessionStorage.removeItem('portfolio_admin');
            updateAdminUI();
        });
    }

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

    function saveAssignmentsData(assignments) {
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

    function addFileEntry(name, url) {
        name = name || '';
        url = url || '';
        const entry = document.createElement('div');
        entry.className = 'file-entry';
        entry.innerHTML =
            '<input type="text" class="entry-name" placeholder="Nama file / deskripsi" value="' + escapeHtml(name) + '">' +
            '<input type="text" class="entry-url" placeholder="Link Google Drive / URL" value="' + escapeHtml(url) + '">' +
            '<button type="button" class="btn-remove-entry" title="Hapus"><i class="fas fa-times"></i></button>';
        entry.querySelector('.btn-remove-entry').addEventListener('click', function() {
            entry.remove();
        });
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
        var assignments = getAssignments();
        var assignment = null;
        for (var i = 0; i < assignments.length; i++) {
            if (assignments[i].id === id) { assignment = assignments[i]; break; }
        }
        if (!assignment) return;

        modalTitle.textContent = 'Edit Tugas';
        editIdInput.value = id;
        document.getElementById('assignmentName').value = assignment.name;
        document.getElementById('assignmentSubject').value = assignment.subject || '';
        fileEntriesContainer.innerHTML = '';

        if (assignment.files && assignment.files.length > 0) {
            for (var j = 0; j < assignment.files.length; j++) {
                addFileEntry(assignment.files[j].name, assignment.files[j].url);
            }
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
        var name = document.getElementById('assignmentName').value.trim();
        var subject = document.getElementById('assignmentSubject').value.trim();
        var editId = editIdInput.value;

        if (!name) {
            var nameInput = document.getElementById('assignmentName');
            nameInput.focus();
            nameInput.style.borderColor = '#dc2626';
            setTimeout(function() { nameInput.style.borderColor = ''; }, 2000);
            return;
        }

        var entries = fileEntriesContainer.querySelectorAll('.file-entry');
        var files = [];
        entries.forEach(function(entry) {
            var entryName = entry.querySelector('.entry-name').value.trim();
            var entryUrl = entry.querySelector('.entry-url').value.trim();
            if (entryName || entryUrl) {
                files.push({
                    name: entryName || 'File',
                    url: entryUrl,
                    type: entryUrl ? detectFileType(entryUrl) : 'file'
                });
            }
        });

        var assignments = getAssignments();

        if (editId) {
            for (var i = 0; i < assignments.length; i++) {
                if (assignments[i].id === editId) {
                    assignments[i].name = name;
                    assignments[i].subject = subject;
                    assignments[i].files = files;
                    assignments[i].updatedAt = new Date().toISOString();
                    break;
                }
            }
        } else {
            assignments.unshift({
                id: 'asg_' + Date.now(),
                name: name,
                subject: subject,
                files: files,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }

        saveAssignmentsData(assignments);
        closeAssignmentModal();
        renderAssignments();
    }

    function deleteAssignment(id) {
        if (!isAdmin) return;
        if (!confirm('Yakin ingin menghapus tugas ini?')) return;
        var assignments = getAssignments().filter(function(a) { return a.id !== id; });
        saveAssignmentsData(assignments);
        renderAssignments();
    }

    function renderAssignments() {
        var assignments = getAssignments();

        if (assignments.length === 0) {
            var emptyHint = isAdmin
                ? '<p class="hint">Klik "Tambah Tugas" untuk menambahkan tugas kuliah</p>'
                : '<p class="hint">Belum ada tugas yang ditambahkan</p>';
            assignmentsList.innerHTML =
                '<div class="assignment-empty">' +
                    '<i class="fas fa-book-open"></i>' +
                    '<p>Belum ada tugas</p>' +
                    emptyHint +
                '</div>';
            return;
        }

        var html = '';
        for (var i = 0; i < assignments.length; i++) {
            var a = assignments[i];
            html += '<div class="assignment-card" data-id="' + a.id + '">';
            html += '<div class="assignment-card-header">';
            html += '<h4><i class="fas fa-book"></i> ' + escapeHtml(a.name) + '</h4>';
            if (isAdmin) {
                html += '<div class="assignment-actions">';
                html += '<button class="btn-edit" title="Edit" data-edit-id="' + a.id + '"><i class="fas fa-pen"></i></button>';
                html += '<button class="btn-delete" title="Hapus" data-delete-id="' + a.id + '"><i class="fas fa-trash"></i></button>';
                html += '</div>';
            }
            html += '</div>';
            if (a.subject) {
                html += '<div class="assignment-meta"><i class="fas fa-graduation-cap"></i> ' + escapeHtml(a.subject) + '</div>';
            }
            html += '<div class="assignment-meta"><i class="fas fa-clock"></i> ' + formatDate(a.updatedAt || a.createdAt) + '</div>';
            if (a.files && a.files.length > 0) {
                html += '<div class="assignment-files">';
                for (var j = 0; j < a.files.length; j++) {
                    var f = a.files[j];
                    if (f.url) {
                        html += '<a href="' + escapeHtml(f.url) + '" class="assignment-file" target="_blank" rel="noopener">';
                        html += '<i class="' + getFileIcon(f.type) + '"></i>';
                        html += '<span class="file-name">' + escapeHtml(f.name) + '</span>';
                        html += '<span class="file-type">' + f.type + '</span>';
                        html += '</a>';
                    } else {
                        html += '<div class="assignment-file">';
                        html += '<i class="' + getFileIcon('file') + '"></i>';
                        html += '<span class="file-name">' + escapeHtml(f.name) + '</span>';
                        html += '<span class="file-type">file</span>';
                        html += '</div>';
                    }
                }
                html += '</div>';
            }
            html += '</div>';
        }
        assignmentsList.innerHTML = html;

        // Attach edit/delete event listeners via delegation
        var editBtns = assignmentsList.querySelectorAll('.btn-edit[data-edit-id]');
        editBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                openEditModal(btn.getAttribute('data-edit-id'));
            });
        });
        var deleteBtns = assignmentsList.querySelectorAll('.btn-delete[data-delete-id]');
        deleteBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                deleteAssignment(btn.getAttribute('data-delete-id'));
            });
        });
    }

    // Event listeners for assignment modal
    if (btnAdd) {
        btnAdd.addEventListener('click', function() {
            openAddModal();
        });
    }
    if (btnCancel) {
        btnCancel.addEventListener('click', closeAssignmentModal);
    }
    if (btnSave) {
        btnSave.addEventListener('click', function() {
            saveAssignment();
        });
    }
    if (btnAddEntry) {
        btnAddEntry.addEventListener('click', function() {
            addFileEntry();
        });
    }

    if (assignmentModal) {
        assignmentModal.addEventListener('click', function(e) {
            if (e.target === assignmentModal) closeAssignmentModal();
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (assignmentModal && assignmentModal.classList.contains('active')) closeAssignmentModal();
            if (loginModal && loginModal.classList.contains('active')) closeLoginModal();
        }
    });

    // Initial render
    renderAssignments();
});

// Shake animation for login error
(function() {
    var shakeStyle = document.createElement('style');
    shakeStyle.textContent =
        '@keyframes shake {' +
            '0%, 100% { transform: translateX(0); }' +
            '20% { transform: translateX(-10px); }' +
            '40% { transform: translateX(10px); }' +
            '60% { transform: translateX(-6px); }' +
            '80% { transform: translateX(6px); }' +
        '}';
    document.head.appendChild(shakeStyle);
})();
