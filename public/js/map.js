// ============================================
// Rescue Map — Leaflet with MarkerCluster
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const mapEl = document.getElementById('rescueMap');
  if (!mapEl) return;

  // ── Initialize Map ─────────────────────────
  const map = L.map('rescueMap', {
    center: [20.5937, 78.9629], // Center of India
    zoom: 5,
    zoomControl: true,
    scrollWheelZoom: true,
  });

  // ── Tile Layer ─────────────────────────────
  // Use CartoDB dark tiles if dark mode is on, otherwise standard OSM
  const theme = document.documentElement.getAttribute('data-theme');
  const tileUrl =
    theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  L.tileLayer(tileUrl, {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  // ── Custom Marker Icons ────────────────────
  function createIcon(color) {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: 28px; height: 28px;
        background: ${color};
        border: 3px solid #fff;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -16],
    });
  }

  const icons = {
    pending: createIcon('#f59e0b'),
    'in-progress': createIcon('#3b82f6'),
    rescued: createIcon('#16a34a'),
  };

  const urgentIcon = createIcon('#ef4444');

  // ── Marker Cluster Group ───────────────────
  const markers = L.markerClusterGroup({
    maxClusterRadius: 50,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    iconCreateFunction: (cluster) => {
      const count = cluster.getChildCount();
      let size = 'small';
      if (count > 10) size = 'medium';
      if (count > 50) size = 'large';
      return L.divIcon({
        html: `<div class="cluster-icon cluster-${size}"><span>${count}</span></div>`,
        className: 'marker-cluster-custom',
        iconSize: L.point(40, 40),
      });
    },
  });

  // ── Fetch Reports & Add Markers ────────────
  fetch('/admin/api/map-data')
    .then((res) => res.json())
    .then((data) => {
      if (!data.success || !data.data.length) {
        console.log('No map data available.');
        return;
      }

      const bounds = [];

      data.data.forEach((report) => {
        const lat = report.latitude;
        const lng = report.longitude;
        if (!lat || !lng) return;

        bounds.push([lat, lng]);

        const icon = report.priority === 'urgent' ? urgentIcon : icons[report.status] || icons.pending;

        const marker = L.marker([lat, lng], { icon });

        // Build popup HTML
        const photoHtml = report.imageUrl
          ? `<img src="${report.imageUrl}" alt="${report.animalName}" />`
          : '';

        const date = new Date(report.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        const popup = `
          <div class="map-popup">
            <h3>${escapeHtml(report.animalName)}</h3>
            ${photoHtml}
            <p><strong>Type:</strong> ${report.animalType}</p>
            <p><strong>Status:</strong> ${report.status}</p>
            <p><strong>Priority:</strong> ${report.priority}</p>
            <p>${escapeHtml(report.description.substring(0, 150))}${report.description.length > 150 ? '...' : ''}</p>
            <p><strong>Reported:</strong> ${date}</p>
          </div>
        `;

        marker.bindPopup(popup, { maxWidth: 280 });
        markers.addLayer(marker);
      });

      map.addLayer(markers);

      // Fit map to markers
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    })
    .catch((err) => {
      console.error('Failed to load map data:', err);
    });

  // ── Utility — escape HTML ──────────────────
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
});

// ── Cluster icon styles (injected) ───────────
const clusterStyle = document.createElement('style');
clusterStyle.textContent = `
  .marker-cluster-custom { background: transparent; }
  .cluster-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #fff;
    font-weight: 700;
    font-family: 'Inter', sans-serif;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  }
  .cluster-small {
    width: 36px; height: 36px;
    background: rgba(22, 163, 74, 0.8);
    font-size: 0.8rem;
  }
  .cluster-medium {
    width: 44px; height: 44px;
    background: rgba(245, 158, 11, 0.8);
    font-size: 0.9rem;
  }
  .cluster-large {
    width: 52px; height: 52px;
    background: rgba(239, 68, 68, 0.8);
    font-size: 1rem;
  }
`;
document.head.appendChild(clusterStyle);
