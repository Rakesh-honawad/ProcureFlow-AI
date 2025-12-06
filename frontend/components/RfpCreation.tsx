import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { aiService } from '../services/aiService';
import { RFP, RFPStatus, ChatMessage } from '../types';
import { Send, Bot, User, Loader2, FileCheck, Sparkles, Play, ChevronRight, FileText, CheckCircle2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const RfpCreation: React.FC = () => {
  const { addRfp } = useAppContext();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      text: 'Hello! I can help you draft a new RFP. Just describe what you need to purchase, including quantity, budget, and timeline.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedRfp, setGeneratedRfp] = useState<Partial<RFP> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMsg: ChatMessage = { id: uuidv4(), role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    try {
      // 1. Add temporary loading message
      const loadingId = uuidv4();
      setMessages(prev => [...prev, { id: loadingId, role: 'assistant', text: 'Analyzing your requirements and structuring the RFP...', timestamp: new Date() }]);

      // 2. Call AI
      const rfpStructure = await aiService.generateRfpStructure(userMsg.text);
      
      // 3. Update State
      setGeneratedRfp(rfpStructure);
      
      // 4. Update Chat
      setMessages(prev => prev.map(m => m.id === loadingId ? {
        ...m,
        text: `I've drafted an RFP for "${rfpStructure.title}". Please review the details on the right.`
      } : m));

    } catch (error) {
      setMessages(prev => [...prev, { id: uuidv4(), role: 'assistant', text: 'Sorry, I encountered an error creating the RFP. Please try again.', timestamp: new Date() }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = () => {
    if (generatedRfp) {
      const newRfp: RFP = {
        id: uuidv4(),
        title: generatedRfp.title || 'Untitled RFP',
        description: generatedRfp.description || '',
        budget: generatedRfp.budget || 0,
        deadline: generatedRfp.deadline || new Date(Date.now() + 30*24*60*60*1000).toISOString(),
        items: generatedRfp.items || [],
        requirements: generatedRfp.requirements || [],
        status: RFPStatus.DRAFT,
        createdAt: new Date().toISOString(),
        selectedVendorIds: []
      };
      addRfp(newRfp);
      navigate(`/rfp/${newRfp.id}`);
    }
  };

  const handleExampleClick = () => {
      setInput("I need to procure CCTV surveillance systems for public facilities across Ward 14. Scope includes 65 outdoor IP cameras, 25 indoor dome cameras, NVR units, poles, cabling, installation, testing, commissioning, and 3-year AMC. Vendors must submit ISO certifications, GST details, and past project experience.");
  };

  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-1rem)] bg-slate-950 p-4 gap-6">
      {/* Left Panel: Chat */}
      <div className="w-full lg:w-1/2 xl:w-7/12 flex flex-col bg-slate-900 rounded-3xl shadow-xl border border-slate-800 overflow-hidden min-h-[500px] lg:min-h-0 lg:h-full relative">
        {/* Chat Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md z-10 flex justify-between items-center">
          <h2 className="font-bold text-slate-100 flex items-center gap-3 text-lg">
            <div className="bg-indigo-500/20 p-2 rounded-xl text-indigo-400 border border-indigo-500/30">
                <Bot size={20}/> 
            </div>
            AI Architect
          </h2>
          <button 
            onClick={handleExampleClick}
            className="text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-full hover:bg-indigo-500/20 transition-all flex items-center gap-1.5 group"
          >
            <Sparkles size={12} className="group-hover:text-indigo-200 transition-colors" /> Try Example
          </button>
        </div>
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar scroll-smooth">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
              <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-6 py-4 text-sm shadow-md leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-br-sm shadow-indigo-900/20' 
                  : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700/50'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-5 border-t border-slate-800 bg-slate-900">
          <div className="flex gap-3 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe your procurement needs..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl pl-5 pr-14 py-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner"
              disabled={isProcessing}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-lg shadow-indigo-900/20"
            >
              {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel: Preview */}
      <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col bg-slate-900 rounded-3xl shadow-xl border border-slate-800 overflow-hidden min-h-[500px] lg:min-h-0 lg:h-full relative border-t-4 border-t-indigo-500">
        
        {/* Preview Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
          <h2 className="font-bold text-slate-100 flex items-center gap-2.5">
            <FileText size={20} className="text-slate-400"/>
            Live Draft
          </h2>
          {generatedRfp && (
            <span className="text-xs font-bold bg-amber-900/30 text-amber-500 px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              DRAFT
            </span>
          )}
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/30 custom-scrollbar">
          {!generatedRfp ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8">
              <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 border border-slate-800 border-dashed">
                 <FileCheck size={36} className="text-slate-600" />
              </div>
              <p className="text-base text-center font-medium text-slate-400">Your RFP structure will appear here.</p>
              <p className="text-sm text-center text-slate-600 mt-2 max-w-xs">Chat with the assistant to auto-generate requirements, budget, and timelines.</p>
            </div>
          ) : (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Header Info */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Title</label>
                <h3 className="text-2xl font-bold text-white leading-tight">{generatedRfp.title}</h3>
              </div>
              
              <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50">
                <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 block flex items-center gap-1.5">
                    <FileText size={12}/> Executive Summary
                </label>
                <p className="text-sm text-slate-300 leading-relaxed">{generatedRfp.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50">
                    <label className="text-xs font-bold text-slate-500 uppercase">Est. Budget</label>
                    <div className="text-xl font-bold text-emerald-400 mt-1">${generatedRfp.budget?.toLocaleString()}</div>
                 </div>
                 <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50">
                    <label className="text-xs font-bold text-slate-500 uppercase">Deadline</label>
                    <div className="text-xl font-bold text-white mt-1">{generatedRfp.deadline}</div>
                 </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 block">Line Items Breakdown</label>
                <div className="space-y-3">
                  {generatedRfp.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start p-4 bg-slate-800/30 border border-slate-800 rounded-xl text-sm shadow-sm hover:border-slate-700 transition-colors">
                      <div className="pr-4">
                        <span className="font-semibold text-slate-200 block text-base">{item.description}</span>
                        {item.specs && <div className="text-xs text-slate-500 mt-1">{item.specs}</div>}
                      </div>
                      <div className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap">
                        x{item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {generatedRfp.requirements && generatedRfp.requirements.length > 0 && (
                <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block flex items-center gap-1.5">
                        <CheckCircle2 size={14}/> Vendor Requirements
                   </label>
                   <ul className="space-y-3">
                     {generatedRfp.requirements.map((req, idx) => (
                       <li key={idx} className="text-sm text-slate-300 flex items-start gap-3">
                         <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                         {req}
                       </li>
                     ))}
                   </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-900">
          <button 
            onClick={handleConfirm}
            disabled={!generatedRfp}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-4 rounded-xl font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-2 group transform active:scale-[0.98]"
          >
            Create RFP Dashboard
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RfpCreation;