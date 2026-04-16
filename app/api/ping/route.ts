import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Keep-alive: Iniciando ping no Supabase...');
    
    // Executa uma consulta simples para manter o banco ativo
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Keep-alive: Erro ao consultar Supabase:', error.message);
      return NextResponse.json(
        { status: 'error', message: error.message },
        { status: 500 }
      );
    }

    console.log('Keep-alive: Ping realizado com sucesso!');
    return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('Keep-alive: Erro inesperado:', err);
    return NextResponse.json(
      { status: 'error', message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
