// Rattenfleischexperten - Gemeinsame Logik (Static Supabase Edition)

// --- KONFIGURATION (Hier deine Daten eintragen!) ---
const SUPABASE_URL = 'https://lezkdohngzxvuszcwcuj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_KPIUCuONZw1laeyPpT4e_g_cwf06Fcb';
// ---------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Button Logic (Initial state is set in <head> to prevent FOUC)
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
  if (reviewsContainer) {
    loadReviewsFromSupabase();
    
    // Sorting Event Listeners
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
});

function startRatEscape(originalRat) {
  // 1. Create Hole at Top-Left (ensure it is within viewport)
  const hole = document.createElement('div');
  hole.className = 'mouse-hole';
  document.body.appendChild(hole);

  const holeX = 10;
  const holeY = 10;
  
  hole.style.left = holeX + 'px';
  hole.style.top = holeY + 'px';
  hole.style.display = 'block';

  // 2. Create Running Rat Actor
  const rect = originalRat.getBoundingClientRect();
  const rat = document.createElement('div');
  rat.className = 'rat-actor';
  rat.textContent = '🐀';
  rat.style.left = rect.left + 'px';
  rat.style.top = (rect.top + window.scrollY) + 'px'; // Fix for scroll position
  document.body.appendChild(rat);

  // 3. Create Blackout Overlay
  const overlay = document.createElement('div');
  overlay.id = 'tunnel-overlay';
  document.body.appendChild(overlay);

  // Hide original
  originalRat.style.visibility = 'hidden';

  // 4. Animate Rat to Hole (Top-Left)
  setTimeout(() => {
    rat.style.left = (holeX + 5) + 'px';
    rat.style.top = (holeY + 5) + 'px';
    rat.style.transform = 'scale(0.5) rotate(-45deg)';
    rat.style.opacity = '0';
  }, 50);

  // 5. Start Blackout from Hole center (Top-Left)
  setTimeout(() => {
    overlay.style.clipPath = `circle(0% at ${holeX + 20}px ${holeY + 10}px)`;
    setTimeout(() => {
      overlay.style.clipPath = `circle(150% at ${holeX + 20}px ${holeY + 10}px)`;
    }, 50);
  }, 600);

  // 6. Redirect
  setTimeout(() => {
    window.location.href = 'admin.html';
  }, 1400);
}

let currentReviews = [];

function calculateTotalScore(review) {
  // Formula: 0.5 * food + 0.25 * ambience + 0.25 * service
  return (0.5 * review.essen + 0.25 * review.ambiente + 0.25 * review.service).toFixed(1);
}

async function loadReviewsFromSupabase() {
  const container = document.getElementById('reviews-list');
  console.log("Versuche Protokolle von Supabase zu laden...");

  if (SUPABASE_URL.includes('DEINE-URL')) {
    container.innerHTML = '<p class="mono">Datenbank nicht konfiguriert. Bitte Supabase-Daten in main.js eintragen!</p>';
    return;
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reviews?select=*&order=id.desc`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Supabase API Fehler:", errorText);
      throw new Error(`HTTP Fehler! Status: ${response.status}`);
    }

    currentReviews = await response.json();
    renderReviews(currentReviews);
  } catch (error) {
    console.error("Ladefehler:", error);
    container.innerHTML = `<p class="mono">Fehler beim Laden: ${error.message}<br>Prüfe die Browser-Konsole (F12) für Details.</p>`;
  }
}

function renderReviews(reviews) {
  const container = document.getElementById('reviews-list');
  if (!container) return;

  if (reviews.length === 0) {
    container.innerHTML = '<p class="mono">Noch keine Protokolle vorhanden. Geh essen!</p>';
    return;
  }

  container.innerHTML = ''; // Leeren
  reviews.forEach(review => {
    const gesamt = calculateTotalScore(review);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; gap: 1rem;">
        <div>
          <h3 style="font-size: 1.5rem; margin-bottom: 0.25rem;">${review.lokal}</h3>
          <div class="invest-tag">INVEST: ${review.cost || '??'} CHF</div>
          <p class="subtle mono" style="margin-top: 0.5rem; font-size: 0.7rem;">ID: ${review.id}</p>
        </div>
        <div class="audit-score-bubble">
          <div class="mono" style="font-size: 0.6rem;">SCORE</div>
          <div style="font-size: 1.8rem; font-weight: 900; line-height: 1;">${gesamt}</div>
          <div style="font-size: 0.8rem;">🐀</div>
        </div>
      </div>
      
      <div class="protocol-grid" style="margin-bottom: 1.5rem; border-top: 2px solid var(--border-color); border-bottom: 2px solid var(--border-color); padding: 1rem 0;">
        <div style="text-align: center;"><div class="subtle mono" style="font-size: 0.65rem;">ESSEN (50%)</div><div class="mono" style="font-weight: bold; font-size: 1.1rem;">${review.essen}/5</div></div>
        <div style="text-align: center;"><div class="subtle mono" style="font-size: 0.65rem;">SERVICE (25%)</div><div class="mono" style="font-weight: bold; font-size: 1.1rem;">${review.service}/5</div></div>
        <div style="text-align: center;"><div class="subtle mono" style="font-size: 0.65rem;">AMBIENTE (25%)</div><div class="mono" style="font-weight: bold; font-size: 1.1rem;">${review.ambiente}/5</div></div>
      </div>

      ${review.maps_url ? `
        <div style="margin-bottom: 1.5rem; border-radius: var(--nibble-radius); overflow: hidden; height: 160px; border: 3px solid var(--border-color); filter: grayscale(0.5) contrast(1.2);">
          <iframe 
            src="${review.maps_url}" 
            width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      ` : `
        <div class="mono subtle" style="margin-bottom: 1.5rem; height: 40px; border: 2px dashed var(--border-color); display: flex; align-items: center; justify-content: center; font-size: 0.7rem;">
          [GEOLOKATION_NICHT_VERFÜGBAR]
        </div>
      `}

      <div style="padding: 1rem; background: var(--secondary-color); border-radius: var(--nibble-radius); font-size: 1rem; border: 2px solid var(--border-color); position: relative;">
        <span class="mono" style="font-size: 0.7rem; position: absolute; top: -10px; left: 10px; background: var(--text-color); color: var(--bg-color); padding: 0 5px;">EXPERTEN-NOTITZ</span>
        ${review.notitz}
      </div>
    `;
    container.appendChild(card);
  });
}

