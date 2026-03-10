import { Platform, PlatformAdapter, StreamStatus } from '../interface';

/**
 * 虎牙直播适配器
 */
export class HuyaAdapter implements PlatformAdapter {
  readonly name: Platform = 'huya';
  private logger: any;

  constructor(logger: any) {
    this.logger = logger;
  }

  async getStreamerStatus(streamerId: string): Promise<StreamStatus> {
    const url = `https://mp.huya.com/cache.php?m=Live&do=profileRoom&roomid=${streamerId}`;
    try {
      const data = await this.fetchJson<any>(url);

      if (data.status !== 200) {
        throw new Error(`Huya API error: ${data.message || 'Unknown error'}`);
      }

      const roomInfo = data.data;

      return {
        isLive: roomInfo.liveStatus === 'ON',
        roomId: roomInfo.profileRoom,
        streamerId: roomInfo.profileRoom,
        title: roomInfo.introduction || '',
        viewerCount: parseInt(roomInfo.totalCount) || 0,
        startTime:
          roomInfo.liveStatus === 'ON' ? roomInfo.liveTime * 1000 : undefined,
      };
    } catch (error) {
      this.logger?.error('Failed to get Huya streamer status', {
        streamerId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async getStreamUrl(streamerId: string): Promise<string> {
    this.logger?.warn('Huya stream URL parsing not fully implemented', {
      streamerId,
    });
    return `https://huya.com/${streamerId}`;
  }

  async getDanmakuUrl(streamerId: string): Promise<string> {
    this.logger?.warn('Huya danmaku URL parsing not fully implemented', {
      streamerId,
    });
    return `wss://huya.com/${streamerId}`;
  }

  async validateStreamerId(streamerId: string): Promise<boolean> {
    try {
      await this.getStreamerStatus(streamerId);
      return true;
    } catch {
      return false;
    }
  }

  protected async fetchJson<T = any>(
    url: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      this.logger?.error('Fetch failed', {
        url,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}
