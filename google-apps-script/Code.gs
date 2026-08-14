// Google Apps Script Web App — paste into https://script.google.com
// 1) Create a Google Sheet (e.g. "Narayanganj Hosiery Orders")
// 2) Extensions → Apps Script → paste this file → Save
// 3) Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone
// 4) Copy Web App URL → paste into js/config.js → ORDER_API_URL
// Sheet columns are created automatically on first order.

// ── OWNER EMAIL CONFIG — easy to edit ──────────────────────────
const OWNER_EMAIL = "siddikatur0@gmail.com";

// Business constants (used in email)
const BKASH_NUMBER = "01711483621";
const NAGAD_NUMBER = "01711483621";
const BUSINESS_NAME_BN = "নারায়ণগঞ্জ হোসিয়ারি, পাবনা";
const BUSINESS_NAME_EN = "Narayanganj Hosiery, Pabna";
const BUSINESS_ADDRESS = "Pabna College Rd, Pabna 6600";
const BUSINESS_PHONE = "01711-483621";
const CURRENCY = "৳";

// ── Helpers ─────────────────────────────────────────────────────

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function escHtml(s) {
  if (s === null || s === undefined) return "";
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function formatBDT(n) {
  var num = Number(n) || 0;
  return CURRENCY + num.toLocaleString("en-BD");
}

// ── Validation ──────────────────────────────────────────────────
function validateOrder(data) {
  var errors = [];
  if (!data.orderId || String(data.orderId).trim() === "") errors.push("orderId is required");
  if (!data.customerName || String(data.customerName).trim() === "") errors.push("customerName is required");
  if (!data.mobile || String(data.mobile).trim() === "") errors.push("mobile is required");
  if (!data.country || String(data.country).trim() === "") errors.push("country is required");
  if (!data.division || String(data.division).trim() === "") errors.push("division is required");
  if (!data.district || String(data.district).trim() === "") errors.push("district is required");
  if (!data.address || String(data.address).trim() === "") errors.push("address is required");
  if (!data.paymentMethod || String(data.paymentMethod).trim() === "") errors.push("paymentMethod is required");
  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) errors.push("items is required");
  if (data.total === undefined || data.total === null || data.total === "") errors.push("total is required");

  var pm = String(data.paymentMethod || "").toLowerCase();
  if ((pm === "bkash" || pm === "nagad") && (!data.transactionId || String(data.transactionId).trim() === "")) {
    errors.push("transactionId is required for bKash/Nagad");
  }
  return errors;
}

// ── Duplicate check ─────────────────────────────────────────────
function isDuplicateOrder(sheet, orderId) {
  if (!orderId) return false;
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return false;
  // Only scan Order ID column (col 1) — limit to last 500 rows for performance
  var startRow = Math.max(2, lastRow - 500);
  var numRows = lastRow - startRow + 1;
  var values = sheet.getRange(startRow, 1, numRows, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]).trim() === String(orderId).trim()) return true;
  }
  return false;
}

