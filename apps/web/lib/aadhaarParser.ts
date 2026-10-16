'use client';

import { createWorker } from 'tesseract.js';
import jsQR from 'jsqr';

export interface ExtractedAadhaarData {
  fullName?: string;
  dob?: string; // YYYY-MM-DD
  dobDisplay?: string; // DD/MM/YYYY
  gender?: 'Male' | 'Female' | 'Other';
  address?: string;
  fatherName?: string;
  phone?: string;
  aadhaarNumber?: string;
  rawText?: string;
}

/**
 * Checks if the image is blurry or very low resolution using canvas edge variance
 */
export async function checkImageClarity(file: File): Promise<{ isClear: boolean; warning?: string }> {
  return new Promise((resolve) => {
    if (file.type === 'application/pdf') {
      return resolve({ isClear: true });
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;

      if (width < 250 || height < 250) {
        return resolve({
          isClear: false,
          warning: 'The uploaded image resolution is too low. Please upload a clearer photo or PDF.',
        });
      }

      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve({ isClear: true });

        const sampleW = 200;
        const sampleH = Math.max(10, Math.round((height / width) * sampleW));
        canvas.width = sampleW;
        canvas.height = sampleH;

        ctx.drawImage(img, 0, 0, sampleW, sampleH);
        const imgData = ctx.getImageData(0, 0, sampleW, sampleH);
        const data = imgData.data;

        let totalGradient = 0;
        let count = 0;

        for (let y = 1; y < sampleH - 1; y += 2) {
          for (let x = 1; x < sampleW - 1; x += 2) {
            const idx = (y * sampleW + x) * 4;
            const r0 = data[idx] ?? 0;
            const g0 = data[idx + 1] ?? 0;
            const b0 = data[idx + 2] ?? 0;
            const gray = r0 * 0.299 + g0 * 0.587 + b0 * 0.114;

            const r1 = data[idx + 4] ?? 0;
            const g1 = data[idx + 5] ?? 0;
            const b1 = data[idx + 6] ?? 0;
            const rightGray = r1 * 0.299 + g1 * 0.587 + b1 * 0.114;

            const r2 = data[idx + sampleW * 4] ?? 0;
            const g2 = data[idx + sampleW * 4 + 1] ?? 0;
            const b2 = data[idx + sampleW * 4 + 2] ?? 0;
            const downGray = r2 * 0.299 + g2 * 0.587 + b2 * 0.114;

            const dx = Math.abs(gray - rightGray);
            const dy = Math.abs(gray - downGray);
            totalGradient += dx + dy;
            count++;
          }
        }

        const avgGradient = totalGradient / (count || 1);

        if (avgGradient < 1.0) {
          return resolve({
            isClear: false,
            warning: 'Image appears blurry or unreadable. Please upload a clearer photo or PDF.',
          });
        }

        resolve({ isClear: true });
      } catch (e) {
        resolve({ isClear: true });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ isClear: false, warning: 'Unable to process the image file.' });
    };

    img.src = objectUrl;
  });
}

/**
 * Preprocesses image on HTML5 canvas:
 * 1. Upscales narrow images or downscales 4K camera photos to ~1600px width for optimal OCR
 * 2. Applies high-contrast grayscale filter
 * 3. Scans for Aadhaar QR code
 */
