/* ==========================================================================
   NORTHSTAR PROPERTIES — INTERACTIVE APPLICATION LOGIC
   ========================================================================== */

const PROPERTIES = [
  {
    id: "ns-01",
    title: "The Aurelia Waterfront Villa",
    location: "Ikoyi, Lagos",
    type: "Waterfront",
    category: "Buy",
    price: 1250000,
    priceFormatted: "$1,250,000",
    priceSuffix: "",
    beds: 5,
    baths: 6,
    area: "680 sqm",
    year: 2025,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80",
    description:
      "Set along a tranquil lagoon frontage in Ikoyi, The Aurelia pairs warm limestone facades with double-height glazing, a private jetty, infinity lap pool, and bespoke chef's kitchen."
  },
  {
    id: "ns-02",
    title: "veridian Sky Penthouse",
    location: "Victoria Island, Lagos",
    type: "Penthouse",
    category: "Rent",
    price: 85000,
    priceFormatted: "$85,000",
    priceSuffix: "/ year",
    beds: 4,
    baths: 4,
    area: "410 sqm",
    year: 2024,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80",
    description:
      "Occupying the top two levels of an intimate boutique tower, this panoramic penthouse offers wrap-around landscaped terraces, private elevator access, and 24-hour concierge services."
  },
  {
    id: "ns-03",
    title: "Sovereign Crest Detached Villa",
    location: "Maitama, Abuja",
    type: "Villa",
    category: "Buy",
    price: 980000,
    priceFormatted: "$980,000",
    priceSuffix: "",
    beds: 6,
    baths: 7,
    area: "740 sqm",
    year: 2025,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    description:
      "Tucked inside a quiet diplomatic enclave in Maitama, Sovereign Crest showcases travertine courtyards, smart solar integration, a private cinema, and mature landscaped gardens."
  },
  {
    id: "ns-04",
    title: "Cedarwood Contemporary Duplex",
    location: "Lekki Phase 1, Lagos",
    type: "Duplex",
    category: "Buy",
    price: 420000,
    priceFormatted: "$420,000",
    priceSuffix: "",
    beds: 4,
    baths: 5,
    area: "365 sqm",
    year: 2024,
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1000&q=80",
    description:
      "Crafted with natural cedar accents and minimalist concrete planes, this detached residence balances bright open-plan entertaining spaces with serene private bedroom suites."
  },
  {
    id: "ns-05",
    title: "Asokoro Hillside Residence",
    location: "Asokoro, Abuja",
    type: "Villa",
    category: "Rent",
    price: 65000,
    priceFormatted: "$65,000",
    priceSuffix: "/ year",
    beds: 5,
    baths: 5,
    area: "520 sqm",
    year: 2024,
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1000&q=80",
    description:
      "Elevated above Abuja's rolling hills, this fully serviced residence features breezy verandas, manicured lawns, backup power infrastructure, and dedicated security quarters."
  },
  {
    id: "ns-06",
    title: "The Meridian Harbour Duplex",
    location: "Ikoyi, Lagos",
    type: "Waterfront",
    category: "Buy",
    price: 790000,
    priceFormatted: "$790,000",
    priceSuffix: "",
    beds: 4,
    baths: 5,
    area: "450 sqm",
    year: 2025,
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80",
    description:
      "A refined waterfront duplex combining acoustic privacy, Italian marble wet areas, custom oak millwork, and direct access to a private residents' promenade."
  }
];

// Normalize title casing for ID ns-02
PROPERTIES[1].title = "Veridian Sky Penthouse";

// Application State
const state = {
  category: "all",
  location: "all",
  type: "all",
  maxBudget: "all",
  savedIds: JSON.parse(localStorage.getItem("northstar_saved_properties") || "[]")
};

