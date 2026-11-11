import React, { useState, useEffect } from 'react';
import { 
  Shirt, Sparkles, MessageCircle, ShieldCheck, 
  HelpCircle, User, Check, X, ChevronDown, 
  ChevronUp, Send, AlertCircle, Info, Trash2, Settings, 
  Layers, PlusCircle, ToggleLeft, ToggleRight, Menu
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
    
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    
    export const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;
const supabase = {
  auth: {
    signUp: async () => ({ data: { user: { id: 'mock-id' } }, error: null }),
    signInWithPassword: async () => ({ data: { user: { id: 'mock-id' } }, error: null }),
    signOut: async () => ({ error: null }),
  },
  from: () => ({
    insert: async () => ({ error: null }),
    select: () => ({
      eq: () => ({
        single: async () => ({ data: { first_name: 'Usuario', last_name: 'Demo', city: 'Maracay', state: 'Aragua', phone: '000000' }, error: null })
      })
    })
  })
};

// --- DATA & CONSTANTS ---
const INITIAL_GARMENTS = [
  {
    id: 'garment-1',
    name: 'Camiseta Pro Performance',
    category: 'Deportiva',
    price: 25.00,
    active: true,
    colors: ['#111827', '#64748B', '#F8FAFC', '#1E3A8A', '#991B1B'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
    mockupType: 'tshirt'
  },
  {
    id: 'garment-2',
    name: 'Hoodie Oversize Steel Edition',
    category: 'Urban / Sport',
    price: 45.00,
    active: true,
    colors: ['#111827', '#334155', '#475569', '#0F172A'],
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
    mockupType: 'hoodie'
  },
  {
    id: 'garment-3',
    name: 'Short de Entrenamiento DryFit',
    category: 'Fitness',
    price: 20.00,
    active: true,
    colors: ['#111827', '#1E293B', '#475569'],
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=800',
    mockupType: 'shorts'
  },
  {
    id: 'garment-4',
    name: 'Jersey Personalizado Team Obsidiana',
    category: 'Competición',
    price: 35.00,
    active: true,
    colors: ['#0F172A', '#1E293B', '#DC2626', '#2563EB'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800',
    mockupType: 'jersey'
  }
];

const FAQS = [
  {
    q: '¿Qué tipo de impresiones o estampados utilizan?',
    a: 'Utilizamos tecnología DTF (Direct to Film) de última generación, vinilo textil de alta durabilidad y sublimación premium para acabados suaves y resistentes a cientos de lavados.'
  },
  {
    q: '¿Cómo funciona el pedido por WhatsApp?',
    a: 'Una vez personalices tu prenda en nuestra plataforma con la descripción que desees, se generará una ficha técnica detallada que enviará automáticamente tu pedido a nuestro chat oficial con solo un clic. Allí podrás adjuntar la imagen de tu diseño.'
  },
  {
    q: '¿Cuál es el tiempo de producción y envío en Venezuela?',
    a: 'El tiempo estimado de producción es de 2 a 4 días hábiles tras confirmar el pago. Los envíos nacionales se realizan mediante Zoom, MRW o Tealca y tardan de 24 a 48 horas.'
  },
  {
    q: '¿Puedo enviar cualquier diseño o imagen?',
    a: '¡Sí! Aceptamos imágenes en JPG, PNG (preferible sin fondo), SVG y PDF vectorial. Se recomienda una resolución mínima de 300 DPI para asegurar la máxima nitidez.'
  },
  {
    q: '¿Ofrecen descuentos para equipos deportivos o compras al mayor?',
    a: 'Ofrecemos tarifas corporativas y para clubes deportivos a partir de 12 unidades. Contáctanos directamente vía WhatsApp para recibir una cotización personalizada.'
  }
];

export default function App() {
  const [garments, setGarments] = useState(INITIAL_GARMENTS);
  const [activeTab, setActiveTab] = useState('hero'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [selectedGarment, setSelectedGarment] = useState(INITIAL_GARMENTS[0]);
  const [garmentColor, setGarmentColor] = useState(INITIAL_GARMENTS[0].colors[0]);
  const [selectedSize, setSelectedSize] = useState('M');
  
  const [printLocation, setPrintLocation] = useState('');
  const [designNotes, setDesignNotes] = useState('');
  const [savedDesigns, setSavedDesigns] = useState([]);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  const [user, setUser] = useState(null); 
  
  // Estado para prevenir múltiples clics durante la carga
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const [authForm, setAuthForm] = useState({ 
    email: '', 
    password: '',
    confirmPassword: '', 
    firstName: '',
    lastName: '',
    stateLocation: '',
    city: '',
    phone: ''
  });

  const [newGarment, setNewGarment] = useState({
    name: '',
    category: 'Deportiva',
    price: '',
    image: '',
    sizes: 'S, M, L, XL',
    colors: '#111827, #64748B, #F8FAFC'
  });

  const activeGarments = garments.filter(g => g.active);

  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    analytics: false,
    preferences: false
  });
  const [legalModal, setLegalModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  // --- EFECTOS AL CARGAR ---
  useEffect(() => {
    const consent = localStorage.getItem('jjor_cookie_consent');
    if (!consent) {
      setShowCookieBanner(true);
    }
  }, []);

  const triggerToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleGoToCustomizer = () => {
    if (!user) {
      triggerToast('Debes crear una cuenta o iniciar sesión para personalizar prendas', 'info');
      setAuthMode('register');
      setIsAuthOpen(true);
    } else {
      setActiveTab('customizer');
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleToggleGarmentStatus = (id) => {
    setGarments(garments.map(g => g.id === id ? { ...g, active: !g.active } : g));
    triggerToast('Estado de la prenda actualizado');
  };

  const handleDeleteGarment = (id) => {
    setGarments(garments.filter(g => g.id !== id));
    triggerToast('Prenda eliminada del catálogo', 'info');
  };

  const handleAddGarment = (e) => {
    e.preventDefault();
    if (!newGarment.name || !newGarment.price) {
      triggerToast('Por favor completa el nombre y precio', 'error');
      return;
    }
    const garmentObj = {
      id: `garment-${Date.now()}`,
      name: newGarment.name,
      category: newGarment.category,
      price: parseFloat(newGarment.price) || 25.00,
      active: true,
      colors: newGarment.colors.split(',').map(c => c.trim()),
      sizes: newGarment.sizes.split(',').map(s => s.trim()),
      image: newGarment.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
      mockupType: 'tshirt'
    };
    setGarments([garmentObj, ...garments]);
    setNewGarment({ name: '', category: 'Deportiva', price: '', image: '', sizes: 'S, M, L, XL', colors: '#111827, #64748B, #F8FAFC' });
    triggerToast('¡Prenda agregada al catálogo exitosamente!');
  };

  // --- LÓGICA DE AUTENTICACIÓN REAL CON SUPABASE ---
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    
    // Verificación de Admin Manual (Bypass para el dueño de la tienda)
    if (authForm.email === 'admin@jorstore.com' && authForm.password === '24512622') {
      setUser({ 
        email: authForm.email, 
        name: 'Admin JOR',
        role: 'admin'
      });
      triggerToast('Sesión de Administrador iniciada correctamente');
      setActiveTab('admin');
      setIsAuthOpen(false);
      return;
    }

    if (!supabase) {
      triggerToast('Error: Supabase no está conectado. Revisa tu archivo .env', 'error');
      return;
    }

    setIsAuthLoading(true);

    if (authMode === 'register') {
      if (authForm.password !== authForm.confirmPassword) {
        triggerToast('Las contraseñas no coinciden.', 'error');
        setIsAuthLoading(false);
        return;
      }

      // 1. Crear el usuario en la Autenticación de Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: authForm.email,
        password: authForm.password,
      });

      if (authError) {
        triggerToast(`Error de registro: ${authError.message}`, 'error');
        setIsAuthLoading(false);
        return;
      }

      // 2. Si el registro en Auth fue exitoso, guardamos sus datos en la tabla 'profiles'
      if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: authData.user.id, // Vinculamos el ID único del usuario
            first_name: authForm.firstName,
            last_name: authForm.lastName,
            email: authForm.email,
            state: authForm.stateLocation,
            city: authForm.city,
            phone: authForm.phone
          }
        ]);

        if (profileError) {
          console.error('Error al guardar en tabla perfiles:', profileError);
          triggerToast('Usuario creado, pero hubo un error al guardar los detalles del perfil.', 'error');
        } else {
          triggerToast('¡Registro exitoso! Ya estás conectado.');
          
          setUser({ 
            id: authData.user.id,
            email: authForm.email, 
            name: `${authForm.firstName} ${authForm.lastName}`, // Nombre y apellido para mostrar
            role: 'client',
            location: `${authForm.city}, ${authForm.stateLocation}`,
            phone: authForm.phone
          });
          
          setActiveTab('customizer');
          setIsAuthOpen(false);
        }
      }

    } else {
      // MODO INICIO DE SESIÓN
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: authForm.email,
        password: authForm.password,
      });

      if (authError) {
        triggerToast('Correo o contraseña incorrectos', 'error');
        setIsAuthLoading(false);
        return;
      }

      // Si inició sesión con éxito, buscamos su nombre y apellido en la tabla 'profiles'
      if (authData.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', authForm.email)
          .single();

        let fullName = authForm.email; // Por defecto mostramos el correo si no hallamos el nombre
        let userLocation = 'Ubicación no definida';
        let userPhone = '';

        if (profileData) {
          fullName = `${profileData.first_name} ${profileData.last_name}`;
          userLocation = `${profileData.city}, ${profileData.state}`;
          userPhone = profileData.phone;
        }

        setUser({ 
          id: authData.user.id,
          email: authForm.email, 
          name: fullName,
          role: 'client',
          location: userLocation,
          phone: userPhone
        });

        triggerToast(`¡Bienvenido de nuevo, ${fullName}!`);
        setActiveTab('customizer');
        setIsAuthOpen(false);
      }
    }
    
    setIsAuthLoading(false);
  };

  const handleSignOut = async () => {
    if (user?.role !== 'admin' && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setActiveTab('hero');
    triggerToast('Sesión cerrada correctamente', 'info');
  };

  const handleAcceptAllCookies = () => {
    setCookiePreferences({ necessary: true, analytics: true, preferences: true });
    localStorage.setItem('jjor_cookie_consent', JSON.stringify({ necessary: true, analytics: true, preferences: true }));
    setShowCookieBanner(false);
    triggerToast('Preferencias de cookies guardadas');
  };

  const handleSaveCookiePreferences = () => {
    localStorage.setItem('jjor_cookie_consent', JSON.stringify(cookiePreferences));
    setShowCookieBanner(false);
    setShowCookieSettings(false);
    triggerToast('Preferencias de cookies actualizadas');
  };

  return (
    <div className="min-h-screen concrete-bg-dark text-neutral-100">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Comfortaa', sans-serif !important; }
        .concrete-bg-dark {
          background-color: #121212;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E");
        }
        .modal-scroll::-webkit-scrollbar { width: 6px; }
        .modal-scroll::-webkit-scrollbar-track { background: transparent; }
        .modal-scroll::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}</style>
      
      {toast && (
        <div className="fixed top-24 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white shadow-2xl backdrop-blur-md animate-bounce">
          {toast.type === 'info' ? <Info className="text-blue-400" /> : toast.type === 'error' ? <AlertCircle className="text-red-400" /> : <Sparkles className="text-emerald-400" />}
          <span className="font-sans text-sm font-medium">{toast.msg}</span>
        </div>
      )}

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0B0F17]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          <div 
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
            onClick={() => setActiveTab('hero')}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 transition-transform duration-300 group-hover:scale-105 flex items-center justify-center">
              <img 
                src="https://i.ibb.co/nspSqBy5/Recurso-2.png" 
                alt="Jor Store" 
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-lg sm:text-xl font-black tracking-tighter uppercase text-slate-100 leading-none">
                JOR STORE
              </span>
              <span className="block text-[9px] sm:text-[10px] tracking-[0.15em] text-slate-500 uppercase mt-1 font-bold">
                Personaliza tu estilo
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-4 lg:gap-8 font-sans text-xs lg:text-sm font-medium ml-auto mr-2 lg:mr-4">
            <button onClick={() => handleNavClick('hero')} className={`hover:text-slate-300 transition-colors ${activeTab === 'hero' ? 'text-slate-200 border-b-2 border-slate-400 pb-1' : 'text-slate-400'}`}>Inicio</button>
            <button onClick={handleGoToCustomizer} className={`hover:text-slate-300 transition-colors flex items-center gap-1 lg:gap-1.5 ${activeTab === 'customizer' ? 'text-slate-200 border-b-2 border-slate-400 pb-1' : 'text-slate-400'}`}>
              <Sparkles className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-slate-400" /> Personalizar
            </button>
            <button onClick={() => handleNavClick('catalog')} className={`hover:text-slate-300 transition-colors ${activeTab === 'catalog' ? 'text-slate-200 border-b-2 border-slate-400 pb-1' : 'text-slate-400'}`}>Catálogo</button>

            {user?.role === 'admin' && (
              <button onClick={() => handleNavClick('admin')} className={`hover:text-slate-300 transition-colors flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-full border border-slate-600 ${activeTab === 'admin' ? 'text-slate-100 border-slate-300' : 'text-slate-300'}`}>
                <Settings className="w-3.5 h-3.5 text-slate-300" /> Admin
              </button>
            )}

            <button onClick={() => handleNavClick('faq')} className={`hover:text-slate-300 transition-colors ${activeTab === 'faq' ? 'text-slate-200 border-b-2 border-slate-400 pb-1' : 'text-slate-400'}`}>Preguntas FAQ</button>
            <button onClick={() => handleNavClick('contact')} className={`hover:text-slate-300 transition-colors ${activeTab === 'contact' ? 'text-slate-200 border-b-2 border-slate-400 pb-1' : 'text-slate-400'}`}>Contacto</button>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4 md:pl-4 lg:pl-8 md:border-l border-slate-700/50 flex-shrink-0">
            {user ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleNavClick(user.role === 'admin' ? 'admin' : 'account')}
                  className="p-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 transition flex items-center justify-center"
                  title={`Mi Perfil (${user.name})`}
                >
                  <User className="w-5 h-5 text-slate-400" />
                </button>
                <button 
                  onClick={handleSignOut} 
                  className="hidden sm:flex p-2.5 rounded-lg border border-slate-800 hover:border-red-900/50 bg-slate-900/50 hover:bg-red-950/30 text-slate-500 hover:text-red-400 transition items-center justify-center"
                  title="Cerrar Sesión"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setAuthMode('login'); setIsAuthOpen(true); setIsMobileMenuOpen(false); }}
                className="p-2.5 rounded-lg bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800 text-white shadow-md hover:brightness-110 border border-slate-500/30 transition flex items-center justify-center"
                title="Ingresar o Registrarse"
              >
                <User className="w-5 h-5" />
              </button>
            )}

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="md:hidden p-2.5 rounded-lg border border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800 transition flex items-center justify-center"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div 
            className="md:hidden absolute top-20 left-0 w-full border-b border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col font-sans text-sm font-bold z-50 bg-[#121212]"
          >
            <button onClick={() => handleNavClick('hero')} className={`p-4 text-left border-b border-slate-800/50 ${activeTab === 'hero' ? 'text-slate-100 bg-slate-900/50' : 'text-slate-400'}`}>Inicio</button>
            <button onClick={handleGoToCustomizer} className={`p-4 text-left border-b border-slate-800/50 flex items-center gap-2 ${activeTab === 'customizer' ? 'text-slate-100 bg-slate-900/50' : 'text-slate-400'}`}>
              <Sparkles className="w-4 h-4" /> Personalizar
            </button>
            <button onClick={() => handleNavClick('catalog')} className={`p-4 text-left border-b border-slate-800/50 ${activeTab === 'catalog' ? 'text-slate-100 bg-slate-900/50' : 'text-slate-400'}`}>Catálogo</button>
            
            {user?.role === 'admin' && (
              <button onClick={() => handleNavClick('admin')} className={`p-4 text-left border-b border-slate-800/50 flex items-center gap-2 ${activeTab === 'admin' ? 'text-slate-100 bg-slate-900/50' : 'text-emerald-400'}`}>
                <Settings className="w-4 h-4" /> Admin / Catálogo
              </button>
            )}

            <button onClick={() => handleNavClick('faq')} className={`p-4 text-left border-b border-slate-800/50 ${activeTab === 'faq' ? 'text-slate-100 bg-slate-900/50' : 'text-slate-400'}`}>Preguntas FAQ</button>
            <button onClick={() => handleNavClick('contact')} className={`p-4 text-left ${activeTab === 'contact' ? 'text-slate-100 bg-slate-900/50' : 'text-slate-400'}`}>Contacto</button>
            
            {user && (
              <button onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }} className="p-4 text-left border-t border-slate-800 text-red-400 bg-slate-950/50">
                Cerrar Sesión
              </button>
            )}
          </div>
        )}
      </header>

      <main>
        {activeTab === 'hero' && (
          <section className="relative overflow-hidden py-20 lg:py-28 bg-[#0B0F17]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center max-w-3xl mx-auto space-y-6">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-700 bg-slate-900/80 text-slate-300 font-sans text-xs uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 text-slate-400" /> Tu estilo, tus reglas
                </span>
                <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-slate-100">
                  Crea tu estilo y viste con confianza
                </h1>
                <p className="font-sans text-slate-400 text-base sm:text-lg leading-relaxed">
                  Crea prendas personalizadas con estampados en DTF y sublimación de alto nivel. Sube tu arte, elige la posición y envía tu pedido directo a WhatsApp.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4 font-sans">
                  <button
                    onClick={handleGoToCustomizer}
                    className="px-8 py-4 bg-gradient-to-r from-slate-100 via-slate-300 to-slate-400 text-slate-950 font-extrabold text-sm uppercase tracking-wider rounded-xl hover:brightness-110 transition shadow-xl flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" /> Diseñar Mi Prenda Ahora
                  </button>
                  <button
                    onClick={() => setActiveTab('catalog')}
                    className="px-8 py-4 bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 font-bold text-sm uppercase tracking-wider rounded-xl transition"
                  >
                    Ver Catálogo
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'customizer' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8 text-center sm:text-left">
              <h2 className="text-3xl font-black tracking-wide uppercase text-slate-100">Estudio de Personalización</h2>
              <p className="font-sans text-slate-400 text-sm mt-1">Selecciona tu prenda, ajusta el diseño y genera tu pedido directo para confección.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
              <div className="lg:col-span-7 bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-2xl relative flex flex-col items-center justify-center min-h-[480px]">
                <div className="relative w-full max-w-md aspect-square flex items-center justify-center rounded-xl overflow-hidden bg-slate-950/50 border border-slate-800/50 p-4 mt-6">
                  <img src={selectedGarment.image} alt={selectedGarment.name} className="w-full h-full object-contain filter drop-shadow-2xl transition-all duration-300" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1 bg-slate-900/90 rounded-full border border-slate-700 text-xs">
                    <span>Color:</span>
                    <span className="w-3.5 h-3.5 rounded-full border border-slate-400" style={{ backgroundColor: garmentColor }}></span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 shadow-lg">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-3">Paso 1: Selecciona la Prenda Base</label>
                  <div className="grid grid-cols-2 gap-3">
                    {activeGarments.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => { setSelectedGarment(g); setGarmentColor(g.colors[0]); }}
                        className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${selectedGarment.id === g.id ? 'border-slate-300 bg-slate-800 text-slate-100 shadow-md' : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'}`}
                      >
                        <span className="font-semibold text-xs text-slate-200 block truncate">{g.name}</span>
                        <span className="text-xs text-slate-400 font-sans mt-2">${g.price.toFixed(2)} USD</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 font-semibold block mb-2">Color de Prenda:</span>
                      <div className="flex gap-2">
                        {selectedGarment.colors.map((c, idx) => (
                          <button key={idx} onClick={() => setGarmentColor(c)} className={`w-6 h-6 rounded-full border transition ${garmentColor === c ? 'scale-125 border-white shadow-lg ring-2 ring-slate-400' : 'border-slate-700 opacity-80'}`} style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-semibold block mb-2">Talla:</span>
                      <div className="flex gap-1">
                        {selectedGarment.sizes.map((s) => (
                          <button key={s} onClick={() => setSelectedSize(s)} className={`px-2.5 py-1 text-xs rounded font-bold border transition ${selectedSize === s ? 'bg-slate-200 text-slate-950 border-white' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'}`}>{s}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 shadow-lg space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block">Paso 2: Posición e Instrucciones</label>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block mb-2">Ubicación exacta del Estampado:</span>
                    <input 
                      type="text" 
                      value={printLocation}
                      onChange={(e) => setPrintLocation(e.target.value)}
                      placeholder="Ej: Pecho central, Manga izquierda, Pierna derecha..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 outline-none focus:border-slate-500"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block mb-2">Descripción o Detalles Adicionales:</span>
                    <textarea rows={3} value={designNotes} onChange={(e) => setDesignNotes(e.target.value)} placeholder="Ej: Deseo el logo en vinilo dorado reflejo, centrado exacto a la altura del pecho..." className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 outline-none focus:border-slate-500" />
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <div className="p-4 rounded-xl text-center shadow-lg transition-colors bg-amber-900/30 border border-amber-500/50">
                    <span className="font-black text-sm uppercase tracking-wider block mb-1 flex items-center justify-center gap-2 text-amber-400">
                      <AlertCircle className="w-5 h-5" /> ¡Importante!
                    </span>
                    <span className="text-xs font-bold text-amber-100">
                      Recuerda enviarnos por WhatsApp la imagen de tu diseño para poder comenzar.
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      const clientData = `Cliente: ${user.name}\nUbicación: ${user.location}\nTeléfono: ${user.phone || 'No registrado'}`;
                      const text = `*NUEVO PEDIDO JOR STORE*\n${clientData}\n\n*DETALLES DE LA PRENDA*\nPrenda: ${selectedGarment.name}\nPrecio: $${selectedGarment.price}\nTalla: ${selectedSize}\nUbicación del diseño: ${printLocation || 'No especificada'}\nNotas: ${designNotes || 'Sin notas especiales'}\n\n⚠️ *(Hola! Recuerda adjuntar aquí la imagen de tu diseño para poder confeccionarlo)*`;
                      window.open(`https://wa.me/584124326178?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg transition"
                  >
                    <MessageCircle className="w-5 h-5 fill-current" /> Pedir por WhatsApp Ahora
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'catalog' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black tracking-wide uppercase text-slate-100">Catálogo de Prendas Base</h2>
              <p className="font-sans text-slate-400 text-sm mt-2 max-w-xl mx-auto">Explora nuestras telas técnicas y cortes listos para ser estampados con tu marca o diseño personal.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 font-sans">
              {activeGarments.map((g) => (
                <div key={g.id} className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-600 transition flex flex-col group">
                  <div className="relative h-64 overflow-hidden bg-slate-950">
                    <img src={g.image} alt={g.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <span className="absolute top-3 left-3 bg-slate-900/90 text-slate-300 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border border-slate-700">{g.category}</span>
                  </div>
                  <div className="p-5 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="font-bold text-slate-200 text-base">{g.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 font-sans">Tallas: {g.sizes.join(', ')}</p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-lg font-black text-slate-100">${g.price.toFixed(2)} USD</span>
                      <button onClick={() => { 
                        setSelectedGarment(g); 
                        setGarmentColor(g.colors[0]); 
                        handleGoToCustomizer(); 
                      }} className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition">Personalizar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'faq' && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black uppercase text-slate-100">Preguntas Frecuentes</h2>
              <p className="text-slate-400 text-sm mt-2">Todo lo que necesitas saber sobre personalización, telas y entregas.</p>
            </div>
            <div className="space-y-4">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                  <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full p-5 text-left font-bold text-sm text-slate-200 flex justify-between items-center hover:bg-slate-900/50 transition">
                    <span>{faq.q}</span>
                    {openFaq === idx ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {openFaq === idx && <div className="p-5 border-t border-slate-800/80 bg-slate-950/40 text-xs text-slate-400 leading-relaxed">{faq.a}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'contact' && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black uppercase text-slate-100">Contáctanos Directamente</h2>
              <p className="text-slate-400 text-sm mt-2">¿Tienes una orden especial o duda técnica? Escríbenos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#111827] border border-slate-800 p-8 rounded-2xl shadow-xl">
                <h3 className="font-bold text-slate-200 text-lg mb-4">Envíanos un Mensaje</h3>
                <form onSubmit={(e) => { e.preventDefault(); triggerToast('Mensaje enviado correctamente'); }} className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-1">Nombre</label>
                    <input type="text" required className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-3 outline-none focus:border-slate-500" placeholder="Tu nombre" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-1">Correo Electrónico</label>
                    <input type="email" required className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-3 outline-none focus:border-slate-500" placeholder="correo@ejemplo.com" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-1">Mensaje o Consulta</label>
                    <textarea rows={4} required className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-3 outline-none focus:border-slate-500" placeholder="¿Cómo podemos ayudarte?"></textarea>
                  </div>
                  <button type="submit" className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" /> Enviar Mensaje
                  </button>
                </form>
              </div>

              <div className="bg-[#111827] border border-slate-800 p-8 rounded-2xl shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-200 text-lg mb-2">Canales Directos</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">Atención personalizada de Lunes a Sábado de 8:00 AM a 6:00 PM (Hora de Venezuela).</p>
                  <div className="space-y-4">
                    <a href="https://wa.me/584124326178" target="_blank" rel="noreferrer" className="p-4 rounded-xl border border-emerald-800/40 bg-emerald-950/20 hover:bg-emerald-950/40 flex items-center justify-between text-emerald-400 transition">
                      <div className="flex items-center gap-3">
                        <MessageCircle className="w-6 h-6" />
                        <div>
                          <span className="font-bold text-sm block text-emerald-300">WhatsApp Oficial</span>
                          <span className="text-xs text-emerald-500">+58 412 432 6178</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold uppercase bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-700">Chat</span>
                    </a>
                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex items-center gap-3">
                      <Info className="w-5 h-5 text-slate-400" />
                      <div>
                        <span className="font-bold text-xs text-slate-300 block">Correo Electrónico Legal & Soporte</span>
                        <span className="text-xs text-slate-400">8ajjor@gmail.com</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-500">Ubicación: Venezuela • Envíos a nivel nacional</div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'admin' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-8">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest block">Panel del Administrador</span>
                <h2 className="text-3xl font-black text-slate-100">Gestión de Prendas del Catálogo</h2>
              </div>
              <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-full">{garments.length} Prendas registradas</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-slate-400" /> Agregar Nueva Prenda al Sitio
                </h3>

                <form onSubmit={handleAddGarment} className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-1">Nombre de la Prenda</label>
                    <input type="text" required value={newGarment.name} onChange={(e) => setNewGarment({ ...newGarment, name: e.target.value })} placeholder="Ej: Camiseta Oversize Obsidian" className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-3 outline-none focus:border-slate-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 font-semibold block mb-1">Precio ($ USD)</label>
                      <input type="number" step="0.01" required value={newGarment.price} onChange={(e) => setNewGarment({ ...newGarment, price: e.target.value })} placeholder="30.00" className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-3 outline-none focus:border-slate-500" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 font-semibold block mb-1">Categoría</label>
                      <select value={newGarment.category} onChange={(e) => setNewGarment({ ...newGarment, category: e.target.value })} className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-3 outline-none focus:border-slate-500">
                        <option value="Deportiva">Deportiva</option>
                        <option value="Urban / Sport">Urban / Sport</option>
                        <option value="Fitness">Fitness</option>
                        <option value="Competición">Competición</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-1">URL de la Imagen (o Supabase Storage)</label>
                    <input type="url" value={newGarment.image} onChange={(e) => setNewGarment({ ...newGarment, image: e.target.value })} placeholder="https://..." className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-3 outline-none focus:border-slate-500" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-1">Tallas Disponibles (Separadas por coma)</label>
                    <input type="text" value={newGarment.sizes} onChange={(e) => setNewGarment({ ...newGarment, sizes: e.target.value })} className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-3 outline-none focus:border-slate-500" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-1">Colores HEX (Separados por coma)</label>
                    <input type="text" value={newGarment.colors} onChange={(e) => setNewGarment({ ...newGarment, colors: e.target.value })} className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-3 outline-none focus:border-slate-500" />
                  </div>
                  <button type="submit" className="w-full py-3 bg-gradient-to-r from-slate-200 via-slate-400 to-slate-200 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-110 transition shadow-lg mt-2">Guardar y Publicar Prenda</button>
                </form>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-lg font-bold text-slate-200 mb-4">Inventario Visible en la Plataforma</h3>
                {garments.map((g) => (
                  <div key={g.id} className={`p-4 rounded-xl border transition flex items-center justify-between gap-4 ${g.active ? 'bg-[#111827] border-slate-800' : 'bg-slate-950/70 border-slate-900 opacity-60'}`}>
                    <img src={g.image} alt={g.name} className="w-16 h-16 object-cover rounded-lg bg-slate-950 border border-slate-800" />
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-200">{g.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${g.active ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-red-950 text-red-400 border-red-800'}`}>{g.active ? 'Activa / Visible' : 'Oculta'}</span>
                      </div>
                      <span className="text-xs text-slate-400 block mt-1">${g.price.toFixed(2)} USD • Cat: {g.category}</span>
                      <span className="text-[11px] text-slate-500 block">Tallas: {g.sizes.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleToggleGarmentStatus(g.id)} className={`p-2 rounded-lg border text-xs flex items-center gap-1 transition ${g.active ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-emerald-950 text-emerald-300 border-emerald-800'}`}>
                        {g.active ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-slate-500" />}
                      </button>
                      <button onClick={() => handleDeleteGarment(g.id)} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-red-400 hover:bg-red-950/40 hover:border-red-800 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* --- SECCIÓN DE PERFIL ACTUALIZADA --- */}
        {activeTab === 'account' && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans">
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-6">
                <div>
                  {/* Cambio de título y detalle de usuario solicitado */}
                  <h2 className="text-2xl font-bold text-slate-100">Mi perfil</h2>
                  <p className="text-sm font-semibold text-slate-300 mt-2">Usuario: <span className="text-slate-100">{user?.name}</span></p>
                  <p className="text-xs text-slate-500 mt-1">Correo: {user?.email}</p>
                </div>
                <button onClick={handleSignOut} className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-red-400 hover:bg-slate-800 transition">Cerrar Sesión</button>
              </div>

              <h3 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-400" /> Mis Diseños Guardados ({savedDesigns.length})
              </h3>

              {savedDesigns.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl">
                  <Shirt className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm font-medium">Aún no has guardado ningún diseño personalizado.</p>
                  <button onClick={() => setActiveTab('customizer')} className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition">Crear mi primer diseño</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedDesigns.map((d) => (
                    <div key={d.id} className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 flex gap-4 items-center">
                      {d.image ? <img src={d.image} alt="Thumb" className="w-16 h-16 object-contain rounded bg-slate-950 p-1 border border-slate-800" /> : <div className="w-16 h-16 rounded bg-slate-950 flex items-center justify-center border border-slate-800 text-xs text-slate-600">Sin Foto</div>}
                      <div className="flex-grow">
                        <span className="font-bold text-sm text-slate-200 block">{d.garment}</span>
                        <span className="text-xs text-slate-400 block">Talla: {d.size} | Color: {d.color}</span>
                        <span className="text-[10px] text-slate-500 block mt-1">Guardado el: {d.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* --- AUTH MODAL --- */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans">
          <div className="bg-[#111827] border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto modal-scroll">
            <button onClick={() => setIsAuthOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-bold text-slate-100 mb-1">
              {authMode === 'login' ? 'Iniciar Sesión en Jor Store' : 'Crear Cuenta de Cliente'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {authMode === 'login' ? 'Accede a tu historial y diseña tus prendas.' : 'Regístrate para poder personalizar y pedir prendas.'}
            </p>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 font-semibold block mb-1">Nombre *</label>
                      <input type="text" required value={authForm.firstName} onChange={(e) => setAuthForm({ ...authForm, firstName: e.target.value })} className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 outline-none focus:border-slate-500" placeholder="Ej: Juan" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 font-semibold block mb-1">Apellido *</label>
                      <input type="text" required value={authForm.lastName} onChange={(e) => setAuthForm({ ...authForm, lastName: e.target.value })} className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 outline-none focus:border-slate-500" placeholder="Ej: Pérez" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 font-semibold block mb-1">Estado *</label>
                      <input type="text" required value={authForm.stateLocation} onChange={(e) => setAuthForm({ ...authForm, stateLocation: e.target.value })} className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 outline-none focus:border-slate-500" placeholder="Ej: Aragua" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 font-semibold block mb-1">Ciudad *</label>
                      <input type="text" required value={authForm.city} onChange={(e) => setAuthForm({ ...authForm, city: e.target.value })} className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 outline-none focus:border-slate-500" placeholder="Ej: Maracay" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-1">Teléfono (Opcional)</label>
                    <input type="tel" value={authForm.phone} onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })} className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 outline-none focus:border-slate-500" placeholder="+58 412 1234567" />
                  </div>
                </>
              )}
              
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Correo Electrónico *</label>
                <input type="email" required value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 outline-none focus:border-slate-500" placeholder="correo@ejemplo.com" />
              </div>
              
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Contraseña *</label>
                <input type="password" required value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 outline-none focus:border-slate-500" placeholder="••••••••" />
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Repite Contraseña *</label>
                  <input type="password" required value={authForm.confirmPassword} onChange={(e) => setAuthForm({ ...authForm, confirmPassword: e.target.value })} className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 outline-none focus:border-slate-500" placeholder="••••••••" />
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={isAuthLoading}
                className="w-full py-3 mt-2 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition shadow-md disabled:opacity-50"
              >
                {isAuthLoading ? 'Procesando...' : (authMode === 'login' ? 'Entrar a mi cuenta' : 'Completar Registro')}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
              {authMode === 'login' ? (
                <span>¿No tienes cuenta? <button onClick={() => setAuthMode('register')} className="text-slate-200 font-bold underline">Regístrate aquí</button></span>
              ) : (
                <span>¿Ya tienes cuenta? <button onClick={() => setAuthMode('login')} className="text-slate-200 font-bold underline">Inicia Sesión</button></span>
              )}
            </div>
          </div>
        </div>
      )}

      {showCookieBanner && (
        <div className="fixed bottom-0 inset-x-0 z-50 p-4 font-sans bg-[#0B0F17]/95 border-t border-slate-800 shadow-2xl backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-slate-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-slate-200">Privacidad y Protección de Datos</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-3xl">Utilizamos cookies necesarias para el correcto funcionamiento de Jor Store y para mejorar tu experiencia de personalización. Cumplimos con la regulación venezolana (Art. 28 y 60 CRBV) y normativas internacionales GDPR.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              <button onClick={() => setShowCookieSettings(true)} className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 transition">Configurar</button>
              <button onClick={handleAcceptAllCookies} className="px-5 py-2 text-xs font-bold text-slate-950 bg-slate-200 hover:bg-white rounded-lg transition uppercase tracking-wider">Aceptar Todas</button>
            </div>
          </div>
        </div>
      )}

      {showCookieSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans">
          <div className="bg-[#111827] border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
            <button onClick={() => setShowCookieSettings(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Panel de Preferencias de Cookies</h3>
            <p className="text-xs text-slate-400 mb-6">Gestiona tus preferencias de privacidad por categoría:</p>

            <div className="space-y-4">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-200 block">Cookies Necesarias (Técnicas)</span>
                  <span className="text-[11px] text-slate-400">Requeridas para sesión y guardar tus diseños.</span>
                </div>
                <input type="checkbox" checked disabled className="accent-slate-400" />
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-200 block">Cookies Analíticas</span>
                  <span className="text-[11px] text-slate-400">Nos ayudan a entender cómo se usa la web.</span>
                </div>
                <input type="checkbox" checked={cookiePreferences.analytics} onChange={(e) => setCookiePreferences({ ...cookiePreferences, analytics: e.target.checked })} className="accent-slate-400 w-4 h-4 cursor-pointer" />
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-200 block">Cookies de Preferencias</span>
                  <span className="text-[11px] text-slate-400">Recuerdan tu modo oscuro y configuraciones.</span>
                </div>
                <input type="checkbox" checked={cookiePreferences.preferences} onChange={(e) => setCookiePreferences({ ...cookiePreferences, preferences: e.target.checked })} className="accent-slate-400 w-4 h-4 cursor-pointer" />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={handleSaveCookiePreferences} className="w-full py-2.5 bg-slate-200 text-slate-950 font-bold text-xs rounded-lg uppercase tracking-wider hover:bg-white transition">Guardar Preferencias</button>
            </div>
          </div>
        </div>
      )}

      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans">
          <div className="bg-[#111827] border border-slate-700 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 shadow-2xl relative">
            <button onClick={() => setLegalModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            {legalModal === 'privacy' && (
              <div>
                <h3 className="text-xl font-bold text-slate-100 mb-4">Política de Privacidad (GDPR & CRBV)</h3>
                <div className="text-xs text-slate-400 space-y-3 leading-relaxed">
                  <p><strong>Responsable del Tratamiento:</strong> Jor Store (Contacto: 8ajjor@gmail.com).</p>
                  <p><strong>Marco Legal Aplicable:</strong> Constitución de la República Bolivariana de Venezuela (Artículos 28 y 60) y GDPR.</p>
                </div>
              </div>
            )}
            {legalModal === 'cookies' && (
              <div>
                <h3 className="text-xl font-bold text-slate-100 mb-4">Política de Cookies</h3>
                <div className="text-xs text-slate-400 space-y-3 leading-relaxed">
                  <p>Esta política detalla el uso de cookies en Jor Store.</p>
                </div>
              </div>
            )}
            {legalModal === 'terms' && (
              <div>
                <h3 className="text-xl font-bold text-slate-100 mb-4">Términos y Condiciones de Servicio</h3>
                <div className="text-xs text-slate-400 space-y-3 leading-relaxed">
                  <p>1. <strong>Diseños del Usuario:</strong> El cliente garantiza ser propietario o poseer los derechos sobre cualquier imagen cargada.</p>
                </div>
              </div>
            )}
            <div className="mt-6 pt-4 border-t border-slate-800 text-right">
              <button onClick={() => setLegalModal(null)} className="px-4 py-2 bg-slate-800 text-slate-200 text-xs font-bold rounded-lg hover:bg-slate-700">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-slate-800 text-slate-400 font-sans text-xs py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <img src="https://i.ibb.co/nspSqBy5/Recurso-2.png" alt="Jor Store Logo" className="w-full h-full object-contain drop-shadow-md" />
              </div>
              <span className="font-black text-xl text-slate-200 uppercase tracking-tighter">JOR STORE</span>
            </div>
            <p className="text-slate-500 leading-relaxed">Tienda de personalización de prendas de vestir</p>
          </div>

          <div>
            <h5 className="font-bold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">Navegación</h5>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveTab('hero')} className="hover:text-slate-200">Inicio</button></li>
              <li><button onClick={handleGoToCustomizer} className="hover:text-slate-200">Personalizador</button></li>
              <li><button onClick={() => setActiveTab('catalog')} className="hover:text-slate-200">Catálogo Base</button></li>
              <li><button onClick={() => setActiveTab('faq')} className="hover:text-slate-200">Preguntas Frecuentes</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">Legales & Privacidad</h5>
            <ul className="space-y-2">
              <li><button onClick={() => setLegalModal('privacy')} className="hover:text-slate-200">Política de Privacidad</button></li>
              <li><button onClick={() => setLegalModal('cookies')} className="hover:text-slate-200">Política de Cookies</button></li>
              <li><button onClick={() => setLegalModal('terms')} className="hover:text-slate-200">Términos y Condiciones</button></li>
              <li><button onClick={() => setShowCookieSettings(true)} className="hover:text-slate-200 text-slate-400 font-semibold underline">Configurar Cookies</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">Contacto Legal</h5>
            <p className="text-slate-500 mb-2">Responsable del Tratamiento:</p>
            <p className="font-semibold text-slate-300">8ajjor@gmail.com</p>
            <p className="text-slate-500 mt-2">Venezuela (CRBV Art. 28 / 60)</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800/60 text-center text-slate-600 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>© {new Date().getFullYear()} Jor Store. Todos los derechos reservados.</span>
          <span className="text-[10px] bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-400">Powered by React & Supabase Architecture</span>
        </div>
      </footer>
    </div>
  );
}