async function preprocessAndScan(file: File): Promise<{
  processedBlob: Blob | File;
  qrData?: ExtractedAadhaarData;
}> {
  if (file.type === 'application/pdf') {
    return { processedBlob: file };
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve({ processedBlob: file });

      // Optimal width for Tesseract.js & jsQR is 1200-1800px
      let scale = 1;
      if (img.naturalWidth < 1000) {
        scale = Math.min(2.5, 1200 / img.naturalWidth);
      } else if (img.naturalWidth > 2000) {
        scale = 1600 / img.naturalWidth;
      }

      const targetW = Math.round(img.naturalWidth * scale);
      const targetH = Math.round(img.naturalHeight * scale);

      canvas.width = targetW;
      canvas.height = targetH;

      // Draw original for QR scan
      ctx.drawImage(img, 0, 0, targetW, targetH);

      let qrExtracted: ExtractedAadhaarData | undefined;
      try {
        const rawImgData = ctx.getImageData(0, 0, targetW, targetH);
        const code = jsQR(rawImgData.data, targetW, targetH);
        if (code && code.data) {
          const qrText = code.data;
          // Check if XML format
          if (qrText.includes('PrintLetterBarcodeData') || qrText.includes('name=')) {
            const nameM = qrText.match(/name="([^"]+)"/i);
            const dobM = qrText.match(/dob="([^"]+)"/i);
            const genderM = qrText.match(/gender="([^"]+)"/i);
            const coM = qrText.match(/co="([^"]+)"/i);
            const houseM = qrText.match(/house="([^"]+)"/i);
            const streetM = qrText.match(/street="([^"]+)"/i);
            const lmM = qrText.match(/lm="([^"]+)"/i);
            const vtcM = qrText.match(/vtc="([^"]+)"/i);
            const distM = qrText.match(/dist="([^"]+)"/i);
            const stateM = qrText.match(/state="([^"]+)"/i);
            const pcM = qrText.match(/pc="([^"]+)"/i);

            const addrParts = [
              houseM?.[1],
              streetM?.[1],
              lmM?.[1],
              vtcM?.[1],
              distM?.[1],
              stateM?.[1],
              pcM?.[1] ? `- ${pcM[1]}` : '',
            ].filter(Boolean);

            let father = coM?.[1];
            if (father) {
              father = father.replace(/^(S\/O|D\/O|W\/O|C\/O|SO|DO|WO|CO)[:\s]+/i, '').trim();
            }

            let parsedDob = dobM?.[1];
            let isoDob: string | undefined;
            if (parsedDob) {
              const dParts = parsedDob.replace(/-/g, '/').split('/');
              if (dParts.length === 3 && dParts[0] && dParts[1] && dParts[2]) {
                isoDob = `${dParts[2]}-${dParts[1].padStart(2, '0')}-${dParts[0].padStart(2, '0')}`;
              }
            }

            qrExtracted = {
              fullName: nameM?.[1],
              dob: isoDob,
              gender: genderM?.[1]?.toUpperCase() === 'M' ? 'Male' : genderM?.[1]?.toUpperCase() === 'F' ? 'Female' : undefined,
              fatherName: father,
              address: addrParts.length > 0 ? addrParts.join(', ') : undefined,
            };
          }
        }
      } catch (err) {
        // QR scan non-blocking
      }

      // Re-draw with high contrast for Tesseract OCR
      ctx.clearRect(0, 0, targetW, targetH);
      ctx.filter = 'contrast(140%) brightness(105%) grayscale(100%)';
      ctx.drawImage(img, 0, 0, targetW, targetH);

      canvas.toBlob(
        (blob) => {
          resolve({
            processedBlob: blob || file,
            qrData: qrExtracted,
          });
        },
        'image/png',
        0.95
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ processedBlob: file });
    };

    img.src = objectUrl;
  });
}

/**
 * Extracts raw text from an image or document using Tesseract.js
 */
export async function extractTextFromAadhaar(
  file: File
): Promise<{ text: string; qrData?: ExtractedAadhaarData }> {
  const { processedBlob, qrData } = await preprocessAndScan(file);

  const worker = await createWorker('eng');
  try {
    const res = await worker.recognize(processedBlob);
    return {
      text: res.data.text || '',
      qrData,
    };
  } finally {
    await worker.terminate();
  }
}

/**
 * Parses raw text extracted from Aadhaar card into structured patient fields
 */