// ── HTML Email Builder ──────────────────────────────────────────
function buildHtmlEmail(data) {
  var items = Array.isArray(data.items) ? data.items : [];
  var pm = String(data.paymentMethod || "").toLowerCase();
  var pmLabel = pm === "bkash" ? "bKash" : pm === "nagad" ? "Nagad" : pm === "cod" ? "Cash on Delivery" : escHtml(data.paymentMethod);

  // Product rows
  var productRows = "";
  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    var qty = it.qty || it.quantity || 0;
    var unitType = it.unitType || it.unitLabel || "dozen";
    // Normalize unit display
    var unitDisplay = unitType;
    // If unitType is Bangla, keep it; if English, show as is
    var qtyDisplay = escHtml(qty) + " " + escHtml(unitDisplay);
    var unitPriceDisplay = formatBDT(it.unitPrice || 0) + " / " + escHtml(unitDisplay);
    var subtotalDisplay = formatBDT(it.subtotal || 0);
    var catDisplay = escHtml(it.category || "—");
    var nameDisplay = escHtml(it.name || "Product");
    if (it.size || it.color) {
      var variant = [];
      if (it.size) variant.push("Size: " + escHtml(it.size));
      if (it.color) variant.push(escHtml(it.color));
      nameDisplay += '<br><span style="font-size:12px;color:#64748B;">' + variant.join(" • ") + "</span>";
    }
    var idDisplay = escHtml(it.id !== undefined ? it.id : "—");
    var subcatDisplay = escHtml(it.subcategory || "—");
    productRows +=
      '<tr>' +
        '<td style="padding:10px 12px;border:1px solid #E2E8F0;font-size:13px;">' + nameDisplay + '<br><span style="font-size:11px;color:#94A3B8;">ID: ' + idDisplay + '</span></td>' +
        '<td style="padding:10px 12px;border:1px solid #E2E8F0;font-size:13px;text-align:center;">' + catDisplay + (subcatDisplay !== "—" ? '<br><span style="font-size:11px;color:#94A3B8;">' + subcatDisplay + '</span>' : '') + '</td>' +
        '<td style="padding:10px 12px;border:1px solid #E2E8F0;font-size:13px;text-align:center;font-weight:700;">' + qtyDisplay + '</td>' +
        '<td style="padding:10px 12px;border:1px solid #E2E8F0;font-size:13px;text-align:center;">' + escHtml(unitDisplay) + '</td>' +
        '<td style="padding:10px 12px;border:1px solid #E2E8F0;font-size:13px;text-align:right;">' + escHtml(unitPriceDisplay) + '</td>' +
        '<td style="padding:10px 12px;border:1px solid #E2E8F0;font-size:13px;text-align:right;font-weight:700;">' + escHtml(subtotalDisplay) + '</td>' +
      '</tr>';
  }

  // Payment section
  var paymentHtml = "";
  if (pm === "bkash") {
    paymentHtml =
      '<p style="margin:4px 0;font-size:14px;"><strong>Payment Method:</strong> bKash — Send Money</p>' +
      '<p style="margin:4px 0;font-size:14px;"><strong>bKash Number:</strong> ' + escHtml(BKASH_NUMBER) + '</p>' +
      '<p style="margin:4px 0;font-size:14px;"><strong>Transaction ID:</strong> <span style="font-family:monospace;background:#F1F5F9;padding:2px 6px;border-radius:4px;">' + escHtml(data.transactionId) + '</span></p>';
  } else if (pm === "nagad") {
    paymentHtml =
      '<p style="margin:4px 0;font-size:14px;"><strong>Payment Method:</strong> Nagad — Send Money</p>' +
      '<p style="margin:4px 0;font-size:14px;"><strong>Nagad Number:</strong> ' + escHtml(NAGAD_NUMBER) + '</p>' +
      '<p style="margin:4px 0;font-size:14px;"><strong>Transaction ID:</strong> <span style="font-family:monospace;background:#F1F5F9;padding:2px 6px;border-radius:4px;">' + escHtml(data.transactionId) + '</span></p>';
  } else {
    paymentHtml = '<p style="margin:4px 0;font-size:14px;"><strong>Payment Method:</strong> Cash on Delivery</p>';
  }

  var timestampDisplay = escHtml(data.timestamp || new Date().toISOString());

  var html =
    '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>' +
    '<body style="margin:0;padding:0;background:#F1F5F9;font-family:Arial,Helvetica,sans-serif;color:#1E293B;">' +

    // Wrapper
    '<div style="max-width:640px;margin:0 auto;background:#F1F5F9;padding:16px;">' +

    // Header
    '<div style="background:#0F172A;color:#FFFFFF;text-align:center;padding:24px 20px;border-radius:12px 12px 0 0;">' +
      '<div style="font-size:20px;font-weight:800;letter-spacing:0.5px;">' + escHtml(BUSINESS_NAME_BN) + '</div>' +
      '<div style="font-size:15px;font-weight:600;opacity:0.9;margin-top:2px;">' + escHtml(BUSINESS_NAME_EN) + '</div>' +
      '<div style="margin-top:10px;font-size:13px;opacity:0.7;">' + escHtml(BUSINESS_ADDRESS) + ' &nbsp;|&nbsp; Phone: ' + escHtml(BUSINESS_PHONE) + '</div>' +
    '</div>' +

    // Title block
    '<div style="background:#FFFFFF;padding:20px;border-left:1px solid #E2E8F0;border-right:1px solid #E2E8F0;text-align:center;border-bottom:1px solid #E2E8F0;">' +
      '<div style="font-size:22px;font-weight:800;color:#0F172A;">New Order Received</div>' +
      '<div style="margin-top:10px;display:inline-block;background:#0F172A;color:#FFFFFF;padding:6px 14px;border-radius:999px;font-size:14px;font-weight:700;letter-spacing:0.5px;">Order ID: ' + escHtml(data.orderId) + '</div>' +
      '<div style="margin-top:8px;font-size:13px;color:#64748B;">Order Date: ' + timestampDisplay + '</div>' +
    '</div>' +

    // Customer Information
    '<div style="background:#FFFFFF;padding:18px 20px;border-left:1px solid #E2E8F0;border-right:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0;">' +
      '<div style="font-size:14px;font-weight:800;color:#0F172A;border-bottom:2px solid #0F172A;padding-bottom:6px;margin-bottom:12px;">1 &nbsp; Customer Information</div>' +
      '<table style="width:100%;border-collapse:collapse;">' +
        '<tr><td style="padding:6px 0;font-size:13px;color:#64748B;width:90px;">Name:</td><td style="padding:6px 0;font-size:14px;font-weight:700;">' + escHtml(data.customerName) + '</td></tr>' +
        '<tr><td style="padding:6px 0;font-size:13px;color:#64748B;">Mobile:</td><td style="padding:6px 0;"><a href="tel:' + escHtml(data.mobile) + '" style="font-size:16px;font-weight:800;color:#B91C1C;text-decoration:none;background:#FEF2F2;padding:4px 10px;border-radius:6px;border:1px solid #FECACA;">' + escHtml(data.mobile) + '</a></td></tr>' +
        '<tr><td style="padding:6px 0;font-size:13px;color:#64748B;">Email:</td><td style="padding:6px 0;font-size:14px;">' + escHtml(data.email || "—") + '</td></tr>' +
      '</table>' +
    '</div>' +

    // Delivery Information
    '<div style="background:#FFFFFF;padding:18px 20px;border-left:1px solid #E2E8F0;border-right:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0;">' +
      '<div style="font-size:14px;font-weight:800;color:#0F172A;border-bottom:2px solid #0F172A;padding-bottom:6px;margin-bottom:12px;">2 &nbsp; Delivery Information</div>' +
      '<table style="width:100%;border-collapse:collapse;">' +
        '<tr><td style="padding:5px 0;font-size:13px;color:#64748B;width:90px;">Country:</td><td style="padding:5px 0;font-size:14px;">' + escHtml(data.country) + '</td></tr>' +
        '<tr><td style="padding:5px 0;font-size:13px;color:#64748B;">Division:</td><td style="padding:5px 0;font-size:14px;">' + escHtml(data.division) + '</td></tr>' +
        '<tr><td style="padding:5px 0;font-size:13px;color:#64748B;">District:</td><td style="padding:5px 0;font-size:14px;font-weight:700;">' + escHtml(data.district) + '</td></tr>' +
        '<tr><td style="padding:5px 0;font-size:13px;color:#64748B;vertical-align:top;">Address:</td><td style="padding:5px 0;font-size:14px;">' + escHtml(data.address) + '</td></tr>' +
      '</table>' +
    '</div>' +

    // Ordered Products — horizontal scroll wrapper for mobile
    '<div style="background:#FFFFFF;padding:18px 20px;border-left:1px solid #E2E8F0;border-right:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0;">' +
      '<div style="font-size:14px;font-weight:800;color:#0F172A;border-bottom:2px solid #0F172A;padding-bottom:6px;margin-bottom:12px;">3 &nbsp; Ordered Products</div>' +
      '<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;">' +
      '<table style="width:100%;border-collapse:collapse;min-width:520px;">' +
        '<thead><tr style="background:#0F172A;color:#FFFFFF;">' +
          '<th style="padding:10px 12px;font-size:12px;text-align:left;white-space:nowrap;">Product</th>' +
          '<th style="padding:10px 12px;font-size:12px;text-align:center;white-space:nowrap;">Category</th>' +
          '<th style="padding:10px 12px;font-size:12px;text-align:center;white-space:nowrap;">Quantity</th>' +
          '<th style="padding:10px 12px;font-size:12px;text-align:center;white-space:nowrap;">Unit</th>' +
          '<th style="padding:10px 12px;font-size:12px;text-align:right;white-space:nowrap;">Unit Price</th>' +
          '<th style="padding:10px 12px;font-size:12px;text-align:right;white-space:nowrap;">Subtotal</th>' +
        '</tr></thead>' +
        '<tbody>' + productRows + '</tbody>' +
      '</table>' +
      '</div>' +
    '</div>' +

    // Payment Information
    '<div style="background:#FFFFFF;padding:18px 20px;border-left:1px solid #E2E8F0;border-right:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0;">' +
      '<div style="font-size:14px;font-weight:800;color:#0F172A;border-bottom:2px solid #0F172A;padding-bottom:6px;margin-bottom:12px;">4 &nbsp; Payment Information</div>' +
      paymentHtml +
    '</div>' +

    // Order Summary
    '<div style="background:#FFFFFF;padding:18px 20px;border-left:1px solid #E2E8F0;border-right:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0;">' +
      '<div style="font-size:14px;font-weight:800;color:#0F172A;border-bottom:2px solid #0F172A;padding-bottom:6px;margin-bottom:12px;">5 &nbsp; Order Summary</div>' +
      '<table style="width:100%;border-collapse:collapse;">' +
        '<tr><td style="padding:6px 0;font-size:14px;color:#475569;">Subtotal:</td><td style="padding:6px 0;font-size:14px;text-align:right;">' + escHtml(formatBDT(data.subtotal)) + '</td></tr>' +
        '<tr><td style="padding:6px 0;font-size:14px;color:#475569;">Delivery Charge:</td><td style="padding:6px 0;font-size:14px;text-align:right;">' + escHtml(formatBDT(data.deliveryCharge)) + '</td></tr>' +
        '<tr><td colspan="2" style="border-top:2px solid #0F172A;padding-top:10px;"></td></tr>' +
        '<tr><td style="padding:6px 0;font-size:16px;font-weight:800;color:#0F172A;">Grand Total:</td><td style="padding:6px 0;font-size:18px;font-weight:800;color:#B91C1C;text-align:right;">' + escHtml(formatBDT(data.total)) + '</td></tr>' +
      '</table>' +
    '</div>' +

    // Footer
    '<div style="background:#0F172A;color:#FFFFFF;text-align:center;padding:20px;border-radius:0 0 12px 12px;">' +
      '<div style="font-size:14px;font-weight:700;letter-spacing:1px;">THANK YOU FOR SHOPPING HERE.</div>' +
      '<div style="font-size:14px;font-weight:700;letter-spacing:1px;margin-top:2px;">WE WILL CONTACT YOU SOON.</div>' +
      '<div style="margin-top:14px;font-size:13px;opacity:0.8;">Narayanganj Hosiery, Pabna</div>' +
      '<div style="font-size:12px;opacity:0.6;">' + escHtml(BUSINESS_ADDRESS) + '</div>' +
      '<div style="font-size:12px;opacity:0.6;">Phone: ' + escHtml(BUSINESS_PHONE) + '</div>' +
    '</div>' +

    '</div>' + // wrapper
    '</body></html>';

  return html;
}

