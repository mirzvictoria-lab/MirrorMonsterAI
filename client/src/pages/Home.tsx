import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Creature } from "@/components/Creature";
import { analyzeSentiment, getCreatureResponse, CreatureState } from "@/lib/creature-logic";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles } from "lucide-react";
import backgroundTexture from "@assets/generated_images/dark_obsidian_mirror_texture.png";

interface Message {
  id: string;
  role: "user" | "creature";
  text: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "intro", role: "creature", text: "I am waiting... Speak, and I shall become." }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [creatureState, setCreatureState] = useState<CreatureState>({ memory: 0, lastPolarity: 0 });
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue("");
    
    // Add user message
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", text: userText }]);
    setIsThinking(true);

    // Simulate processing delay for dramatic effect
    setTimeout(() => {
      const polarity = analyzeSentiment(userText);
      const newMemory = Math.max(-1, Math.min(1, creatureState.memory + polarity)); // Clamp between -1 and 1
      
      setCreatureState({
        memory: newMemory,
        lastPolarity: polarity
      });

      const responseText = getCreatureResponse(newMemory);
      
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: "creature", 
        text: responseText 
      }]);
      
      setIsThinking(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans">
      {/* Background Texture */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none z-0 mix-blend-overlay"
        style={{ 
          backgroundImage: `url(${backgroundTexture})`, 
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Ambient Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px]" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 z-10 relative">
        
        {/* Left Column: The Creature */}
        <div className="flex flex-col items-center justify-center min-h-[400px] glass-panel rounded-2xl p-8 relative order-1 md:order-none">
          <div className="absolute top-4 left-4 text-xs tracking-widest uppercase opacity-50 text-muted-foreground font-mono">
            Subject: Mirror_Entity_v1
          </div>
          
          <Creature memory={creatureState.memory} isThinking={isThinking} />
          
          <div className="mt-12 text-center space-y-2">
             <div className="text-sm font-medium tracking-wider text-muted-foreground font-display italic">
               Current Resonance
             </div>
             <div className="h-1 w-32 bg-secondary rounded-full mx-auto overflow-hidden relative">
               <motion.div 
                 className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white]"
                 animate={{ left: `${((creatureState.memory + 1) / 2) * 100}%` }}
                 transition={{ type: "spring", stiffness: 50 }}
               />
             </div>
             <div className="flex justify-between text-[10px] text-muted-foreground w-32 mx-auto font-mono pt-1">
               <span>COLD</span>
               <span>WARM</span>
             </div>
          </div>
        </div>

        {/* Right Column: Interaction */}
        <div className="flex flex-col h-[600px] glass-panel rounded-2xl p-1 overflow-hidden">
           {/* Header */}
           <div className="p-4 border-b border-white/5 bg-black/20">
             <h1 className="font-display text-2xl tracking-wide text-white/90 flex items-center gap-2">
               The Mirror <Sparkles className="w-4 h-4 opacity-50" />
             </h1>
           </div>

           {/* Chat Area */}
           <ScrollArea className="flex-1 p-4">
             <div className="space-y-6">
               {messages.map((msg) => (
                 <motion.div
                   key={msg.id}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                 >
                   <div 
                     className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed
                       ${msg.role === "user" 
                         ? "bg-white/10 text-white rounded-tr-sm backdrop-blur-sm border border-white/5" 
                         : "bg-black/40 text-gray-200 rounded-tl-sm border border-white/5 shadow-inner font-display text-lg tracking-wide"
                       }`}
                   >
                     {msg.text}
                   </div>
                 </motion.div>
               ))}
               {isThinking && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="text-xs text-muted-foreground animate-pulse pl-2">
                      Listening...
                    </div>
                 </motion.div>
               )}
               <div ref={scrollRef} />
             </div>
           </ScrollArea>

           {/* Input Area */}
           <div className="p-4 bg-black/20 border-t border-white/5">
             <form onSubmit={handleSendMessage} className="flex gap-2">
               <Input 
                 value={inputValue}
                 onChange={(e) => setInputValue(e.target.value)}
                 placeholder="Speak to the reflection..."
                 className="bg-black/40 border-white/10 focus-visible:ring-white/20 text-white placeholder:text-white/20 font-sans"
                 autoFocus
               />
               <Button 
                 type="submit" 
                 size="icon"
                 className="bg-white/10 hover:bg-white/20 text-white border border-white/10"
                 disabled={!inputValue.trim() || isThinking}
               >
                 <Send className="w-4 h-4" />
               </Button>
             </form>
           </div>
        </div>

      </div>
    </div>
  );
}
