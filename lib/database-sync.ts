import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { getSupabase } from './supabase'

export interface SyncConfig {
  direction: 'up' | 'down' | 'bidirectional'
  tables: string[]
  dryRun?: boolean
  backup?: boolean
}

type SyncDirection = 'up' | 'down' | 'bidirectional'

export interface SyncResult {
  table: string
  direction: 'up' | 'down' | 'bidirectional'
  records: {
    added: number
    updated: number
    deleted: number
    errors: string[]
  }
  timestamp: string
}

export class DatabaseSync {
  private client: SupabaseClient
  private serviceClient: SupabaseClient

  constructor() {
    this.client = getSupabase()
    this.serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }

  async checkConnection(): Promise<{
    remote: boolean
    local: boolean
    error?: string
  }> {
    try {
      // 检查远程数据库连接
      const { error: remoteError } = await this.client
        .from('products')
        .select('count')
        .limit(1)
      
      const remoteConnected = !remoteError

      // 检查本地数据库连接
      const { error: localError } = await this.serviceClient
        .from('products')
        .select('count')
        .limit(1)

      const localConnected = !localError

      return {
        remote: remoteConnected,
        local: localConnected,
        error: remoteError || localError ? '数据库连接错误' : undefined
      }
    } catch (error) {
      return {
        remote: false,
        local: false,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  async getTableStats(table: string): Promise<{
    remoteCount: number
    localCount: number
    lastSync?: string
  }> {
    try {
      // 获取远程数据库记录数
      const { count: remoteCount } = await this.client
        .from(table)
        .select('*', { count: 'exact', head: true })

      // 获取本地数据库记录数
      const { count: localCount } = await this.serviceClient
        .from(table)
        .select('*', { count: 'exact', head: true })

      // 获取最后同步时间
      const { data: syncData } = await this.serviceClient
        .from('sync_log')
        .select('last_sync')
        .eq('table_name', table)
        .single()

      return {
        remoteCount: remoteCount || 0,
        localCount: localCount || 0,
        lastSync: syncData?.last_sync
      }
    } catch (error) {
      throw new Error(`获取表 ${table} 统计信息失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  async performSync(config: SyncConfig): Promise<SyncResult[]> {
    const results: SyncResult[] = []

    for (const table of config.tables) {
      try {
        const result = await this.syncTable(table, config)
        results.push(result)
      } catch (error) {
        results.push({
          table,
          direction: config.direction as SyncDirection,
          records: {
            added: 0,
            updated: 0,
            deleted: 0,
            errors: [error instanceof Error ? error.message : '未知错误']
          },
          timestamp: new Date().toISOString()
        })
      }
    }

    return results
  }

  private async syncTable(table: string, config: SyncConfig): Promise<SyncResult> {
    const direction = config.direction as SyncDirection
    const result: SyncResult = {
      table,
      direction,
      records: {
        added: 0,
        updated: 0,
        deleted: 0,
        errors: []
      },
      timestamp: new Date().toISOString()
    }

    try {
      if (direction === 'up' || direction === 'bidirectional') {
        // 从远程同步到本地
        const { data: remoteData, error: fetchError } = await this.client
          .from(table)
          .select('*')

        if (fetchError) {
          result.records.errors.push(`获取远程数据失败: ${fetchError.message}`)
          return result
        }

        if (remoteData && remoteData.length > 0) {
          // 备份现有数据（如果配置了备份）
          if (config.backup) {
            await this.backupTable(table)
          }

          // 批量插入/更新数据
          const { error: upsertError } = await this.serviceClient
            .from(table)
            .upsert(remoteData, { onConflict: 'id' })

          if (upsertError) {
            result.records.errors.push(`同步到本地失败: ${upsertError.message}`)
          } else {
            result.records.added = remoteData.length
          }
        }
      }

      if (direction === 'down' || direction === 'bidirectional') {
        // 从本地同步到远程
        const { data: localData, error: fetchError } = await this.serviceClient
          .from(table)
          .select('*')

        if (fetchError) {
          result.records.errors.push(`获取本地数据失败: ${fetchError.message}`)
          return result
        }

        if (localData && localData.length > 0) {
          const { error: upsertError } = await this.client
            .from(table)
            .upsert(localData, { onConflict: 'id' })

          if (upsertError) {
            result.records.errors.push(`同步到远程失败: ${upsertError.message}`)
          } else {
            result.records.updated = localData.length
          }
        }
      }

      // 记录同步日志
      await this.logSync(table, direction, result.records)

    } catch (error) {
      result.records.errors.push(error instanceof Error ? error.message : '未知错误')
    }

    return result
  }

  private async backupTable(table: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupTable = `${table}_backup_${timestamp}`
    
    try {
      // 创建备份表
      await this.serviceClient.rpc('exec', {
        query: `CREATE TABLE IF NOT EXISTS ${backupTable} AS SELECT * FROM ${table} WITH NO DATA`
      })

      // 复制数据
      await this.serviceClient.rpc('exec', {
        query: `INSERT INTO ${backupTable} SELECT * FROM ${table}`
      })
    } catch (error) {
      console.warn(`备份表 ${table} 失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  private async logSync(table: string, direction: string, records: any): Promise<void> {
    try {
      await this.serviceClient.from('sync_log').upsert({
        table_name: table,
        direction,
        added_count: records.added,
        updated_count: records.updated,
        deleted_count: records.deleted,
        error_count: records.errors.length,
        last_sync: new Date().toISOString()
      }, { onConflict: 'table_name' })
    } catch (error) {
      console.warn(`记录同步日志失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  async getSyncHistory(table?: string): Promise<any[]> {
    try {
      let query = this.serviceClient.from('sync_log').select('*')
      if (table) {
        query = query.eq('table_name', table)
      }
      const { data, error } = await query.order('last_sync', { ascending: false })
      if (error) {
        throw new Error(`获取同步历史失败: ${error.message}`)
      }
      return data || []
    } catch (error) {
      throw new Error(`获取同步历史失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }
}

// 导出同步工具实例
export const dbSync = new DatabaseSync()