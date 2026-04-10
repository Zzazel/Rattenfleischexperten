// Rattenfleischexperten - Gemeinsame Logik (Supabase Google OAuth Edition)

// --- KONFIGURATION ---
const SUPABASE_URL = 'https://lezkdohngzxvuszcwcuj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_KPIUCuONZw1laeyPpT4e_g_cwf06Fcb';
// ---------------------

// Initialize Supabase Client
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Button Logic
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    themeToggle.textContent = currentTheme === 'light' ? 'NACHT' : 'TAG';
    
    themeToggle.addEventListener('click', () => {
      const theme = document.documentElement.getAttribute('data-theme');
      const newTheme = theme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      themeToggle.textContent = newTheme === 'light' ? 'NACHT' : 'TAG';
    });
  }

  // Protokolle dynamisch laden
  const reviewsContainer = document.getElementById('reviews-list');
  const lastAuditDisplay = document.getElementById('last-audit-date');
  
  if (reviewsContainer || lastAuditDisplay) {
    loadReviewsFromSupabase();
    
    if (reviewsContainer) {
      document.getElementById('sort-score')?.addEventListener('click', () => {
        currentReviews.sort((a, b) => calculateTotalScore(b) - calculateTotalScore(a));
        renderReviews(currentReviews);
      });
      
      document.getElementById('sort-roi')?.addEventListener('click', () => {
        currentReviews.sort((a, b) => {
          const roiA = calculateTotalScore(a) / (a.cost || 1);
          const roiB = calculateTotalScore(b) / (b.cost || 1);
          return roiB - roiA;
        });
        renderReviews(currentReviews);
      });
    }
  }

  // Secret Admin Access (Click rat in footer 3 times)
  let ratClicks = 0;
  const footerDivs = document.querySelectorAll('footer div');
  const ratContainer = Array.from(footerDivs).find(div => div.innerText.includes('🐀'));
  
  if (ratContainer) {
    ratContainer.style.cursor = 'help';
    ratContainer.addEventListener('click', (e) => {
      ratClicks++;
      if (ratClicks >= 3) {
        ratClicks = 0;
        startRatEscape(e.target);
      }
    });
  }

  // Initial Ratometer State
  window.updateRatometer();
  
  // Listen for Auth Changes to update Ratometer in real-time
  window.supabaseClient.auth.onAuthStateChange(() => {
    window.updateRatometer();
  });
});

window.loadTimelineData = async function() {
    try {
        const { data, error } = await window.supabaseClient
            .from('reviews')
            .select('*')
            .not('visit_date', 'is', null)
            .order('visit_date', { ascending: true });

        if (error) throw error;
        if (!data || data.length === 0) return { lastPast: [], nextOne: [], following: [] };

        const now = new Date();
        // Just compare date strings for simplicity and reliability
        const todayStr = now.toISOString().split('T')[0];

        const past = data.filter(r => r.visit_date < todayStr);
        const upcoming = data.filter(r => r.visit_date >= todayStr);

        // Group 1: All past reviews (ordered chronological by query)
        const lastPast = past;
        
        // Group 2: Next upcoming (first item in upcoming list)
        const nextOne = upcoming.length > 0 ? [upcoming[0]] : [];
        
        // Group 3: Following upcoming
        const following = upcoming.length > 1 ? upcoming.slice(1) : [];

        return {
            lastPast: lastPast.map(r => ({ ...r, status: 'past' })),
            nextOne: nextOne.map(r => ({ ...r, status: 'next' })),
            following: following.map(r => ({ ...r, status: 'upcoming' }))
        };
    } catch (err) {
        console.error("Timeline error:", err);
        return { lastPast: [], nextOne: [], following: [] };
    }
};

window.updateRatometer = async function() {
    const fill = document.querySelector('.ratometer-fill');
    if (!fill) return;

    const { data: { session } } = await window.supabaseClient.auth.getSession();
    const isAdminPage = window.location.pathname.includes('admin.html');

    if (!isAdminPage) {
        fill.dataset.state = 'default';
    } else if (!session) {
        fill.dataset.state = 'admin';
    } else {
        fill.dataset.state = 'logged-in';
    }
};

