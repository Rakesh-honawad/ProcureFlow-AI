import { GoogleGenerativeAI } from '@google/generative-ai';
import { RFP, Proposal } from '../models/rfp.model';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface ProposalSchema {
  totalAmount: number;
  deliveryTimeline: string;
  warrantyTerms: string;
  paymentTerms: string;
  items: Array<{
    description: string;
    unitPrice: number;
    totalPrice: number;
    notes?: string;
  }>;
}

export const geminiService = {
  async parseVendorProposal(
    input: { text?: string; file?: { mimeType: string; data: string } },
    rfpContext: string
  ): Promise<ProposalSchema> {
    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json"
        }
      });

      const parts: any[] = [];

      // Add context
      parts.push({
        text: `Context: An RFP was sent with these details: ${rfpContext}.
        
Task: Parse the provided vendor response (email text and/or attached document) into a structured JSON format.
Extract:
- totalAmount (number)
- deliveryTimeline (string)
- warrantyTerms (string)
- paymentTerms (string)
- items (array of { description, unitPrice, totalPrice, notes })

If a document is provided, prioritize data from the document as it likely contains the official quote.

Return ONLY valid JSON matching this structure.`
      });

      // Add email text if provided
      if (input.text) {
        parts.push({ 
          text: `Vendor Email Text:\n"""\n${input.text}\n"""` 
        });
      }

      // Add file if provided
      if (input.file) {
        parts.push({
          inlineData: {
            mimeType: input.file.mimeType,
            data: input.file.data
          }
        });
      }

      const result = await model.generateContent(parts);
      const response = await result.response;
      const text = response.text();
      
      if (!text) {
        throw new Error("No response from Gemini AI");
      }

      const parsed = JSON.parse(text);
      
      return parsed as ProposalSchema;
      
    } catch (error: any) {
      console.error("❌ Error parsing proposal with Gemini:", error);
      throw new Error(`Failed to parse proposal: ${error.message}`);
    }
  }
};
