// Import du client Supabase depuis le CDN officiel
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// Récupération dynamique des clés injectées par Vite
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// Vérification de sécurité en développement
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("Attention : Les variables d'environnement Supabase ne sont pas configurées !");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