function startRatEscape(originalRat) {
  const holeX = 20;
  const holeY = 20;

  const hole = document.createElement('div');
  hole.className = 'mouse-hole';
  hole.style.left = holeX + 'px';
  hole.style.top = holeY + 'px';
  hole.style.display = 'block';
  document.body.appendChild(hole);

  const rect = originalRat.getBoundingClientRect();
  const rat = document.createElement('div');
  rat.className = 'rat-actor';
  rat.textContent = '🐀';
  rat.style.left = rect.left + 'px';
  rat.style.top = rect.top + 'px'; 
  document.body.appendChild(rat);

  const overlay = document.createElement('div');
  overlay.id = 'tunnel-overlay';
  overlay.style.clipPath = `circle(0% at ${holeX + 30}px ${holeY + 15}px)`;
  document.body.appendChild(overlay);

  originalRat.style.visibility = 'hidden';

  setTimeout(() => {
    rat.style.left = (holeX + 10) + 'px';
    rat.style.top = (holeY + 5) + 'px';
    rat.style.transform = 'scale(0.2) rotate(-45deg)';
    rat.style.opacity = '0';
  }, 50);

  setTimeout(() => {
    overlay.style.clipPath = `circle(150% at ${holeX + 30}px ${holeY + 15}px)`;
  }, 1300);

  setTimeout(() => {
    window.location.href = 'admin.html';
  }, 2500);
}

let currentReviews = [];

function calculateTotalScore(review) {
  return (0.5 * review.essen + 0.25 * review.ambiente + 0.25 * review.service).toFixed(1);
}

async function loadReviewsFromSupabase() {
  const container = document.getElementById('reviews-list');
  
  try {
    const { data, error } = await window.supabaseClient
      .from('reviews')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;

    currentReviews = data;
    
    const lastAuditDisplay = document.getElementById('last-audit-date');
    if (lastAuditDisplay && currentReviews.length > 0) {
      const latestReview = currentReviews[0];
      const date = new Date(latestReview.created_at);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      lastAuditDisplay.textContent = date.toLocaleDateString('de-DE', options).toUpperCase();
    } else if (lastAuditDisplay) {
      lastAuditDisplay.textContent = 'NOCH KEINE DATEN';
    }

    if (container) renderReviews(currentReviews);
  } catch (error) {
    console.error("Ladefehler:", error);
    if (container) {
        container.innerHTML = `<p class="mono">Fehler beim Laden: ${error.message}</p>`;
    }
  }
}

function renderReviews(reviews) {
  const container = document.getElementById('reviews-list');
  if (!container) return;

  if (reviews.length === 0) {
    container.innerHTML = '<p class="mono">Noch keine Protokolle vorhanden. Geh essen!</p>';
    return;
  }

  container.innerHTML = '';
  reviews.forEach(review => {
    const gesamt = calculateTotalScore(review);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem;">
        <div>
          <h3 style="font-size: 1.75rem; margin-bottom: 0.5rem; text-transform: uppercase;">${review.lokal}</h3>
          <div class="invest-tag">INVESTITION: ${review.cost || '??'} CHF</div>
        </div>
        <div class="audit-score-bubble">
          <div class="mono" style="font-size: 0.5rem; margin-bottom: 0.25rem;">Ψ_INDEX</div>
          <div style="font-size: 2.2rem; font-weight: 900; line-height: 1;">${gesamt}</div>
          <div class="mono" style="font-size: 1rem; margin-top: 0.25rem;">🐀</div>
        </div>
      </div>
      
      <div class="protocol-grid" style="margin-bottom: 2rem; border-top: 1.5px solid var(--border-color); border-bottom: 1.5px solid var(--border-color); padding: 1.5rem 0;">
        <div style="text-align: center;"><div class="mono subtle" style="font-size: 0.6rem; margin-bottom: 0.5rem;">MATERIE (50%)</div><div style="font-weight: 700; font-size: 1.1rem;">${review.essen}/5 🐀</div></div>
        <div style="text-align: center;"><div class="mono subtle" style="font-size: 0.6rem; margin-bottom: 0.5rem;">INTERAKTION (25%)</div><div style="font-weight: 700; font-size: 1.1rem;">${review.service}/5 🐀</div></div>
        <div style="text-align: center;"><div class="mono subtle" style="font-size: 0.6rem; margin-bottom: 0.5rem;">RESONANZ (25%)</div><div style="font-weight: 700; font-size: 1.1rem;">${review.ambiente}/5 🐀</div></div>
      </div>

      ${review.maps_url ? `
        <div style="margin-bottom: 2rem; height: 250px; border: 2px solid var(--border-color);">
          <iframe 
            src="${review.maps_url}" 
            width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      ` : `
        <div class="mono subtle" style="margin-bottom: 2rem; padding: 2rem; border: 2px dashed var(--border-color); text-align: center; font-size: 0.7rem;">
          [GEOLOKATION_NICHT_VERFÜGBAR_ODER_GEHEIM]
        </div>
      `}

      <div class="review-note">
        ${review.notitz}
      </div>
      
      <div class="rat-mark">🐀</div>
    `;
    container.appendChild(card);
  });
}
