// ========================================
// Fadli Portfolio - Main Script v4
// ========================================

document.addEventListener('DOMContentLoaded', function() {

    // ---- DOM Elements ----
    var navItems = document.querySelectorAll('.nav-item');
    var sections = document.querySelectorAll('.section');
    var themeToggle = document.getElementById('themeToggle');
    var profileImg = document.getElementById('profileImg');

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
    // RENDER ASSIGNMENTS FROM DATA FILE
    // ========================================
    var grid = document.getElementById('assignmentGrid');

    function escapeHtml(str) {
        var d = document.createElement('div');
        d.textContent = str || '';
        return d.innerHTML;
    }

    function getBadgeClass(type) {
        var t = (type || '').toLowerCase();
        if (t === 'video') return 'asg-badge-video';
        if (t === 'pdf') return 'asg-badge-pdf';
        return 'asg-badge-doc';
    }

    function renderAssignments() {
        if (!grid) return;

        // Read from global ASSIGNMENTS_DATA defined in assignments-data.js
        var data = (typeof ASSIGNMENTS_DATA !== 'undefined') ? ASSIGNMENTS_DATA : [];

        if (!data.length) {
            grid.innerHTML =
                '<div class="assignment-empty">' +
                '<i class="fas fa-book-open"></i>' +
                '<p>Belum ada tugas</p>' +
                '</div>';
            return;
        }

        var html = '';
        for (var i = 0; i < data.length; i++) {
            var a = data[i];
            html += '<div class="asg-card">';

            // Header with number and badges
            html += '<div class="asg-card-header">';
            html += '<div class="asg-card-number">' + escapeHtml(a.number) + '</div>';
            html += '<div class="asg-card-badges">';
            html += '<span class="asg-badge ' + getBadgeClass(a.type) + '">' + escapeHtml(a.type) + '</span>';
            html += '<span class="asg-badge-label">' + escapeHtml(a.label) + '</span>';
            html += '</div>';
            html += '</div>';

            // Body with title, description, link
            html += '<div class="asg-card-body">';
            html += '<h4 class="asg-card-title">' + escapeHtml(a.title) + '</h4>';
            html += '<p class="asg-card-desc">' + escapeHtml(a.description) + '</p>';
            if (a.driveUrl) {
                html += '<a href="' + escapeHtml(a.driveUrl) + '" class="asg-card-link" target="_blank" rel="noopener">';
                html += '<i class="fas fa-external-link-alt"></i> Open in Google Drive';
                html += '</a>';
            }
            html += '</div>';

            html += '</div>';
        }

        grid.innerHTML = html;

        // Animate cards entrance
        grid.querySelectorAll('.asg-card').forEach(function(card, idx) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            setTimeout(function() {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 80 * idx);
        });
    }

    // Render on load
    renderAssignments();
});
