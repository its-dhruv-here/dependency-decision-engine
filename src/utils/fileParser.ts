import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// In a browser environment, pdfjs needs a worker. We link to a lightweight CDN to avoid bundling the worker internally.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const extractTextFromImage = async (file: File): Promise<string> => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image size exceeds 10MB limit.');
  }

  try {
    const result = await Tesseract.recognize(
      file,
      'eng',
      { logger: m => console.log(m) }
    );
    return result.data.text.trim();
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to extract text from image. Please try a clearer picture.');
  }
};

export const extractTextFromPDF = async (file: File): Promise<string> => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('PDF size exceeds 10MB limit.');
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n\n';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('PDF Parse Error:', error);
    throw new Error('Failed to extract text from PDF. It may be encrypted or corrupted.');
  }
};