// DOM References
const propertyGrid = document.getElementById("property-grid");
const resultsCount = document.getElementById("results-count");
const emptyState = document.getElementById("empty-state");
const resetFiltersBtn = document.getElementById("reset-filters");
const emptyResetBtn = document.getElementById("empty-reset-btn");
const searchForm = document.getElementById("property-search-form");
const locationSelect = document.getElementById("filter-location");
const typeSelect = document.getElementById("filter-type");
const budgetSelect = document.getElementById("filter-budget");
const tabButtons = document.querySelectorAll(".tab-btn");
const savedCountBadge = document.getElementById("saved-count");

// Modals
const propertyModal = document.getElementById("property-modal");
const modalBody = document.getElementById("modal-body");
const closePropertyModalBtn = document.getElementById("close-property-modal");

const savedModal = document.getElementById("saved-modal");
const savedListBody = document.getElementById("saved-list-body");
const openSavedModalBtn = document.getElementById("open-saved-modal");
const closeSavedModalBtn = document.getElementById("close-saved-modal");

// Mobile Navigation
const navbar = document.getElementById("navbar");
const mobileToggle = document.getElementById("mobile-menu-toggle");
const navLinks = document.getElementById("nav-links");

// Formatters & Helpers
function saveFavoritesToStorage() {
  localStorage.setItem("northstar_saved_properties", JSON.stringify(state.savedIds));
  savedCountBadge.textContent = String(state.savedIds.length);
}

function isPropertySaved(id) {
  return state.savedIds.includes(id);
}

function toggleSaveProperty(id) {
  if (isPropertySaved(id)) {
    state.savedIds = state.savedIds.filter((item) => item !== id);
  } else {
    state.savedIds.push(id);
  }
  saveFavoritesToStorage();
  renderProperties();
  if (!savedModal.hidden) {
    renderSavedModal();
  }
}

function getFilteredProperties() {
  return PROPERTIES.filter((prop) => {
    const matchesCategory = state.category === "all" || prop.category === state.category;
    const matchesLocation = state.location === "all" || prop.location === state.location;
    const matchesType = state.type === "all" || prop.type === state.type;
    const matchesBudget =
      state.maxBudget === "all" || prop.price <= Number(state.maxBudget);

    return matchesCategory && matchesLocation && matchesType && matchesBudget;
  });
}

function hasActiveFilters() {
  return (
    state.category !== "all" ||
    state.location !== "all" ||
    state.type !== "all" ||
    state.maxBudget !== "all"
  );
}

function renderProperties() {
  const filtered = getFilteredProperties();
  propertyGrid.innerHTML = "";

  resetFiltersBtn.hidden = !hasActiveFilters();

  if (filtered.length === 0) {
    emptyState.hidden = false;
    resultsCount.textContent = "Showing 0 properties";
    return;
  }

  emptyState.hidden = true;
  resultsCount.textContent = `Showing ${filtered.length} ${
    filtered.length === 1 ? "curated property" : "curated properties"
  }`;

  filtered.forEach((prop) => {
    const saved = isPropertySaved(prop.id);
    const card = document.createElement("article");
    card.className = "property-card";
    card.innerHTML = `
      <div class="card-media">
        <img src="${prop.image}" alt="${prop.title} in ${prop.location}" loading="lazy" />
        <div class="card-badges">
          <span class="badge badge-status">${prop.category === "Buy" ? "For Sale" : "For Lease"}</span>
          <span class="badge badge-type">${prop.type}</span>
        </div>
        <button
          type="button"
          class="fav-btn ${saved ? "saved" : ""}"
          data-save-id="${prop.id}"
          aria-label="${saved ? "Remove from saved properties" : "Save property to shortlist"}"
          aria-pressed="${saved}"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
      <div class="card-body">
        <div class="card-price">${prop.priceFormatted} <span>${prop.priceSuffix}</span></div>
        <h3 class="card-title">${prop.title}</h3>
        <p class="card-location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          ${prop.location}
        </p>
        <div class="card-specs">
          <span>${prop.beds} Beds</span>
          <span>${prop.baths} Baths</span>
          <span>${prop.area}</span>
        </div>
        <div class="card-actions">
          <button type="button" class="btn btn-primary btn-card" data-view-id="${prop.id}">
            View Residence Details
          </button>
        </div>
      </div>
    `;
    propertyGrid.appendChild(card);
  });
}

