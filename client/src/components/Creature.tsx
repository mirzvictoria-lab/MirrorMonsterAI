import { motion } from "framer-motion";
import { getCreatureVisualState } from "@/lib/creature-logic";

interface CreatureProps {
  memory: number;
  isThinking: boolean;
}

export function Creature({ memory, isThinking }: CreatureProps) {
  const visualState = getCreatureVisualState(memory);

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Outer Glow */}
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl opacity-50"
        animate={{
          backgroundColor: visualState.color,
          scale: isThinking ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* The Creature Core */}
      <motion.div
        className="w-32 h-32 bg-foreground/10 backdrop-blur-md border border-white/20"
        animate={{
          borderRadius: visualState.shape,
          boxShadow: visualState.shadow,
          scale: visualState.scale,
          rotate: isThinking ? 180 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 20,
          duration: 1.5
        }}
      >
        {/* Internal "Eye" or Core Detail */}
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
           <motion.div 
             className="w-1/2 h-1/2 bg-white/80 mix-blend-overlay"
             animate={{
               borderRadius: visualState.shape,
               rotate: -45
             }}
           />
        </div>
      </motion.div>
      
      {/* Floating Particles/Dust */}
      {isThinking && (
        <div className="absolute inset-0">
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    initial={{ opacity: 0, x: 0, y: 0 }}
                    animate={{ 
                        opacity: [0, 1, 0],
                        x: (Math.random() - 0.5) * 100,
                        y: (Math.random() - 0.5) * 100
                    }}
                    transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        delay: i * 0.2
                    }}
                    style={{ left: '50%', top: '50%' }}
                />
            ))}
        </div>
      )}
    </div>
  );
}
