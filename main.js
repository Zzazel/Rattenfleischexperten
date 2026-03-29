// Rattenfleischexperten - Gemeinsame Logik (Static Supabase Edition)

// --- KONFIGURATION (Hier deine Daten eintragen!) ---
const SUPABASE_URL = 'https://lezkdohngzxvuszcwcuj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_KPIUCuONZw1laeyPpT4e_g_cwf06Fcb';
// ---------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  // Theme-Handhabung
  const theme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme);

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.textContent = theme === 'light' ? 'NACHT' : 'TAG';
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      themeToggle.textContent = newTheme === 'light' ? 'NACHT' : 'TAG';
    });
  }

  // Protokolle dynamisch laden
  const reviewsContainer = document.getElementById('reviews-list');
  if (reviewsContainer) {
    loadReviewsFromSupabase();
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

    const reviews = await response.json();
    console.log(`${reviews.length} Protokolle geladen:`, reviews);
    
    if (reviews.length === 0) {
      container.innerHTML = '<p class="mono">Noch keine Protokolle vorhanden. Geh essen!</p>';
      return;
    }

    container.innerHTML = ''; // Leeren
    reviews.forEach(review => {
      const gesamt = ((review.essen + review.service + review.ambiente) / 3).toFixed(1);
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
          <div>
            <h3 style="font-size: 1.25rem;">${review.lokal}</h3>
            <p class="subtle mono">Lokal Audit • ID: ${review.id}</p>
          </div>
          <div class="mono" style="text-align: right;">
            <div class="subtle" style="font-size: 0.6rem; margin-bottom: 0.2rem;">AUDIT-SCORE</div>
            <div style="font-size: 2rem; font-weight: 900; color: var(--primary-color); line-height: 1;">
              ${gesamt} <span style="font-size: 1.2rem;">🐀</span>
            </div>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-bottom: 1rem; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); padding: 0.75rem 0;">
          <div style="text-align: center;"><div class="subtle mono" style="font-size: 0.65rem;">ESSEN</div><div class="mono" style="font-weight: bold;">${review.essen}/5 🐀</div></div>
          <div style="text-align: center;"><div class="subtle mono" style="font-size: 0.65rem;">SERVICE</div><div class="mono" style="font-weight: bold;">${review.service}/5 🐀</div></div>
          <div style="text-align: center;"><div class="subtle mono" style="font-size: 0.65rem;">AMBIENTE</div><div class="mono" style="font-weight: bold;">${review.ambiente}/5 🐀</div></div>
        </div>
        <div style="padding: 0.75rem; background: var(--secondary-color); border-radius: 4px; font-size: 0.9rem; border-left: 2px solid var(--primary-color);">
          <span class="mono subtle" style="font-size: 0.7rem; display: block; margin-bottom: 0.25rem;">EXPERTEN-NOTITZ:</span>
          ${review.notitz}
        </div>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Ladefehler:", error);
    container.innerHTML = `<p class="mono">Fehler beim Laden: ${error.message}<br>Prüfe die Browser-Konsole (F12) für Details.</p>`;
  }
}

