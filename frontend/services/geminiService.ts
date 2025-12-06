import { GoogleGenAI, Type, Schema } from "@google/genai";
import { RFP, Proposal, ComparisonAnalysis } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for generating an RFP from natural language
const rfpSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A professional title for the RFP" },
    description: { type: Type.STRING, description: "A formal summary of the procurement need" },
    budget: { type: Type.NUMBER, description: "Total budget estimated" },
    deadline: { type: Type.STRING, description: "Due date in YYYY-MM-DD format. If not specified, estimate 30 days out." },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          quantity: { type: Type.NUMBER },
          specs: { type: Type.STRING, description: "Technical specifications if mentioned" }
        }
      }
    },
    requirements: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of specific vendor requirements or certifications needed"
    }
  },
  required: ["title", "description", "items"]
};

// Schema for parsing a vendor email into a structured proposal
const proposalSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    totalAmount: { type: Type.NUMBER, description: "The final total quote amount" },
    deliveryTimeline: { type: Type.STRING, description: "Delivery time promised (e.g., '2 weeks')" },
    warrantyTerms: { type: Type.STRING, description: "Warranty details extracted" },
    paymentTerms: { type: Type.STRING, description: "Payment terms (e.g., 'Net 30')" },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          unitPrice: { type: Type.NUMBER },
          totalPrice: { type: Type.NUMBER },
          notes: { type: Type.STRING }
        }
      }
    }
  },
  required: ["totalAmount", "items"]
};

// Schema for comparing proposals
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    recommendation: { type: Type.STRING, description: "The name of the recommended vendor" },
    summary: { type: Type.STRING, description: "Executive summary of the comparison" },
    scores: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          vendorName: { type: Type.STRING },
          score: { type: Type.NUMBER, description: "Score from 0 to 100" },
          reasoning: { type: Type.STRING },
          pros: { type: Type.ARRAY, items: { type: Type.STRING } },
          cons: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  }
};


export const geminiService = {
  
  /**
   * Generates a structured RFP object from a natural language chat message.
   */
  async generateRfpStructure(userPrompt: string): Promise<Partial<RFP>> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Create a structured Request for Proposal (RFP) based on this user request: "${userPrompt}". 
                   Infer missing details reasonably (e.g., standard delivery times if not mentioned).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: rfpSchema,
          temperature: 0.2, // Low temperature for factual extraction
        }
      });
      
      const text = response.text;
      if (!text) throw new Error("No response from AI");
      return JSON.parse(text);
    } catch (error) {
      console.error("Error generating RFP:", error);
      throw error;
    }
  },

  /**
   * Parses raw email text OR file attachment from a vendor into a structured Proposal.
   */
  async parseVendorProposal(
    input: { text?: string; file?: { mimeType: string; data: string } }, 
    rfpContext: string
  ): Promise<Partial<Proposal>> {
    try {
      const parts: any[] = [];
      
      parts.push({
        text: `Context: An RFP was sent with these details: ${rfpContext}.
        
        Task: Parse the provided vendor response (email text and/or attached document) into a structured data format.
        Extract pricing, timelines, and terms.
        If a document is provided, prioritize data from the document as it likely contains the official quote.`
      });

      if (input.text) {
        parts.push({ text: `Vendor Email Text:\n"""\n${input.text}\n"""` });
      }

      if (input.file) {
        parts.push({
          inlineData: {
            mimeType: input.file.mimeType,
            data: input.file.data
          }
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: proposalSchema,
          temperature: 0.1,
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response from AI");
      return JSON.parse(text);
    } catch (error) {
      console.error("Error parsing proposal:", error);
      throw error;
    }
  },

  /**
   * Compares multiple proposals and provides a recommendation.
   */
  async compareProposals(rfp: RFP, proposals: Proposal[], vendors: any[]): Promise<any> {
    try {
      // Enrich proposals with vendor names for the AI context
      const enrichedProposals = proposals.map(p => {
        const vendor = vendors.find(v => v.id === p.vendorId);
        return {
          vendorName: vendor?.name || "Unknown Vendor",
          ...p
        };
      });

      const prompt = `
        You are a procurement expert. Evaluate these vendor proposals against the RFP requirements.
        
        RFP Details:
        Title: ${rfp.title}
        Budget: $${rfp.budget}
        Items: ${JSON.stringify(rfp.items)}
        Specific Requirements: ${JSON.stringify(rfp.requirements || [])} 
        
        Vendor Proposals:
        ${JSON.stringify(enrichedProposals, null, 2)}
        
        Task:
        1. Score each vendor (0-100) based on price, terms, and compliance with the Specific Requirements (e.g. ISO certs).
        2. Provide pros and cons for each.
        3. Recommend a winner.
        4. Write a summary justification.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: analysisSchema,
          temperature: 0.4, // Balanced for reasoning
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response from AI");
      return JSON.parse(text);
    } catch (error) {
      console.error("Error comparing proposals:", error);
      throw error;
    }
  }
};