// ── Plain-text fallback ─────────────────────────────────────────
function buildPlainTextEmail(data) {
  var items = Array.isArray(data.items) ? data.items : [];
  var pm = String(data.paymentMethod || "").toLowerCase();

  var lines = [];
  lines.push(BUSINESS_NAME_BN + " — " + BUSINESS_NAME_EN);
  lines.push(BUSINESS_ADDRESS + " | Phone: " + BUSINESS_PHONE);
  lines.push("==================================================");
  lines.push("New Order Received");
  lines.push("Order ID: " + (data.orderId || ""));
  lines.push("Order Date: " + (data.timestamp || ""));
  lines.push("");

  lines.push("1. CUSTOMER INFORMATION");
  lines.push("   Name  : " + (data.customerName || ""));
  lines.push("   Mobile: " + (data.mobile || ""));
  lines.push("   Email : " + (data.email || "—"));
  lines.push("");

  lines.push("2. DELIVERY INFORMATION");
  lines.push("   Country : " + (data.country || ""));
  lines.push("   Division: " + (data.division || ""));
  lines.push("   District: " + (data.district || ""));
  lines.push("   Address : " + (data.address || ""));
  lines.push("");

  lines.push("3. ORDERED PRODUCTS");
  lines.push("   --------------------------------------------------");
  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    var qty = it.qty || it.quantity || 0;
    var unitType = it.unitType || it.unitLabel || "dozen";
    lines.push("   " + (i + 1) + ". " + (it.name || "Product") + "  (ID: " + (it.id !== undefined ? it.id : "—") + ")");
    lines.push("      Category   : " + (it.category || "—") + (it.subcategory ? " / " + it.subcategory : ""));
    lines.push("      Quantity   : " + qty + " " + unitType);
    lines.push("      Unit Price : " + formatBDT(it.unitPrice || 0) + " / " + unitType);
    lines.push("      Subtotal   : " + formatBDT(it.subtotal || 0));
    if (it.size || it.color) {
      var v = [];
      if (it.size) v.push("Size: " + it.size);
      if (it.color) v.push(it.color);
      lines.push("      Variant    : " + v.join(" • "));
    }
    lines.push("");
  }
  lines.push("   --------------------------------------------------");

  lines.push("4. PAYMENT INFORMATION");
  if (pm === "bkash") {
    lines.push("   Payment Method: bKash — Send Money");
    lines.push("   bKash Number  : " + BKASH_NUMBER);
    lines.push("   Transaction ID: " + (data.transactionId || ""));
  } else if (pm === "nagad") {
    lines.push("   Payment Method: Nagad — Send Money");
    lines.push("   Nagad Number  : " + NAGAD_NUMBER);
    lines.push("   Transaction ID: " + (data.transactionId || ""));
  } else {
    lines.push("   Payment Method: Cash on Delivery");
  }
  lines.push("");

  lines.push("5. ORDER SUMMARY");
  lines.push("   Subtotal       : " + formatBDT(data.subtotal));
  lines.push("   Delivery Charge: " + formatBDT(data.deliveryCharge));
  lines.push("   Grand Total    : " + formatBDT(data.total));
  lines.push("");

  lines.push("--------------------------------------------------");
  lines.push("THANK YOU FOR SHOPPING HERE.");
  lines.push("WE WILL CONTACT YOU SOON.");
  lines.push("");
  lines.push(BUSINESS_NAME_EN);
  lines.push(BUSINESS_ADDRESS);
  lines.push("Phone: " + BUSINESS_PHONE);

  return lines.join("\n");
}

