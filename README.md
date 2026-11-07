# Wycliffe Zambia — Official PDF Invoicing & Billing System

A professional, standalone web application engineered specifically for **Wycliffe Zambia**, featuring the official corporate identity, executive invoice templates, and dual-currency support (**ZMW** and **USD**).

---

## 🌟 Premium Features

1. **Official Wycliffe Zambia Brand Identity**
   - High-definition official logo integration in the header.
   - Authentic institutional color scheme: Warm Amber Gold (`#E58E26`), Burgundy Wine (`#8E3B46`), Forest Olive (`#688B35`), and Deep Charcoal (`#37322F`).

2. **Dual-Currency Billing (ZMW & USD)**
   - Instant currency toggle: **Zambian Kwacha (`ZMW`)** and **United States Dollars (`USD`)**.
   - Intelligent benchmark exchange rate conversion tool (default: `1 USD = 27.50 ZMW`).
   - Currency-adaptive banking instructions at **Stanbic Bank Zambia Ltd** (Kwacha Main Account vs. USD Foreign Currency Domiciliary Account with SWIFT `SBICZMLX`).
   - Financial analytics cards tracking Kwacha and USD volume separately.

3. **Executive Document Standards**
   - **Amount in Words**: Formal automatic translation of numbers into English accounting text (e.g., *"Thirty-Eight Thousand One Hundred and Sixty-Four Zambian Kwacha Only"*).
   - **Official Watermark & Paid Stamp**: Automatic *"PAID IN FULL"* verification seal with transaction date when marked as paid.
   - **Electronic QR Verification**: Embedded high-fidelity digital compliance QR code.
   - **Formal Sign-off**: Authorized signatory block and official ministry stamp area.

4. **Document Classification**
   - **Tax Invoice** (Official fiscal documentation)
   - **Proforma Invoice** (Price quotation & commercial proposals)
   - **Official Receipt** (Payment acknowledgement with transaction records)
   - **Price Quotation** (Cost estimation for ministry partners)

5. **Client Management & Export Tools**
   - Save recurring institutional clients with their Zambian Tax Identification Numbers (TPIN).
   - Instant invoice dispatch via **WhatsApp**.
   - One-click export of invoice records to **CSV / Excel**.
   - Full database JSON backup and restore capabilities.

---

## 🚀 How to Launch the System

### Quick Windows Launcher
Simply double-click:
```text
iniciar-sistema.bat
```
Your default web browser will open automatically at **`http://localhost:3000`**.

### Via Terminal / PowerShell
```powershell
npm run dev
```

---

## 🖨️ How to Save / Print as Official Vector PDF

1. Select or create an invoice in the **"Create Invoice"** tab.
2. Click the orange **"Print / PDF"** button.
3. In your browser's print dialog:
   - **Destination**: Choose **"Save as PDF"**.
   - **Paper Size**: Select **A4**.
   - **Margins**: Set to **Default** or **None**.
   - **Options**: Enable **"Background graphics"** to preserve official brand ribbons, logo, and header accents.
4. Click **Save**.