function resetAllFilters() {
  state.category = "all";
  state.location = "all";
  state.type = "all";
  state.maxBudget = "all";

  locationSelect.value = "all";
  typeSelect.value = "all";
  budgetSelect.value = "all";

  tabButtons.forEach((btn) => {
    const isAll = btn.dataset.category === "all";
    btn.classList.toggle("active", isAll);
    btn.setAttribute("aria-selected", String(isAll));
  });

  renderProperties();
}

// Property Detail Modal
function openPropertyDetail(id) {
  const prop = PROPERTIES.find((item) => item.id === id);
  if (!prop) return;

  modalBody.innerHTML = `
    <img src="${prop.image}" alt="${prop.title}" class="modal-img" />
    <div class="modal-meta-row">
      <div>
        <span class="section-tag">${prop.category === "Buy" ? "For Sale" : "For Lease"} &bull; ${prop.type}</span>
        <h2 id="modal-title" class="section-title">${prop.title}</h2>
        <p class="card-location">${prop.location}</p>
      </div>
      <div class="card-price">${prop.priceFormatted} <span>${prop.priceSuffix}</span></div>
    </div>
    <p class="body-text">${prop.description}</p>
    <div class="modal-specs-grid">
      <div class="modal-spec-item"><strong>${prop.beds}</strong><span>Bedrooms</span></div>
      <div class="modal-spec-item"><strong>${prop.baths}</strong><span>Bathrooms</span></div>
      <div class="modal-spec-item"><strong>${prop.area}</strong><span>Floor Area</span></div>
      <div class="modal-spec-item"><strong>${prop.year}</strong><span>Completed</span></div>
    </div>
    <button type="button" class="btn btn-gold btn-full" id="modal-enquire-btn" data-prop-title="${prop.title}" data-prop-location="${prop.location}">
      Enquire About This Residence
    </button>
  `;

  propertyModal.hidden = false;
  document.body.style.overflow = "hidden";

  document.getElementById("modal-enquire-btn").addEventListener("click", (e) => {
    const title = e.currentTarget.dataset.propTitle;
    const loc = e.currentTarget.dataset.propLocation;
    closePropertyDetail();

    const messageField = document.getElementById("message");
    const locField = document.getElementById("preferred-location");
    if (locField) locField.value = loc;
    if (messageField) {
      messageField.value = `Hello Northstar Advisory Team, I would like to request a private viewing and dossier for ${title} (${loc}).`;
    }
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  });
}

function closePropertyDetail() {
  propertyModal.hidden = true;
  document.body.style.overflow = "";
}

// Saved Properties Modal
function renderSavedModal() {
  const savedItems = PROPERTIES.filter((p) => state.savedIds.includes(p.id));
  if (savedItems.length === 0) {
    savedListBody.innerHTML = `
      <p class="body-text">Your shortlist is currently empty. Click the heart icon on any property card to save residences for comparison.</p>
    `;
    return;
  }

  savedListBody.innerHTML = savedItems
    .map(
      (item) => `
      <div class="saved-item">
        <div class="saved-item-info">
          <img src="${item.image}" alt="${item.title}" />
          <div>
            <strong>${item.title}</strong>
            <div style="font-size:0.82rem;color:#64736D;">${item.location} &bull; ${item.priceFormatted}</div>
          </div>
        </div>
        <button type="button" class="remove-saved-btn" data-remove-id="${item.id}">Remove</button>
      </div>
    `
    )
    .join("");
}