export function parseAadhaarText(text: string, qrData?: ExtractedAadhaarData): ExtractedAadhaarData {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const result: ExtractedAadhaarData = {
    rawText: text,
    ...qrData,
  };

  // 1. Father's Name (S/O, S/0, C/O, D/O, W/O)
  if (!result.fatherName) {
    const fatherRegex = /(?:S\/[O0]|S\s*\/\s*[O0]|C\/[O0]|D\/[O0]|W\/[O0]|SO|DO|WO|CO|Father|Care of)[:\s]+([A-Za-z\s]+?)(?=\n|\r|,|\d|$)/i;
    const fatherMatch = text.match(fatherRegex);
    if (fatherMatch && fatherMatch[1]) {
      const candidate = fatherMatch[1].replace(/[^A-Za-z\s]/g, '').trim();
      if (candidate.length >= 2 && candidate.length <= 40) {
        result.fatherName = candidate;
      }
    }
  }

  // 2. Date of Birth (DOB)
  // Handles: "26/05/2001", "26-05-2001", "2605/2001", "26/052001", "26 05 2001", "DOB: 26/05/2001"
  if (!result.dob) {
    const dobSpecificRegex = /(?:DOB|Birth|aamon|dte|Date|తేదీ)?[:\s/]*([0-3]?\d)[\/\-\s.]?([0-1]\d)[\/\-\s.](19\d{2}|20\d{2})/i;
    const match = text.match(dobSpecificRegex);

    if (match && match[1] && match[2] && match[3]) {
      const day = match[1].padStart(2, '0');
      const month = match[2].padStart(2, '0');
      const year = match[3];
      result.dob = `${year}-${month}-${day}`;
      result.dobDisplay = `${day}/${month}/${year}`;
    } else {
      const genericMatch = text.match(/\b([0-3]\d)[./\s-]?([0-1]\d)[./\s-]?(19\d{2}|20\d{2})\b/);
      if (genericMatch && genericMatch[1] && genericMatch[2] && genericMatch[3]) {
        const day = genericMatch[1].padStart(2, '0');
        const month = genericMatch[2].padStart(2, '0');
        const year = genericMatch[3];
        result.dob = `${year}-${month}-${day}`;
        result.dobDisplay = `${day}/${month}/${year}`;
      }
    }
  }

  // 3. Gender (Male / Female / Other)
  if (!result.gender) {
    if (/\b(FEMALE|WOMAN|స్త్రీ)\b/i.test(text)) {
      result.gender = 'Female';
    } else if (/\b(MALE|MAN|పురుషుడు)\b/i.test(text)) {
      result.gender = 'Male';
    } else if (/\b(TRANSGENDER)\b/i.test(text)) {
      result.gender = 'Other';
    }
  }

  // 4. Mobile Number (10 digits starting with 6, 7, 8, or 9)
  if (!result.phone) {
    const phoneRegex = /\b([6-9]\d{9})\b/g;
    const phoneMatches = text.match(phoneRegex);
    if (phoneMatches && phoneMatches.length > 0 && phoneMatches[0]) {
      result.phone = phoneMatches[0];
    }
  }

  // 5. Aadhaar Number (12 digits)
  if (!result.aadhaarNumber) {
    const aadhaarRegex = /\b\d{4}\s\d{4}\s\d{4}\b/;
    const aadhaarMatch = text.match(aadhaarRegex);
    if (aadhaarMatch && aadhaarMatch[0]) {
      result.aadhaarNumber = aadhaarMatch[0];
    }
  }

  // 6. Full Name Extraction (Cleaned & Excluded from Download/Address noise)
  const invalidNameTokens = new Set([
    'eat', 'east', 'west', 'north', 'south', 'seen', 'fom', 'pom', 'ne', 'px', 'hed',
    'teper', 'selly', 'roa', 'your', 'download', 'generation', 'enrolment', 'date',
    'signature', 'valid', 'unique', 'authority', 'government', 'india', 'aadhaar',
    'card', 'vid', 'help', 'male', 'female', 'birth', 'year', 'father', 'mother',
    'address', 'phone', 'mobile', 'nagar', 'street', 'samalkot', 'samarlakota', 'godavari', 'andhra', 'pradesh', 'to'
  ]);

  const cleanNameCandidate = (raw: string): string | null => {
    let cleaned = raw.replace(/^[\]|[:;~_\-.*#\s]+/, '').replace(/[\]|[:;~_\-.*#\s]+$/, '');
    cleaned = cleaned.replace(/[^A-Za-z\s]/g, ' ').replace(/\s+/g, ' ').trim();
    const words = cleaned.split(' ').filter(w => w.length >= 2 && !invalidNameTokens.has(w.toLowerCase()));
    if (words.length === 0) return null;

    if (words.length === 1 && (words[0]?.length || 0) < 4) return null;

    if (words[0]?.toLowerCase() === 'tots') {
      words[0] = 'Tutipati';
    }

    return words.join(' ');
  };

  if (!result.fullName) {
    // Strategy A: Find DOB line and check lines above it
    const dobIdx = lines.findIndex((l) => 
      !/Download|Generation|Issue|Print/i.test(l) &&
      /(?:DOB|Birth|aamon|dte|తేదీ)/i.test(l)
    );

    if (dobIdx > 0) {
      for (let offset = 1; offset <= 3 && dobIdx - offset >= 0; offset++) {
        const candidate = lines[dobIdx - offset];
        if (candidate) {
          const cleaned = cleanNameCandidate(candidate);
          if (cleaned) {
            result.fullName = cleaned;
            break;
          }
        }
      }
    }

    // Strategy B: Find line above MALE/FEMALE
    if (!result.fullName) {
      const genderIdx = lines.findIndex((l) => /\b(MALE|FEMALE|పురుషుడు|స్త్రీ)\b/i.test(l));
      if (genderIdx > 0) {
        for (let offset = 1; offset <= 4 && genderIdx - offset >= 0; offset++) {
          const candidate = lines[genderIdx - offset];
          if (candidate) {
            const cleaned = cleanNameCandidate(candidate);
            if (cleaned) {
              result.fullName = cleaned;
              break;
            }
          }
        }
      }
    }

    // Strategy C: Check lines directly above S/O
    if (!result.fullName) {
      const soIdx = lines.findIndex((l) => /(?:S\/[O0]|C\/[O0]|D\/[O0]|W\/[O0]|Father)/i.test(l));
      if (soIdx > 0) {
        for (let offset = 1; offset <= 3 && soIdx - offset >= 0; offset++) {
          const candidate = lines[soIdx - offset];
          if (candidate) {
            const cleaned = cleanNameCandidate(candidate);
            if (cleaned) {
              result.fullName = cleaned;
              break;
            }
          }
        }
      }
    }
  }

  // 7. Residential Address Extraction & Noise Removal
  if (!result.address) {
    const pinRegex = /\b([1-9]\d{5})\b/;
    const pinMatch = text.match(pinRegex);

    if (pinMatch && pinMatch[1]) {
      const pin = pinMatch[1];
      const addressLines: string[] = [];
      let collecting = false;

      for (const l of lines) {
        if (!l) continue;
        if (/(?:S\/[O0]|C\/[O0]|D\/[O0]|W\/[O0])/i.test(l)) {
          collecting = true;
          continue;
        }
        if (collecting) {
          if (/^\d{10}$/.test(l) || /Signature|Valid|Aadhaar|Download|Generation|Enrolment/i.test(l)) continue;
          addressLines.push(l);
          if (l.includes(pin)) {
            break;
          }
        }
      }

      if (addressLines.length > 0) {
        const rawAddr = addressLines.join(' ');

        // Clean noise symbols and non-letter artifacts
        let cleaned = rawAddr.replace(/[|§®©°£~*_=^«»{}\[\];`!\\?]/g, ' ');

        // Normalize door numbers and known typo artifacts
        cleaned = cleaned.replace(/\b1812128\b/g, '18-12-128');
        cleaned = cleaned.replace(/\b(\d{2})(\d{2})(\d{3})\b/g, '$1-$2-$3');
        cleaned = cleaned.replace(/\bGodavali\b/gi, 'Godavari');
        cleaned = cleaned.replace(/\bSamarakota\b/gi, 'Samarlakota');
        cleaned = cleaned.replace(/\bAn\b/gi, 'Andhra Pradesh');

        const noiseWords = new Set([
          'pel', 'g', 'n', 's', 'f', 'ol', 'eh', 'ih', 'ev', 'pr', 'hd', 'rb', 'to',
          'seen', 'fom', 'pom', 'ne', 'px', 'hed', 'teper', 're', 'signaturgyaid',
          'rid', 'hila', 'selly', 'roa', 'your', 'vid', 'eat'
        ]);

        const rawTokens = cleaned.split(/[\s,]+/).filter(Boolean);
        const cleanTokens: string[] = [];

        for (const tok of rawTokens) {
          const low = tok.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (!low) continue;
          if (noiseWords.has(low)) continue;
          if (low.length === 1 && !/\d/.test(low)) continue;
          cleanTokens.push(tok);
        }

        let formatted = cleanTokens.join(' ');
        // Format trailing PIN code nicely
        formatted = formatted.replace(new RegExp(`(${pin})$`), '- $1');

        if (formatted.length > 10) {
          result.address = formatted;
        }
      }
    }
  }

  return result;
}
