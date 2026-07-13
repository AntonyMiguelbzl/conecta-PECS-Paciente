import React, { useState, useEffect } from 'react';
import { PecsCardType } from './types';
import { INITIAL_CARDS } from './constants';
import { AnimatePresence } from 'framer-motion';
import LoginScreen from './components/LoginScreen';
import PecsBoard from './components/PecsBoard';

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'; 

const firebaseConfig = {
  apiKey: "AIzaSyDYQEoW4OuFLeXfQwb1mKxJuWtuuHdqZYM",
  authDomain: "conecta-pecs.firebaseapp.com",
  projectId: "conecta-pecs",
  storageBucket: "conecta-pecs.firebasestorage.app",
  messagingSenderId: "942692339665",
  appId: "1:942692339665:web:335bb100b6fd5092ccdaf0",
  measurementId: "G-YKHCTWMRVL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 

export default function App() {
  const [tela, setTela] = useState<'login' | 'pecs'>('login');
  const [patientConfig, setPatientConfig] = useState<{name: string, id: string} | null>(null);
  const [cards, setCards] = useState<PecsCardType[]>(INITIAL_CARDS);
  const [spokenHistory, setSpokenHistory] = useState<{ id: string; phrase: string; timestamp: string }[]>([]);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Função corrigida para buscar na coleção exata da sua imagem
  const carregarCartoesDoBanco = async (pacienteId: string) => {
    console.log("Buscando cartões para o ID:", pacienteId);
    try {
      const cartoesRef = collection(db, 'cartoes_customizados');
      const q = query(cartoesRef, where('paciente_id', '==', pacienteId));
      const querySnapshot = await getDocs(q);
      
      const cartoesDoFirebase: PecsCardType[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        cartoesDoFirebase.push({ 
          id: doc.id, 
          label: data.label || 'Sem nome',
          // Mapeie os outros campos conforme o seu tipo PecsCardType
          ...data 
        } as PecsCardType);
      });
      
      console.log("Cartões encontrados:", cartoesDoFirebase.length);
      setCards([...INITIAL_CARDS, ...cartoesDoFirebase]);
    } catch (error) {
      console.error("Erro ao buscar cartões:", error);
    }
  };

  useEffect(() => {
    const savedConfig = localStorage.getItem('paciente_conectado');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setPatientConfig(parsed);
        setTela('pecs');
        carregarCartoesDoBanco(parsed.id); 
      } catch (e) {
        localStorage.removeItem('paciente_conectado');
      }
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    try {
      const pacientesRef = collection(db, 'pacientes');
      const q = query(pacientesRef, where('email', '==', loginEmail.toLowerCase().trim()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setLoginError('E-mail não cadastrado.');
        setIsLoading(false);
        return;
      }

      const docPaciente = querySnapshot.docs[0];
      const dados = docPaciente.data();

      if (dados.senha !== loginPassword) {
        setLoginError('Senha incorreta.');
        setIsLoading(false);
        return;
      }

      const newConfig = { name: dados.nome || 'Estudante', id: docPaciente.id };
      localStorage.setItem('paciente_conectado', JSON.stringify(newConfig));
      
      setPatientConfig(newConfig);
      carregarCartoesDoBanco(docPaciente.id); 
      setTela('pecs');
      
      
    } catch (err) {
      console.error("Erro no login:", err);
      setLoginError('Erro ao conectar ao banco de dados.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const demoConfig = { name: 'Estudante Demo', id: 'antony_demo_id' };
    localStorage.setItem('paciente_conectado', JSON.stringify(demoConfig));
    setPatientConfig(demoConfig);
    setTela('pecs');
  };

  return (
    <div id="pece-app-container" className="flex flex-col h-screen w-screen bg-slate-900 overflow-hidden font-sans select-none antialiased">
      <AnimatePresence mode="wait">
        {tela === 'login' ? (
          <LoginScreen
            key="login"
            loginEmail={loginEmail}
            setLoginEmail={setLoginEmail}
            loginPassword={loginPassword}
            setLoginPassword={setLoginPassword}
            loginError={loginError}
            handleLoginSubmit={handleLoginSubmit}
            isLoading={isLoading}
            onGuestLogin={handleGuestLogin}
          />
        ) : (
          <PecsBoard
            key="pecs"
            cards={cards}
            setCards={setCards}
            profile={{ name: patientConfig?.name || '', age: '', city: '', phone: '' }}
            spokenHistory={spokenHistory}
            setSpokenHistory={setSpokenHistory}
            activeRole="student"
            onOpenPanel={() => { localStorage.removeItem('paciente_conectado'); window.location.reload(); }}
            username={patientConfig?.name || ''}
          />
        )}
      </AnimatePresence>
    </div>
  );
}