function openSavedModal() {
  renderSavedModal();
  savedModal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeSavedModal() {
  savedModal.hidden = true;
  document.body.style.overflow = "";
}

// Event Listeners
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  state.location = locationSelect.value;
  state.type = typeSelect.value;
  state.maxBudget = budgetSelect.value;
  renderProperties();
  document.getElementById("properties").scrollIntoView({ behavior: "smooth" });
});

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
    state.category = btn.dataset.category;
    renderProperties();
  });
});

resetFiltersBtn.addEventListener("click", resetAllFilters);
emptyResetBtn.addEventListener("click", resetAllFilters);

propertyGrid.addEventListener("click", (e) => {
  const saveBtn = e.target.closest("[data-save-id]");
  if (saveBtn) {
    toggleSaveProperty(saveBtn.dataset.saveId);
    return;
  }

  const viewBtn = e.target.closest("[data-view-id]");
  if (viewBtn) {
    openPropertyDetail(viewBtn.dataset.viewId);
  }
});

closePropertyModalBtn.addEventListener("click", closePropertyDetail);
propertyModal.addEventListener("click", (e) => {
  if (e.target === propertyModal) closePropertyDetail();
});

openSavedModalBtn.addEventListener("click", openSavedModal);
closeSavedModalBtn.addEventListener("click", closeSavedModal);
savedModal.addEventListener("click", (e) => {
  if (e.target === savedModal) closeSavedModal();
});

savedListBody.addEventListener("click", (e) => {
  const removeBtn = e.target.closest("[data-remove-id]");
  if (removeBtn) {
    toggleSaveProperty(removeBtn.dataset.removeId);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!propertyModal.hidden) closePropertyDetail();
    if (!savedModal.hidden) closeSavedModal();
  }
});

// Service Links Pre-populate Contact Form
document.querySelectorAll(".service-link[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    const service = link.dataset.service;
    const interestSelect = document.getElementById("interest-type");
    if (interestSelect) interestSelect.value = service;
  });
});

// Mobile Navigation Toggle
mobileToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  mobileToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    mobileToggle.setAttribute("aria-expanded", "false");
  });
});

// Sticky Navbar Shadow on Scroll
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 24);
});

// Enquiry Form Validation & Submission Feedback
const enquiryForm = document.getElementById("enquiry-form");
const fullNameInput = document.getElementById("full-name");
const emailInput = document.getElementById("email-address");
const messageInput = document.getElementById("message");
const formFeedback = document.getElementById("form-feedback");

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

enquiryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let isValid = true;

  // Reset errors
  document.getElementById("error-full-name").textContent = "";
  document.getElementById("error-email").textContent = "";
  document.getElementById("error-message").textContent = "";
  fullNameInput.classList.remove("invalid");
  emailInput.classList.remove("invalid");
  messageInput.classList.remove("invalid");
  formFeedback.hidden = true;

  if (fullNameInput.value.trim().length < 2) {
    document.getElementById("error-full-name").textContent = "Please enter your full name.";
    fullNameInput.classList.add("invalid");
    isValid = false;
  }

  if (!validateEmail(emailInput.value.trim())) {
    document.getElementById("error-email").textContent = "Please enter a valid email address.";
    emailInput.classList.add("invalid");
    isValid = false;
  }

  if (messageInput.value.trim().length < 12) {
    document.getElementById("error-message").textContent =
      "Please include a brief message (at least 12 characters).";
    messageInput.classList.add("invalid");
    isValid = false;
  }

  if (!isValid) return;

  const clientName = fullNameInput.value.trim();
  const interest = document.getElementById("interest-type").value;

  formFeedback.className = "form-feedback success";
  formFeedback.textContent = `Thank you, ${clientName}. Your ${interest.toLowerCase()} enquiry has been logged in this portfolio demo. A Northstar advisor would typically follow up within 24 hours.`;
  formFeedback.hidden = false;
  enquiryForm.reset();
});

// Scroll Reveal Observer
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// Initialize App
document.getElementById("current-year").textContent = String(new Date().getFullYear());
saveFavoritesToStorage();
renderProperties();