// ── doPost — main entry ─────────────────────────────────────────
function doPost(e) {
  var orderSaved = false;
  var emailSent = false;
  var orderIdForResponse = "";

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, orderSaved: false, emailSent: false, error: "Empty request body" });
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return jsonResponse({ success: false, orderSaved: false, emailSent: false, error: "Invalid JSON: " + String(parseErr) });
    }

    orderIdForResponse = data.orderId || "";

    // ── Validation ──
    var validationErrors = validateOrder(data);
    if (validationErrors.length > 0) {
      return jsonResponse({ success: false, orderSaved: false, emailSent: false, error: "Validation failed: " + validationErrors.join("; ") });
    }

    // ── Save to Google Sheet first ──
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0];

    // Ensure header
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Order ID", "Timestamp", "Customer Name", "Mobile", "Email", "Country", "Division", "District", "Address", "Payment Method", "Transaction ID", "Items (JSON)", "Subtotal", "Delivery Charge", "Total"
      ]);
      sheet.getRange(1, 1, 1, 15).setFontWeight("bold").setBackground("#0F172A").setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

    // Duplicate protection — if same orderId already exists, do not save again or send duplicate email
    if (isDuplicateOrder(sheet, data.orderId)) {
      // Already saved; treat as success but don't re-send email
      return jsonResponse({ success: true, orderSaved: true, emailSent: true, orderId: data.orderId, message: "Order already received." });
    }

    var itemsStr = JSON.stringify(data.items || []);
    if (itemsStr.length > 40000) itemsStr = itemsStr.slice(0, 40000) + "… (truncated)";

    sheet.appendRow([
      data.orderId || "",
      data.timestamp || new Date().toISOString(),
      data.customerName || "",
      data.mobile || "",
      data.email || "",
      data.country || "",
      data.division || "",
      data.district || "",
      data.address || "",
      data.paymentMethod || "",
      data.transactionId || "",
      itemsStr,
      data.subtotal || 0,
      data.deliveryCharge || 0,
      data.total || 0
    ]);
    SpreadsheetApp.flush();
    orderSaved = true;

    // ── Send owner email (non-blocking for order success) ──
    try {
      var subject = "New Order - " + data.orderId + " - Narayanganj Hosiery, Pabna";
      var htmlBody = buildHtmlEmail(data);
      var plainBody = buildPlainTextEmail(data);

      MailApp.sendEmail({
        to: OWNER_EMAIL,
        subject: subject,
        body: plainBody,
        htmlBody: htmlBody,
        name: BUSINESS_NAME_EN
      });
      emailSent = true;
    } catch (emailErr) {
      // Log but do NOT fail the order
      console.error("Email send failed for order " + data.orderId + ": " + String(emailErr));
      emailSent = false;
    }

    return jsonResponse({
      success: true,
      orderSaved: orderSaved,
      emailSent: emailSent,
      orderId: data.orderId,
      message: "Order received successfully."
    });

  } catch (err) {
    // If sheet save succeeded but something else failed after, still report orderSaved
    console.error("doPost error: " + String(err) + " | orderId=" + orderIdForResponse);
    if (orderSaved) {
      return jsonResponse({
        success: true,
        orderSaved: true,
        emailSent: emailSent,
        orderId: orderIdForResponse,
        message: "Order received successfully."
      });
    }
    return jsonResponse({ success: false, orderSaved: false, emailSent: false, error: String(err) });
  }
}

function doGet() {
  return jsonResponse({ ok: true, msg: "Narayanganj Hosiery Orders API — POST orders here." });
}

// Optional: handle CORS preflight if needed (some deployments)
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}
