import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 检查环境变量是否正确配置
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      supabase: {
        url: supabaseUrl ? 'configured' : 'missing',
        anonKey: supabaseAnonKey ? 'configured' : 'missing',
        serviceRoleKey: supabaseServiceRoleKey ? 'configured' : 'missing'
      }
    }

    return NextResponse.json(healthStatus)
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}