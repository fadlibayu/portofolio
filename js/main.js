// ========================================
// Fadli Portfolio - Main Script v3
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('[Portfolio] Script loaded successfully');

    // ---- DOM Elements ----
    var navItems = document.querySelectorAll('.nav-item');
    var sections = document.querySelectorAll('.section');
    var themeToggle = document.getElementById('themeToggle');
    var profileImg = document.getElementById('profileImg');

    // Admin elements
    var btnAdminLogin = document.getElementById('btnAdminLogin');
    var btnAdminLogout = document.getElementById('btnAdminLogout');
    var loginModal = document.getElementById('loginModal');
    var btnLoginCancel = document.getElementById('btnLoginCancel');
    var btnLoginSubmit = document.getElementById('btnLoginSubmit');
    var adminPasswordInput = document.getElementById('adminPassword');
    var loginError = document.getElementById('loginError');
    var togglePasswordBtn = document.getElementById('togglePassword');

    // Assignment elements
    var assignmentModal = document.getElementById('assignmentModal');
    var btnAddAssignment = document.getElementById('btnAddAssignment');
    var btnCancel = document.getElementById('btnCancel');
    var btnSave = document.getElementById('btnSave');
    var btnAddEntry = document.getElementById('btnAddEntry');
    var fileEntriesContainer = document.getElementById('fileEntries');
    var assignmentsList = document.getElementById('assignmentsList');
    var modalTitle = document.getElementById('modalTitle');
    var editIdInput = document.getElementById('editId');

    console.log('[Portfolio] DOM elements:', {
        btnAddAssignment: !!btnAddAssignment,
        assignmentModal: !!assignmentModal,
        loginModal: !!loginModal,
        btnAdminLogin: !!btnAdminLogin
    });

    // ========================================
    // NAVIGATION
    // ========================================
    navItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            var targetSection = item.getAttribute('data-section');
            navItems.forEach(function(nav) { nav.classList.remove('active'); });
            item.classList.add('active');
            sections.forEach(function(section) {
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
    // DARK MODE
    // ========================================
    var themeIcon = themeToggle.querySelector('i');
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
    }
    themeToggle.addEventListener('click', function() {
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeIcon.className = 'fas fa-moon';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.className = 'fas fa-sun';
        }
    });

    // ========================================
    // SKILL BARS
    // ========================================
    function animateSkillBars() {
        document.querySelectorAll('.skill-fill').forEach(function(fill) {
            var w = fill.style.width;
            fill.style.width = '0%';
            setTimeout(function() { fill.style.width = w; }, 100);
        });
    }

    // ========================================
    // PROFILE FALLBACK
    // ========================================
    if (profileImg) {
        profileImg.addEventListener('error', function() {
            profileImg.src = 'data:image/svg+xml,' + encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#e0e0e0"/><text x="100" y="110" text-anchor="middle" fill="#888" font-size="48">F</text></svg>'
            );
        });
    }

    // ========================================
    // ENTRANCE ANIMATION
    // ========================================
    var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.service-card, .project-card, .timeline-item').forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        obs.observe(el);
    });
    var activeSec = document.querySelector('.section.active');
    if (activeSec) {
        activeSec.querySelectorAll('.service-card, .project-card, .timeline-item').forEach(function(el) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }

    // ========================================
    // ADMIN SYSTEM
    // ========================================
    var ADMIN_PASSWORD = 'fadli2026';
    var isAdmin = sessionStorage.getItem('portfolio_admin') === 'yes';
    console.log('[Portfolio] isAdmin on load:', isAdmin);

    function showAdminUI() {
        console.log('[Portfolio] showAdminUI called, isAdmin:', isAdmin);
        // Show/hide admin buttons
        if (btnAddAssignment) btnAddAssignment.style.display = isAdmin ? 'flex' : 'none';
        if (btnAdminLogout) btnAdminLogout.style.display = isAdmin ? 'flex' : 'none';
        if (btnAdminLogin) btnAdminLogin.style.display = isAdmin ? 'none' : 'flex';
    }

    // LOGIN MODAL
    if (btnAdminLogin) {
        btnAdminLogin.addEventListener('click', function() {
            console.log('[Portfolio] Login button clicked');
            adminPasswordInput.value = '';
            loginError.style.display = 'none';
            loginModal.classList.add('active');
            setTimeout(function() { adminPasswordInput.focus(); }, 150);
        });
    }

    function closeLogin() {
        loginModal.classList.remove('active');
        adminPasswordInput.value = '';
        loginError.style.display = 'none';
    }

    if (btnLoginCancel) btnLoginCancel.addEventListener('click', closeLogin);
    if (loginModal) {
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) closeLogin();
        });
    }

    // Password visibility toggle
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            var isPassword = adminPasswordInput.type === 'password';
            adminPasswordInput.type = isPassword ? 'text' : 'password';
            togglePasswordBtn.querySelector('i').className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
        });
    }

    // Handle login
    function doLogin() {
        var pw = adminPasswordInput.value;
        console.log('[Portfolio] Login attempt');
        if (!pw) { adminPasswordInput.focus(); return; }

        if (pw === ADMIN_PASSWORD) {
            console.log('[Portfolio] Login SUCCESS');
            isAdmin = true;
            sessionStorage.setItem('portfolio_admin', 'yes');
            closeLogin();
            showAdminUI();
            renderAssignments();
        } else {
            console.log('[Portfolio] Login FAILED');
            loginError.style.display = 'block';
            adminPasswordInput.value = '';
            adminPasswordInput.focus();
        }
    }

    if (btnLoginSubmit) btnLoginSubmit.addEventListener('click', doLogin);
    if (adminPasswordInput) {
        adminPasswordInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') doLogin();
        });
    }

    // Handle logout
    if (btnAdminLogout) {
        btnAdminLogout.addEventListener('click', function() {
            console.log('[Portfolio] Logout');
            isAdmin = false;
            sessionStorage.removeItem('portfolio_admin');
            showAdminUI();
            renderAssignments();
        });
    }

    // Init admin UI
    showAdminUI();

    // ========================================
    // ASSIGNMENT CRUD
    // ========================================
    var STORAGE_KEY = 'portfolio_assignments';

    function getAssignments() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch (e) { return []; }
    }

    function storeAssignments(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function escapeHtml(str) {
        var d = document.createElement('div');
        d.textContent = str || '';
        return d.innerHTML;
    }

    function detectType(url) {
        var l = (url || '').toLowerCase();
        if (l.indexOf('drive.google.com') !== -1 || l.indexOf('docs.google.com') !== -1) return 'gdrive';
        if (l.indexOf('github.com') !== -1) return 'github';
        if (l.indexOf('.pdf') !== -1) return 'pdf';
        if (l.indexOf('.doc') !== -1) return 'word';
        if (l.indexOf('.ppt') !== -1) return 'ppt';
        if (l.indexOf('.xls') !== -1) return 'excel';
        return 'link';
    }

    function fileIcon(type) {
        var map = {
            gdrive: 'fab fa-google-drive', github: 'fab fa-github',
            pdf: 'fas fa-file-pdf', word: 'fas fa-file-word',
            ppt: 'fas fa-file-powerpoint', excel: 'fas fa-file-excel',
            link: 'fas fa-link', file: 'fas fa-file'
        };
        return map[type] || map.link;
    }

    function fmtDate(d) {
        return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    // Add file entry row inside modal
    function addFileEntry(name, url) {
        var row = document.createElement('div');
        row.className = 'file-entry';
        var inp1 = document.createElement('input');
        inp1.type = 'text';
        inp1.className = 'entry-name';
        inp1.placeholder = 'Nama file / deskripsi';
        inp1.value = name || '';
        var inp2 = document.createElement('input');
        inp2.type = 'text';
        inp2.className = 'entry-url';
        inp2.placeholder = 'Link Google Drive / URL';
        inp2.value = url || '';
        var btnRm = document.createElement('button');
        btnRm.type = 'button';
        btnRm.className = 'btn-remove-entry';
        btnRm.title = 'Hapus';
        btnRm.innerHTML = '<i class="fas fa-times"></i>';
        btnRm.addEventListener('click', function() { row.remove(); });
        row.appendChild(inp1);
        row.appendChild(inp2);
        row.appendChild(btnRm);
        fileEntriesContainer.appendChild(row);
    }

    // OPEN ADD MODAL
    function openAddModal() {
        console.log('[Portfolio] openAddModal called, isAdmin:', isAdmin);
        if (!isAdmin) {
            console.log('[Portfolio] Not admin, returning');
            return;
        }
        modalTitle.textContent = 'Tambah Tugas';
        editIdInput.value = '';
        document.getElementById('assignmentName').value = '';
        document.getElementById('assignmentSubject').value = '';
        fileEntriesContainer.innerHTML = '';
        addFileEntry('', '');
        console.log('[Portfolio] Opening assignment modal');
        assignmentModal.classList.add('active');
        console.log('[Portfolio] Modal classes:', assignmentModal.className);
    }

    // OPEN EDIT MODAL
    function openEditModal(id) {
        if (!isAdmin) return;
        var list = getAssignments();
        var item = null;
        for (var i = 0; i < list.length; i++) {
            if (list[i].id === id) { item = list[i]; break; }
        }
        if (!item) return;
        modalTitle.textContent = 'Edit Tugas';
        editIdInput.value = id;
        document.getElementById('assignmentName').value = item.name;
        document.getElementById('assignmentSubject').value = item.subject || '';
        fileEntriesContainer.innerHTML = '';
        if (item.files && item.files.length) {
            for (var j = 0; j < item.files.length; j++) {
                addFileEntry(item.files[j].name, item.files[j].url);
            }
        } else {
            addFileEntry('', '');
        }
        assignmentModal.classList.add('active');
    }

    function closeAssignmentModal() {
        assignmentModal.classList.remove('active');
    }

    // SAVE
    function saveAssignment() {
        if (!isAdmin) return;
        var name = document.getElementById('assignmentName').value.trim();
        var subject = document.getElementById('assignmentSubject').value.trim();
        var editId = editIdInput.value;

        if (!name) {
            var ni = document.getElementById('assignmentName');
            ni.focus();
            ni.style.borderColor = '#dc2626';
            setTimeout(function() { ni.style.borderColor = ''; }, 2000);
            return;
        }

        var rows = fileEntriesContainer.querySelectorAll('.file-entry');
        var files = [];
        rows.forEach(function(row) {
            var n = row.querySelector('.entry-name').value.trim();
            var u = row.querySelector('.entry-url').value.trim();
            if (n || u) {
                files.push({ name: n || 'File', url: u, type: u ? detectType(u) : 'file' });
            }
        });

        var all = getAssignments();
        if (editId) {
            for (var i = 0; i < all.length; i++) {
                if (all[i].id === editId) {
                    all[i].name = name;
                    all[i].subject = subject;
                    all[i].files = files;
                    all[i].updatedAt = new Date().toISOString();
                    break;
                }
            }
        } else {
            all.unshift({
                id: 'asg_' + Date.now(),
                name: name, subject: subject, files: files,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }

        storeAssignments(all);
        closeAssignmentModal();
        renderAssignments();
        console.log('[Portfolio] Assignment saved, total:', all.length);
    }

    // DELETE
    function deleteAssignment(id) {
        if (!isAdmin) return;
        if (!confirm('Yakin ingin menghapus tugas ini?')) return;
        var all = getAssignments().filter(function(a) { return a.id !== id; });
        storeAssignments(all);
        renderAssignments();
    }

    // RENDER
    function renderAssignments() {
        var all = getAssignments();
        console.log('[Portfolio] renderAssignments, count:', all.length, 'isAdmin:', isAdmin);

        if (!all.length) {
            assignmentsList.innerHTML =
                '<div class="assignment-empty">' +
                '<i class="fas fa-book-open"></i>' +
                '<p>Belum ada tugas</p>' +
                (isAdmin ? '<p class="hint">Klik "Tambah Tugas" untuk menambahkan tugas kuliah</p>' : '<p class="hint">Belum ada tugas yang ditambahkan</p>') +
                '</div>';
            return;
        }

        var html = '';
        for (var i = 0; i < all.length; i++) {
            var a = all[i];
            html += '<div class="assignment-card">';
            html += '<div class="assignment-card-header">';
            html += '<h4><i class="fas fa-book"></i> ' + escapeHtml(a.name) + '</h4>';
            if (isAdmin) {
                html += '<div class="assignment-actions">';
                html += '<button class="btn-edit" data-id="' + a.id + '" title="Edit"><i class="fas fa-pen"></i></button>';
                html += '<button class="btn-delete" data-id="' + a.id + '" title="Hapus"><i class="fas fa-trash"></i></button>';
                html += '</div>';
            }
            html += '</div>';
            if (a.subject) html += '<div class="assignment-meta"><i class="fas fa-graduation-cap"></i> ' + escapeHtml(a.subject) + '</div>';
            html += '<div class="assignment-meta"><i class="fas fa-clock"></i> ' + fmtDate(a.updatedAt || a.createdAt) + '</div>';
            if (a.files && a.files.length) {
                html += '<div class="assignment-files">';
                for (var j = 0; j < a.files.length; j++) {
                    var f = a.files[j];
                    if (f.url) {
                        html += '<a href="' + escapeHtml(f.url) + '" class="assignment-file" target="_blank" rel="noopener">';
                    } else {
                        html += '<div class="assignment-file">';
                    }
                    html += '<i class="' + fileIcon(f.type) + '"></i>';
                    html += '<span class="file-name">' + escapeHtml(f.name) + '</span>';
                    html += '<span class="file-type">' + (f.type || 'file') + '</span>';
                    html += f.url ? '</a>' : '</div>';
                }
                html += '</div>';
            }
            html += '</div>';
        }
        assignmentsList.innerHTML = html;

        // Attach edit & delete listeners
        assignmentsList.querySelectorAll('.btn-edit').forEach(function(btn) {
            btn.addEventListener('click', function() {
                openEditModal(btn.getAttribute('data-id'));
            });
        });
        assignmentsList.querySelectorAll('.btn-delete').forEach(function(btn) {
            btn.addEventListener('click', function() {
                deleteAssignment(btn.getAttribute('data-id'));
            });
        });
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================
    if (btnAddAssignment) {
        console.log('[Portfolio] Attaching click to btnAddAssignment');
        btnAddAssignment.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('[Portfolio] btnAddAssignment CLICKED');
            openAddModal();
        });
    }

    if (btnCancel) btnCancel.addEventListener('click', closeAssignmentModal);
    if (btnSave) btnSave.addEventListener('click', function() { saveAssignment(); });
    if (btnAddEntry) {
        btnAddEntry.addEventListener('click', function() {
            console.log('[Portfolio] Add file entry clicked');
            addFileEntry('', '');
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
            if (loginModal && loginModal.classList.contains('active')) closeLogin();
        }
    });

    // Initial render
    renderAssignments();
    console.log('[Portfolio] Initialization complete');
});
