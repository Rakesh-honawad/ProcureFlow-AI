import React, { useState, useRef } from 'react';
import { aiService } from '../services/aiService';
import { RFP, Proposal } from '../types';
import { useAppContext } from '../store/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { Mail, Sparkles, AlertCircle, Upload, X, FileText, RefreshCw } from 'lucide-react';

interface Props {
  rfp: RFP;
  onSuccess: () => void;
}

const EMAIL_TEMPLATES = [
  {
    label: "Standard Quote",
    text: (title: string) => `Subject: Proposal for ${title}

Dear Procurement Team,

Thank you for the opportunity to quote. Please find our details below:

Total Price: $45,000
Delivery: 4 weeks from PO
Warranty: Standard 1 year manufacturer warranty
Payment Terms: Net 30

We look forward to working with you.

Best,
Account Manager`
  },
  {
    label: "Messy / Chatty",
    text: (title: string) => `Hi there!

Saw your request for ${title}. We can definitely help you out with this.
We've got the stock ready to go, usually takes about 2-3 weeks to ship things out.
Price-wise, you're looking at roughly 42k for the whole lot. 
Since we're new partners, we'd need 50% upfront, rest on delivery.
Oh, and we include a 2-year warranty on parts.

Let me know if that works!
Cheers,
Dave`
  },
  {
    label: "Formal / Detailed",
    text: (title: string) => `REFERENCE: RFP-${title.substring(0,5).toUpperCase()}

To Whom It May Concern,

We are pleased to submit our formal response.
Commercial Summary:
- Grand Total: USD 48,500.00 (inclusive of taxes)
- Incoterms: DDP Your Facility
- Lead Time: 6 weeks ARO

Compliance:
- Warranty: 3 Years Comprehensive (Gold Tier)
- Payment: Net 45 days
- ISO 9001 Certified

Attached please find our technical compliance matrix.

Sincerely,
Enterprise Sales Division`
  }
];

const ProposalSimulator: React.FC<Props> = ({ rfp, onSuccess }) => {
  const { vendors, addProposal } = useAppContext();
  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [file, setFile] = useState<{ name: string; type: string; data: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyTemplate = (templateIndex: number) => {
    setEmailContent(EMAIL_TEMPLATES[templateIndex].text(rfp.title));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setFile({
          name: f.name,
          type: f.type,
          data: result // Keep full data URL for now
        });
      };
      reader.readAsDataURL(f);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleProcessEmail = async () => {
    if (!selectedVendorId || (!emailContent && !file)) return;
    
    setIsAnalyzing(true);
    setError(null);

    try {
      // 1. Contextualize for AI
      const rfpContext = JSON.stringify({
        title: rfp.title,
        items: rfp.items
      });

      // 2. Prepare AI Input (Text + File if present)
      const input = {
        text: emailContent,
        file: file ? {
          mimeType: file.type,
          data: file.data.split(',')[1] // Remove 'data:mime;base64,' prefix
        } : undefined
      };

      // 3. AI Parsing
      const parsedData = await aiService.parseVendorProposal(input, rfpContext);

      // 4. Construct full object
      const newProposal: Proposal = {
        id: uuidv4(),
        rfpId: rfp.id,
        vendorId: selectedVendorId,
        receivedAt: new Date().toISOString(),
        rawEmailContent: emailContent,
        attachmentName: file?.name,
        totalAmount: parsedData.totalAmount || 0,
        items: parsedData.items || [],
        deliveryTimeline: parsedData.deliveryTimeline || 'Unknown',
        warrantyTerms: parsedData.warrantyTerms || 'Unknown',
        paymentTerms: parsedData.paymentTerms || 'Unknown',
      };

      // 5. Save
      addProposal(newProposal);
      onSuccess();
      
      // Reset
      setEmailContent('');
      setSelectedVendorId('');
      clearFile();
      
    } catch (err) {
      console.error(err);
      setError("Failed to parse the response. AI model might be busy or file format not supported.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-500/20 p-2 rounded-lg border border-indigo-500/30">
           <Mail className="text-indigo-400" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-100">Simulate Response</h3>
          <p className="text-xs text-slate-400">Receive an email or upload a quote to test AI parsing.</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Vendor Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">From Vendor</label>
          <select 
            value={selectedVendorId}
            onChange={(e) => setSelectedVendorId(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none"
          >
            <option value="">Select a vendor...</option>
            {vendors.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        {/* Templates */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Load Template</label>
          <div className="flex gap-2">
            {EMAIL_TEMPLATES.map((tpl, idx) => (
              <button 
                key={idx}
                onClick={() => applyTemplate(idx)}
                className="flex-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg border border-slate-700 transition-colors"
              >
                {tpl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Email Body */}
        <div>
           <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Email Body / Notes</label>
           </div>
          <textarea
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm font-mono text-slate-300 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none resize-none placeholder-slate-600"
            placeholder="Paste email text here..."
          />
        </div>

        {/* File Upload */}
        <div>
           <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Attachment (Optional)</label>
           
           {!file ? (
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="border-2 border-dashed border-slate-700 bg-slate-800/50 rounded-xl p-4 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-800 hover:border-slate-600 transition-all group"
             >
               <Upload size={24} className="mb-2 text-slate-500 group-hover:text-indigo-400 transition-colors" />
               <span className="text-xs font-medium">Click to upload Quote (PDF, PNG, JPG)</span>
               <input 
                 ref={fileInputRef}
                 type="file" 
                 accept="application/pdf,image/png,image/jpeg,image/webp"
                 className="hidden" 
                 onChange={handleFileChange}
               />
             </div>
           ) : (
             <div className="flex items-center justify-between bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-3">
               <div className="flex items-center gap-3">
                 <div className="bg-indigo-500/20 p-2 rounded text-indigo-400">
                   <FileText size={16} />
                 </div>
                 <div className="text-sm">
                    <p className="font-medium text-indigo-200 truncate max-w-[160px]">{file.name}</p>
                    <p className="text-xs text-indigo-400/70">{file.type.split('/')[1].toUpperCase()}</p>
                 </div>
               </div>
               <button onClick={clearFile} className="text-indigo-400 hover:text-indigo-200 p-1.5 rounded-full hover:bg-indigo-500/20 transition-colors">
                 <X size={16} />
               </button>
             </div>
           )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 border border-red-900/50 p-3 rounded-xl">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <button
          onClick={handleProcessEmail}
          disabled={!selectedVendorId || (!emailContent && !file) || isAnalyzing}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-900/20 hover:shadow-indigo-600/30"
        >
          {isAnalyzing ? (
            <>
              <Sparkles className="animate-spin" size={18} />
              AI Analyzing...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Receive & Parse Response
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProposalSimulator;