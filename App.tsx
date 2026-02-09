
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronRight, ChevronLeft, Stars, Lock, Key, Sparkles, Smile, Flower2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import emailjs from '@emailjs/browser';
import { AppStep } from './types';
import { MEMORIES, HEART_MESSAGE } from './constants';
import FloatingHearts from './components/FloatingHearts';
import Typewriter from './components/Typewriter';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('password');
  const [password, setPassword] = useState('');
  const [passError, setPassError] = useState(false);
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [isSending, setIsSending] = useState(false);

  const CORRECT_PASSWORD = '1234567890987654321'; 

  const SERVICE_ID = 'service_u2z9opo';
  const PUBLIC_KEY = 'a63OTrZoVHh5NRE_b';
  const TEMPLATE_ID = 'template_xin4oad'; 

  useEffect(() => {
    emailjs.init(PUBLIC_KEY);
    
    if (step === 'memories') {
      const timer = setInterval(() => {
        setCurrentMemoryIndex((prev) => (prev + 1) % MEMORIES.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [step, PUBLIC_KEY]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setStep('landing');
    } else {
      setPassError(true);
      setTimeout(() => setPassError(false), 500);
      setPassword('');
    }
  };

  const moveNoButton = () => {
    const maxX = Math.min(window.innerWidth * 0.25, 100);
    const maxY = Math.min(window.innerHeight * 0.2, 80);
    const randomX = (Math.random() - 0.5) * maxX * 2;
    const randomY = (Math.random() - 0.5) * maxY * 2;
    setNoButtonPos({ x: randomX, y: randomY });
  };

  const handleYes = async () => {
    if (isSending) return;
    setIsSending(true);

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff4d6d', '#ff85a1', '#ffffff']
    });

    const templateParams = {
      from_name: "Valentine App",
      to_name: "Admin",
      answer: "YES!",
      message: "သူက 'ဟုတ်ကဲ့' လို့ အဖြေပေးလိုက်ပါပြီ!",
      date: new Date().toLocaleString()
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      setStep('success');
    } catch (error) {
      console.error('EmailJS Error:', error);
      setStep('success');
    } finally {
      setIsSending(false);
    }
  };

  const containerVariants = {
    initial: { opacity: 0, scale: 0.98, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 1.02, y: -10 }
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 sm:p-8 overflow-hidden relative transition-all duration-1000 ${step === 'landing' || step === 'password' ? 'bg-pass-gradient' : 'bg-[#fff5f7]'}`}>
      <FloatingHearts />
      
      <AnimatePresence mode="wait">
        {step === 'password' && (
          <motion.div
            key="password"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-center z-10 w-full max-w-sm"
          >
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/30 shadow-2xl">
              <motion.div
                animate={passError ? { x: [-12, 12, -12, 12, 0] } : {}}
                className="mb-6 flex justify-center"
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Lock size={32} className="text-white" />
                </div>
              </motion.div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-8 tracking-tight myanmar-text">စကားဝှက် ရိုက်ထည့်ပါ</h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div className="relative group">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="စကားဝှက်..."
                    className="w-full bg-white/20 border-2 border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/40 focus:bg-white/30 transition-all text-lg outline-none"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-white text-red-500 font-extrabold py-4 rounded-2xl shadow-xl transition-all hover:bg-pink-50 active:scale-95 flex items-center justify-center gap-2 text-lg tracking-wide"
                >
                  ဝင်ရောက်မယ် <ChevronRight size={20} />
                </button>
              </form>
              <p className="mt-6 text-white/60 text-xs sm:text-sm font-light italic myanmar-text">စကားဝှက်ကတော့ ငယ်စဉ်းစားပြီး ထည့်ကြည့်ပါ</p>
            </div>
          </motion.div>
        )}

        {step === 'landing' && (
          <motion.div
            key="landing"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-center z-10 w-full max-w-sm px-4"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                filter: ["drop-shadow(0 0 0px #fff)", "drop-shadow(0 0 10px #fff)", "drop-shadow(0 0 0px #fff)"]
              }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="mb-8"
            >
              <Heart size={70} className="text-white fill-white mx-auto sm:w-[90px] sm:h-[90px]" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-10 drop-shadow-lg leading-loose myanmar-text px-2">
              ငယ့်ကို ပြောစရာ အရေးကြီးတဲ့ စကားလေး တစ်ခွန်း ရှိတယ်...
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep('memories')}
              className="bg-white text-red-500 font-extrabold py-4 px-10 rounded-full shadow-2xl text-lg flex items-center gap-3 mx-auto transition-all active:bg-pink-50 tracking-wider"
            >
              နှိပ်ကြည့်ပါဦး <Heart size={18} className="fill-current" />
            </motion.button>
          </motion.div>
        )}

        {step === 'memories' && (
          <motion.div
            key="memories"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-md z-10 flex flex-col items-center px-4"
          >
            <div className="bg-white p-2 sm:p-3 rounded-[2.5rem] shadow-2xl relative w-full overflow-hidden border border-white">
              <div className="relative aspect-[4/5] sm:aspect-[3/4] rounded-[2rem] overflow-hidden group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentMemoryIndex}
                    src={MEMORIES[currentMemoryIndex].url}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-center text-white">
                  <motion.p
                    key={`cap-${currentMemoryIndex}`}
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-lg sm:text-xl font-medium italic myanmar-text leading-relaxed"
                  >
                    "{MEMORIES[currentMemoryIndex].caption}"
                  </motion.p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              {MEMORIES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentMemoryIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === currentMemoryIndex ? 'w-8 bg-red-500' : 'w-2 bg-red-200'}`}
                />
              ))}
            </div>

            <button
              onClick={() => setStep('message')}
              className="mt-8 bg-red-500 text-white font-bold py-4 px-12 rounded-full shadow-lg hover:bg-red-600 transition-all flex items-center gap-2 text-base tracking-wide"
            >
              ရှေ့ဆက်မယ် <Flower2 size={20} />
            </button>
          </motion.div>
        )}

        {step === 'message' && (
          <motion.div
            key="message"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="max-w-sm w-full z-10 px-4"
          >
            <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border-2 border-red-50 relative">
              <Stars className="absolute -top-3 -right-3 text-yellow-400 fill-yellow-400" size={40} />
              <div className="text-gray-700 text-lg sm:text-xl myanmar-text text-center min-h-[200px] flex items-center justify-center font-medium">
                <Typewriter text={HEART_MESSAGE} delay={60} />
              </div>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => setStep('question')}
                className="w-full mt-10 bg-red-500 hover:bg-red-600 text-white font-extrabold py-4 rounded-2xl shadow-xl transition-all text-base sm:text-lg flex items-center justify-center gap-2 tracking-wide"
              >
                ကို့မှာ မေးစရာတစ်ခု ရှိသေးတယ်... <Sparkles size={20} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 'question' && (
          <motion.div
            key="question"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className="text-center z-10 w-full max-w-sm px-4"
          >
            <motion.h2 
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-12 sm:mb-20 drop-shadow-sm px-2 leading-relaxed myanmar-text"
            >
              ကို့ရဲ့ ချစ်သူ ဖြစ်ပေးမလား? <Heart size={32} className="inline-block text-red-500 fill-current ml-1" />
            </motion.h2>
            
            <div className="flex flex-col items-center justify-center gap-6 sm:gap-10 relative">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSending}
                onClick={handleYes}
                className="bg-red-500 hover:bg-red-600 text-white font-black py-5 px-16 rounded-full shadow-[0_15px_30px_rgba(239,68,68,0.3)] text-xl sm:text-2xl z-20 w-full sm:w-auto flex items-center justify-center gap-3 transition-all tracking-wider"
              >
                {isSending ? 'ခဏလေးနော်...' : 'ဟုတ်ကဲ့'} <Heart size={22} className="fill-current" />
              </motion.button>

              <div className="relative h-16 w-full flex items-center justify-center mt-2">
                <motion.button
                  animate={{ x: noButtonPos.x, y: noButtonPos.y }}
                  transition={{ type: "spring", damping: 15, stiffness: 200 }}
                  onMouseEnter={moveNoButton}
                  onClick={moveNoButton}
                  className="bg-gray-100 text-gray-400 font-bold py-3 px-10 rounded-full shadow-sm text-base border border-gray-200 flex items-center gap-2"
                >
                  မဖြစ်ဘူး <Smile size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className="text-center z-10 px-4 w-full max-w-sm"
          >
            <motion.div
              animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none"
            >
              <Heart size={350} className="text-red-500 fill-red-500" />
            </motion.div>

            <motion.div
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-2xl relative border border-pink-50"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart size={40} className="text-red-500 fill-red-500" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-romantic font-bold text-red-600 mb-6 leading-tight">
                You just made me the happiest person ❤️
              </h1>
              <p className="text-gray-700 text-lg sm:text-xl myanmar-text leading-loose mb-10 font-medium">
                ကျေးဇူးတင်ပါတယ် ငယ်ရဲ့ အဖြေအတွက်။ <br className="hidden sm:block"/>
                ငယ့်ကို အမြဲတမ်း ဂရုစိုက်ပြီး တန်ဖိုးထားသွားမယ်လို့ ကတိပေးပါတယ်။ ✨
              </p>
              <div className="flex justify-center gap-6">
                <Smile size={32} className="text-pink-400 animate-pulse" />
                <Sparkles size={32} className="text-yellow-400 animate-bounce" />
                <Flower2 size={32} className="text-red-400 animate-pulse" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
