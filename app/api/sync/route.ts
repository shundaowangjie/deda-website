import { NextRequest, NextResponse } from 'next/server'
import { dbSync } from '@/lib/database-sync'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const table = searchParams.get('table')

    switch (action) {
      case 'connection':
        // 检查数据库连接状态
        const connection = await dbSync.checkConnection()
        return NextResponse.json(connection)

      case 'stats':
        // 获取表统计信息
        if (!table) {
          return NextResponse.json({ error: '缺少表名参数' }, { status: 400 })
        }
        const stats = await dbSync.getTableStats(table)
        return NextResponse.json(stats)

      case 'history':
        // 获取同步历史
        const history = await dbSync.getSyncHistory(table || undefined)
        return NextResponse.json(history)

      default:
        return NextResponse.json({ error: '不支持的操作' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json(
      { 
        error: '操作失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { direction = 'up', tables = ['products'], dryRun = false, backup = true } = body

    // 验证参数
    if (!['up', 'down', 'bidirectional'].includes(direction)) {
      return NextResponse.json({ error: '无效的同步方向' }, { status: 400 })
    }

    if (!Array.isArray(tables) || tables.length === 0) {
      return NextResponse.json({ error: '缺少表名列表' }, { status: 400 })
    }

    // 如果是测试模式，只返回预览信息
    if (dryRun) {
      const preview = {
        message: '预览模式 - 不会实际执行同步',
        direction,
        tables,
        backup,
        timestamp: new Date().toISOString()
      }
      return NextResponse.json(preview)
    }

    // 执行同步
    const results = await dbSync.performSync({
      direction,
      tables,
      dryRun,
      backup
    })

    return NextResponse.json({
      message: '同步完成',
      results,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json(
      { 
        error: '同步失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}