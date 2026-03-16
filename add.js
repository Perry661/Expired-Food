(function initFreshTrackerAdd(global) {
  const iconOptions = [
    "restaurant",
    "water_drop",
    "eco",
    "egg",
    "bakery_dining",
    "local_pizza",
    "nutrition",
    "set_meal"
  ];

  const categoryOptions = [
    "staple foods",
    "meat",
    "vegetables",
    "eggs",
    "snacks",
    "drinks",
    "frozen",
    "refrigerated",
    "other"
  ];

  function createDraft(item = {}, computeQuickExpiryDate) {
    const normalizedCategory = String(item.category || "").trim().toLowerCase();
    const categoryOption = !normalizedCategory
      ? "staple foods"
      : categoryOptions.includes(normalizedCategory) && normalizedCategory !== "other"
        ? normalizedCategory
        : "other";

    return {
      name: item.name || "",
      category: item.category || categoryOption,
      categoryOption,
      customCategory: categoryOption === "other" ? item.category || "" : "",
      size: item.size || "TEXT",
      icon: item.icon || "restaurant",
      barcode: item.barcode || "",
      brand: item.brand || "",
      imageUrl: item.imageUrl || "",
      source: item.source || "manual",
      expiryDate: item.expiryDate || computeQuickExpiryDate(0)
    };
  }

  function renderAddFoodSheet(state, escapeHtml) {
    const title = state.modalMode === "edit" ? "Edit Food" : "Add Food";
    const cta = state.saving
      ? "Saving..."
      : state.modalMode === "edit"
        ? "Save Changes"
        : "Confirm & Add Food";
    const expiryPicker = getExpiryPickerModel(state.draft.expiryDate);
    const isWheelMode = state.expiryPickerMode !== "native";

    return `
      <div id="add-food-modal" class="fixed inset-0 z-50 hidden items-end justify-center bg-slate-900/60 p-0 sm:items-center sm:p-4">
        <div class="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-xl bg-white shadow-2xl sm:rounded-xl dark:bg-slate-900">
          <div class="flex h-6 w-full items-center justify-center pt-2">
            <div class="h-1.5 w-12 rounded-full bg-slate-200 dark:bg-slate-700"></div>
          </div>
          <div class="flex items-center justify-between px-6 pb-2 pt-4">
            <h1 class="text-[44px] font-bold tracking-tight leading-none text-slate-900 dark:text-slate-100">${title.replace(" ", "")}</h1>
            <button id="close-add-food" class="rounded-full p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
              <span class="material-symbols-outlined text-[36px] text-slate-400">close</span>
            </button>
          </div>
          <div id="add-food-scroll-area" class="max-h-[80vh] overflow-y-auto px-6 py-4">
            <div class="grid grid-cols-2 gap-5">
              <button data-entry-method="manual" class="entry-method-btn flex min-h-[168px] flex-col items-center justify-center gap-5 rounded-[24px] border-2 p-5 transition-all">
                <span class="material-symbols-outlined text-[42px]">edit_note</span>
                <span class="text-[18px] font-bold leading-none">Manual Entry</span>
              </button>
              <button data-entry-method="scan" class="entry-method-btn flex min-h-[168px] flex-col items-center justify-center gap-5 rounded-[24px] border-2 p-5 transition-all">
                <span class="material-symbols-outlined text-[42px]">barcode</span>
                <span class="text-[18px] font-bold leading-none">Scan Barcode</span>
              </button>
            </div>

            <form id="add-food-form" class="mt-8 flex flex-col gap-6">
              ${state.entryMethod === "scan" ? renderBarcodePanel(state, escapeHtml) : ""}
              <label class="grid gap-2">
                <span class="text-sm font-bold uppercase tracking-wider text-slate-500">Food Name</span>
                <input name="name" value="${escapeHtml(state.draft.name)}" required class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white dark:border-slate-700 dark:bg-slate-800" placeholder="Whole Milk" />
              </label>

              <div class="flex flex-col gap-3">
                <h3 class="text-sm font-bold uppercase tracking-wider text-slate-500">Quick Expiry</h3>
                <div class="flex flex-wrap gap-2">
                  ${renderQuickExpiryButton(state.quickDays, "Eat Soon", 0)}
                  ${renderQuickExpiryButton(state.quickDays, "3 Days", 3)}
                  ${renderQuickExpiryButton(state.quickDays, "7 Days", 7)}
                  ${renderQuickExpiryButton(state.quickDays, "14 Days", 14)}
                  ${renderCustomExpiryButton(state.quickDays)}
                </div>
              </div>

              <div class="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="text-sm font-bold uppercase tracking-wider text-slate-500">Select Expiration Date</p>
                    <p class="mt-1 text-sm text-slate-400">Use quick expiry above or pick a custom calendar date below.</p>
                  </div>
                  <button
                    type="button"
                    data-expiry-mode-toggle="true"
                    class="flex size-11 shrink-0 items-center justify-center rounded-2xl transition ${
                      isWheelMode
                        ? "bg-primary/10 text-primary"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                    }"
                  >
                    <span class="material-symbols-outlined">${isWheelMode ? "edit_calendar" : "calendar_month"}</span>
                  </button>
                </div>

                ${isWheelMode
                  ? `
                    <div class="mt-5 rounded-[28px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                      <div class="grid grid-cols-3 gap-3">
                        ${renderExpiryWheelColumn("month", expiryPicker.monthWheel.previous, expiryPicker.monthWheel.current, expiryPicker.monthWheel.next)}
                        ${renderExpiryWheelColumn("day", expiryPicker.dayWheel.previous, expiryPicker.dayWheel.current, expiryPicker.dayWheel.next)}
                        ${renderExpiryWheelColumn("year", expiryPicker.yearWheel.previous, expiryPicker.yearWheel.current, expiryPicker.yearWheel.next)}
                      </div>
                    </div>
                    <input id="expiry-date-input" name="expiryDate" type="date" required class="sr-only" />
                  `
                  : `
                    <label class="relative mt-5 block cursor-pointer">
                      <div class="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-5 dark:border-slate-800 dark:bg-slate-800/60">
                        <div class="flex items-center justify-between gap-4">
                          <div>
                            <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Native Picker</p>
                            <p class="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">${escapeHtml(expiryPicker.display)}</p>
                          </div>
                          <span class="material-symbols-outlined text-2xl text-primary">calendar_month</span>
                        </div>
                      </div>
                      <input id="expiry-date-input" name="expiryDate" type="date" required class="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                    </label>
                  `}

                <div class="mt-4 flex items-center justify-between rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3">
                  <div>
                    <p class="text-xs font-bold uppercase tracking-wider text-primary">Selected Date</p>
                    <p class="mt-1 text-base font-bold text-slate-900 dark:text-slate-100">${escapeHtml(expiryPicker.display)}</p>
                  </div>
                  <button type="button" data-open-custom-expiry="true" class="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200">
                    ${isWheelMode ? "Custom" : "Pick Date"}
                  </button>
                </div>
              </div>

              <div class="grid gap-2">
                <span class="text-sm font-bold uppercase tracking-wider text-slate-500">Category</span>
                <div class="flex flex-wrap gap-2">
                  ${categoryOptions.map((option) => renderCategoryOption(option, state.draft.categoryOption)).join("")}
                </div>
                ${state.draft.categoryOption === "other"
                  ? `
                    <input
                      name="customCategory"
                      value="${escapeHtml(state.draft.customCategory || "")}"
                      required
                      class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white dark:border-slate-700 dark:bg-slate-800"
                      placeholder="Enter custom category"
                    />
                  `
                  : ""}
              </div>

              <label class="grid gap-2">
                <span class="text-sm font-bold uppercase tracking-wider text-slate-500">Size <span class="font-medium normal-case text-slate-400">(Optional)</span></span>
                <input name="size" value="${escapeHtml(state.draft.size)}" class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white dark:border-slate-700 dark:bg-slate-800" placeholder="TEXT" />
              </label>

              <label class="grid gap-2">
                <span class="text-sm font-bold uppercase tracking-wider text-slate-500">Icon <span class="font-medium normal-case text-slate-400">(Optional)</span></span>
                <select name="icon" class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white dark:border-slate-700 dark:bg-slate-800">
                  ${iconOptions
                    .map(
                      (icon) =>
                        `<option value="${icon}" ${state.draft.icon === icon ? "selected" : ""}>${icon.replaceAll("_", " ")}</option>`
                    )
                    .join("")}
                </select>
              </label>

              ${state.modalMode === "edit"
                ? `
                  <div class="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <p class="text-xs font-bold uppercase tracking-wider text-primary">Current Setup</p>
                    <div class="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                      <span class="rounded-full bg-white px-3 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-200">Category: ${escapeHtml(state.draft.category)}</span>
                      <span class="rounded-full bg-white px-3 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-200">Size: ${escapeHtml(state.draft.size || "TEXT")}</span>
                      <span class="rounded-full bg-white px-3 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-200">Icon: ${escapeHtml(state.draft.icon)}</span>
                      ${state.draft.brand ? `<span class="rounded-full bg-white px-3 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-200">Brand: ${escapeHtml(state.draft.brand)}</span>` : ""}
                      ${state.draft.barcode ? `<span class="rounded-full bg-white px-3 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-200">Barcode: ${escapeHtml(state.draft.barcode)}</span>` : ""}
                      <span class="rounded-full bg-white px-3 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-200">Expires: ${escapeHtml(state.draft.expiryDate)}</span>
                    </div>
                  </div>
                `
                : ""}

              ${state.modalMode === "edit" ? `
                <button type="button" id="delete-in-modal" class="rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100">
                  Delete This Item
                </button>
              ` : ""}

            </form>
          </div>
          <div class="bg-white p-6 pt-2 dark:bg-slate-900">
            <button ${state.saving ? "disabled" : ""} form="add-food-form" class="w-full rounded-xl bg-primary py-4 font-bold text-slate-900 shadow-lg shadow-primary/20 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
              ${cta}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderCategoryOption(option, selectedOption) {
    const active = option === selectedOption;
    const label = option
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

    return `
      <button
        type="button"
        data-category-option="${option}"
        class="rounded-full px-4 py-2 text-sm font-semibold transition ${
          active
            ? "border border-primary/30 bg-primary/20 text-primary"
            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
        }"
      >
        ${label}
      </button>
    `;
  }

  function renderQuickExpiryButton(selectedDays, label, days) {
    const active = selectedDays === days;
    const base = active
      ? "border border-primary/30 bg-primary/20 text-primary"
      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

    return `
      <button type="button" data-quick-days="${days}" class="quick-expiry-btn rounded-full px-4 py-2 text-sm font-semibold ${base}">
        ${label}
      </button>
    `;
  }

  function renderCustomExpiryButton(selectedDays) {
    const active = selectedDays === null;

    return `
      <button type="button" data-open-custom-expiry="true" class="rounded-full px-4 py-2 text-sm font-semibold ${
        active
          ? "border border-primary/30 bg-primary/20 text-primary"
          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
      }">
        <span class="material-symbols-outlined mr-1 text-base align-[-3px]">calendar_month</span>
        Custom
      </button>
    `;
  }

  function renderBarcodePanel(state, escapeHtml) {
    const status = state.scanStatus || "Start scanning to capture a barcode. If this code already exists, fields will auto-fill.";
    const feedback = state.scanFeedback || { type: "", message: "" };
    const inputClass = feedback.type === "error"
      ? "border-red-300 bg-red-50 text-red-700 focus:border-red-400 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200"
      : "border-slate-200 bg-white focus:border-primary dark:border-slate-700 dark:bg-slate-800";

    return `
      <section class="rounded-[28px] border border-primary/15 bg-primary/[0.04] p-5">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-bold uppercase tracking-wider text-slate-500">Barcode Scan</p>
            <p id="barcode-status-text" class="mt-1 text-sm text-slate-500 dark:text-slate-400">${escapeHtml(status)}</p>
          </div>
          <span class="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <span class="material-symbols-outlined">barcode_scanner</span>
          </span>
        </div>
        <div id="barcode-scanner-root" class="mt-4 overflow-hidden rounded-[24px] border border-slate-200 bg-slate-950 dark:border-slate-800">
          <div class="relative aspect-[4/3]">
            <video id="barcode-video" class="h-full w-full object-cover" autoplay playsinline muted></video>
            <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div class="h-24 w-56 rounded-2xl border-2 border-white/85 shadow-[0_0_0_999px_rgba(15,23,42,0.34)]"></div>
            </div>
          </div>
        </div>
        <div class="mt-4 flex gap-3">
          <button type="button" id="barcode-start-scan" class="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-slate-900 shadow-lg shadow-primary/20 transition hover:bg-primary/90">
            Start Scan
          </button>
          <button type="button" id="barcode-stop-scan" class="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            Stop
          </button>
        </div>
        <div class="mt-4 grid gap-2">
          <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Manual Barcode Entry</label>
          <p class="text-xs text-slate-400">Supports 8 / 12 / 13-digit barcodes, or simple alphanumeric codes like <span class="font-semibold">LOT-2026-001</span>.</p>
          <div class="flex gap-3">
            <input id="barcode-manual-input" value="${escapeHtml(state.scanManualCode || "")}" class="flex-1 rounded-xl border px-4 py-3 text-sm outline-none transition ${inputClass}" placeholder="Enter UPC / EAN / Code 128" />
            <button type="button" id="barcode-use-manual" class="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10">
              Use Code
            </button>
          </div>
          ${feedback.message
            ? `
              <p class="text-xs font-semibold ${feedback.type === "error" ? "text-red-500" : "text-amber-600 dark:text-amber-400"}">
                ${feedback.type === "error" ? "ERROR: " : ""}
                ${escapeHtml(feedback.message)}
              </p>
            `
            : ""}
        </div>
        <input type="hidden" name="barcode" value="${escapeHtml(state.draft.barcode || "")}" />
      </section>
    `;
  }

  function renderExpiryWheelColumn(part, previous, current, next) {
    return `
      <div class="rounded-[24px] bg-white/70 px-3 py-4 text-center dark:bg-slate-900/40">
        <button type="button" data-expiry-adjust="${part}" data-expiry-offset="-1" class="flex w-full items-center justify-center rounded-2xl px-2 py-4 text-2xl font-semibold text-slate-300 transition hover:bg-slate-100 hover:text-slate-500 dark:text-slate-600 dark:hover:bg-slate-800">
          ${previous}
        </button>
        <div class="my-2 rounded-[22px] bg-primary/10 px-2 py-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          ${current}
        </div>
        <button type="button" data-expiry-adjust="${part}" data-expiry-offset="1" class="flex w-full items-center justify-center rounded-2xl px-2 py-4 text-2xl font-semibold text-slate-300 transition hover:bg-slate-100 hover:text-slate-500 dark:text-slate-600 dark:hover:bg-slate-800">
          ${next}
        </button>
      </div>
    `;
  }

  function getExpiryPickerModel(value) {
    const selectedDate = parsePickerDate(value);
    const previousDay = shiftDate(selectedDate, -1);
    const nextDay = shiftDate(selectedDate, 1);
    const previousMonth = shiftMonth(selectedDate, -1);
    const nextMonth = shiftMonth(selectedDate, 1);
    const previousYear = shiftYear(selectedDate, -1);
    const nextYear = shiftYear(selectedDate, 1);

    return {
      previous: formatPickerParts(previousDay),
      current: formatPickerParts(selectedDate),
      next: formatPickerParts(nextDay),
      monthWheel: {
        previous: formatPickerParts(previousMonth).month,
        current: formatPickerParts(selectedDate).month,
        next: formatPickerParts(nextMonth).month
      },
      dayWheel: {
        previous: formatPickerParts(previousDay).day,
        current: formatPickerParts(selectedDate).day,
        next: formatPickerParts(nextDay).day
      },
      yearWheel: {
        previous: formatPickerParts(previousYear).year,
        current: formatPickerParts(selectedDate).year,
        next: formatPickerParts(nextYear).year
      },
      display: selectedDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      })
    };
  }

  function parsePickerDate(value) {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split("-").map(Number);
      return new Date(year, month - 1, day);
    }

    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  function shiftDate(date, days) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
  }

  function shiftMonth(date, offset) {
    const next = new Date(date);
    const targetMonth = next.getMonth() + offset;
    next.setMonth(targetMonth, 1);
    next.setDate(Math.min(date.getDate(), new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()));
    return next;
  }

  function shiftYear(date, offset) {
    const next = new Date(date);
    const targetYear = next.getFullYear() + offset;
    next.setFullYear(targetYear, next.getMonth(), 1);
    next.setDate(Math.min(date.getDate(), new Date(targetYear, next.getMonth() + 1, 0).getDate()));
    return next;
  }

  function formatPickerParts(date) {
    return {
      month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
      day: String(date.getDate()).padStart(2, "0"),
      year: String(date.getFullYear())
    };
  }

  function hydrateFormDefaults(state, computeQuickExpiryDate) {
    const input = document.getElementById("expiry-date-input");
    if (!input) {
      return;
    }

    input.value = state.draft.expiryDate || computeQuickExpiryDate(state.quickDays ?? 0);
    highlightEntryMethod(state);
  }

  function highlightEntryMethod(state) {
    document.querySelectorAll(".entry-method-btn").forEach((button) => {
      const active = button.dataset.entryMethod === state.entryMethod;
      button.className =
        "entry-method-btn flex min-h-[168px] flex-col items-center justify-center gap-5 rounded-[24px] border-2 p-5 transition-all " +
        (active
          ? "border-primary bg-primary/5 text-primary shadow-[inset_0_0_0_1px_rgba(17,212,50,0.1)]"
          : "border-slate-200 bg-white text-slate-600 hover:border-primary/50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300");
    });
  }

  global.FreshTrackerAdd = {
    categoryOptions,
    createDraft,
    iconOptions,
    renderAddFoodSheet,
    hydrateFormDefaults,
    highlightEntryMethod
  };
})(window);
