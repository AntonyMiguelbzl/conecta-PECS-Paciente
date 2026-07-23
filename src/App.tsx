import React, { useState, useEffect } from 'react';
import { PecsCardType } from './types';
import { INITIAL_CARDS } from './constants';
import { AnimatePresence } from 'framer-motion';
import LoginScreen from './components/LoginScreen';
import PecsBoard from './components/PecsBoard';

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, onSnapshot, doc } from 'firebase/firestore'; 

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

  const verificarAcessoResponsavel = (): boolean => {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    const resultadoCorreto = num1 + num2;

    const resposta = prompt(`ÁREA RESTRITA\nQuanto é ${num1} + ${num2}?`);

    if (parseInt(resposta || '') === resultadoCorreto) return true;
    alert("Acesso negado.");
    return false;
  };

  const carregarCartoesDoBanco = async (pacienteId: string) => {
    try {
      const cartoesRef = collection(db, 'cartoes_customizados');
      const q = query(cartoesRef, where('paciente_id', '==', pacienteId));
      const querySnapshot = await getDocs(q);
      
      const cartoesDoFirebase: PecsCardType[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        cartoesDoFirebase.push({ id: doc.id, label: data.label || 'Sem nome', ...data } as PecsCardType);
      });
      
      setCards([...INITIAL_CARDS, ...cartoesDoFirebase]);
    } catch (error) {
      console.error("Erro ao buscar cartões:", error);
    }
  };

  // Carregamento inicial do localStorage
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

  // Monitor de exclusão em tempo real (ignora se for a conta de demonstração)
  useEffect(() => {
    if (!patientConfig?.id) return;
    if (patientConfig.id === 'antony_demo_id') return;

    const docRef = doc(db, 'pacientes', patientConfig.id);
    const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
      if (!docSnapshot.exists()) {
        localStorage.removeItem('paciente_conectado');
        window.location.reload(); 
      }
    });
    return () => unsubscribe();
  }, [patientConfig]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    try {
      const emailFormatado = loginEmail.toLowerCase().trim();
      const pacientesRef = collection(db, 'pacientes');
      
      const q = query(pacientesRef, where('email', '==', emailFormatado));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setLoginError('Paciente não encontrado. Verifique se o rastreamento entre sites está ativo.');
        return;
      }

      const docPaciente = querySnapshot.docs[0];
      const dados = docPaciente.data();

      if (dados.senha !== loginPassword) {
        setLoginError('Senha incorreta.');
        return;
      }

      const newConfig = { name: dados.nome || 'Estudante', id: docPaciente.id };
      localStorage.setItem('paciente_conectado', JSON.stringify(newConfig));
      
      setPatientConfig(newConfig);
      await carregarCartoesDoBanco(docPaciente.id); 
      setTela('pecs');
      
    } catch (err) {
      setLoginError('Erro de conexão. Verifique sua rede ou configurações de privacidade.');
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
    <div id="pece-app-container" className="flex flex-col h-[100dvh] w-full bg-slate-900 overflow-hidden font-sans select-none antialiased">
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
            onOpenPanel={() => { 
              if (verificarAcessoResponsavel()) {
                localStorage.removeItem('paciente_conectado');
                window.location.reload(); 
              }
            }}
            username={patientConfig?.name || ''}
          />
        )}
      </AnimatePresence>
    </div>
  );
}