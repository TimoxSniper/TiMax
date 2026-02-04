# Legal Pages Setup Guide (DSGVO/Impressumspflicht Compliance)

## ⚖️ Legal Requirement Status

**Current Status:** ⚠️ **NOT COMPLIANT** - Legal pages contain placeholders

**Required for:** All commercial websites in Germany (TMG § 5, DSGVO)

**Deadline:** Must be completed BEFORE going live with the application

---

## Required Information Checklist

### 1. Impressum (Imprint) - `/impressum`

**Company Information:**
- [ ] Full company name (legal entity name)
- [ ] Legal form (GmbH, UG, Einzelunternehmen, etc.)
- [ ] Complete address (Street, Number, Postal Code, City, Country)
- [ ] Email address
- [ ] Phone number

**Registration Information (if applicable):**
- [ ] Name of managing director(s) / authorized representative(s)
- [ ] Register court (Registergericht) - e.g., "Amtsgericht München"
- [ ] Register number (Handelsregisternummer) - e.g., "HRB 123456"
- [ ] VAT ID (Umsatzsteuer-Identifikationsnummer) - if applicable

**Professional Supervision (if applicable):**
- [ ] Supervisory authority
- [ ] Professional association membership
- [ ] Professional title and state that issued it

---

### 2. Datenschutzerklärung (Privacy Policy) - `/datenschutz`

**Company/Responsible Party Information:**
- [ ] Same as Impressum (company name, address)
- [ ] Contact person for data protection

**Data Protection Officer (DSB):**
- [ ] Name (required if >20 employees process personal data)
- [ ] Email address
- [ ] Phone number (optional)

**Current Status:** Template is complete, only needs company data filled in

---

### 3. AGB (Terms & Conditions) - `/agb`

**Pricing Information:**
- [ ] Is the service free or paid?
- [ ] If paid: Price structure
- [ ] Payment methods
- [ ] Billing cycles

**Current Status:** Template is complete, needs pricing info

---

### 4. Widerrufsbelehrung (Right of Withdrawal) - `/widerruf`

**Company Information:**
- [ ] Same as Impressum

**Current Status:** Template is complete, only needs company data

---

## How to Fill in the Information

### Step 1: Gather Information

Create a file with all required information:

```
# Company Information
COMPANY_NAME="TiMax GmbH"
LEGAL_FORM="GmbH"
ADDRESS_STREET="Musterstraße 123"
ADDRESS_POSTAL="80333"
ADDRESS_CITY="München"
ADDRESS_COUNTRY="Deutschland"
EMAIL="info@timax.de"
PHONE="+49 89 12345678"

# Registration
MANAGING_DIRECTOR="Max Mustermann"
REGISTER_COURT="Amtsgericht München"
REGISTER_NUMBER="HRB 234567"
VAT_ID="DE123456789"

# Data Protection Officer (if applicable)
DSB_NAME="Dr. Maria Schmidt"
DSB_EMAIL="datenschutz@timax.de"
DSB_PHONE="+49 89 12345679"

# Pricing (if applicable)
IS_PAID_SERVICE="false"
PRICING="Kostenlos in Beta-Phase"
```

### Step 2: Update Files

1. **Impressum** (`my-app/src/app/impressum/page.tsx`)
   - Replace line 39 placeholder with company name and address
   - Replace line 56 with phone number
   - Replace line 65 with managing director name
   - Replace lines 74, 77 with register court and number
   - Replace line 86 with VAT ID (if applicable)

2. **Datenschutz** (`my-app/src/app/datenschutz/page.tsx`)
   - Replace line 39 with company contact data
   - Replace line 56 with DSB information (if applicable)

3. **AGB** (`my-app/src/app/agb/page.tsx`)
   - Replace line 79 with pricing information

4. **Widerruf** (`my-app/src/app/widerruf/page.tsx`)
   - Replace line 47 with company contact data

---

## Automated Update Script

You can use this script to update all legal pages at once:

```bash
#!/bin/bash

# Set your company information
export COMPANY_NAME="TiMax GmbH"
export ADDRESS="Musterstraße 123, 80333 München"
export EMAIL="info@timax.de"
export PHONE="+49 89 12345678"
export MANAGING_DIRECTOR="Max Mustermann"

# Run the update script
node scripts/update-legal-pages.js
```

---

## Legal Review Checklist

Before going live, ensure:

- [ ] All company information is accurate and current
- [ ] Email addresses are monitored and respond within 48 hours
- [ ] Phone number is reachable during business hours
- [ ] VAT ID is valid (if applicable)
- [ ] Data protection officer is named (if required by law)
- [ ] Privacy policy covers all data processing activities
- [ ] Terms & Conditions match your actual business model
- [ ] Right of withdrawal is correctly stated (14 days for consumers)

---

## Fines for Non-Compliance

**Impressumspflicht (TMG § 5):**
- Up to €50,000 fine for missing or incomplete imprint
- Risk of warnings from competitors (Abmahnungen)

**DSGVO (Privacy):**
- Up to €20 million or 4% of global annual revenue
- Mandatory reporting of data breaches within 72 hours

---

## Resources

**Legal Templates:**
- [Impressum Generator](https://www.e-recht24.de/impressum-generator.html)
- [Datenschutz Generator](https://www.e-recht24.de/muster-datenschutzerklaerung.html)

**Professional Help:**
- Consider hiring a lawyer specialized in internet law (Fachanwalt für IT-Recht)
- Data protection officer services: [TÜV](https://www.tuv.com/de/de/datenschutzbeauftragter.html)

---

## Current Placeholder Values

The legal pages currently contain clearly marked placeholders like:

```tsx
<span className="text-red-600 font-bold">
  [FIRMENNAME HIER EINTRAGEN]
</span>
```

These are styled in **red and bold** to make them impossible to miss. DO NOT go live until all red placeholders are replaced with actual information.

---

**Last Updated:** 2026-02-04
**Status:** Documentation complete - Awaiting company information
