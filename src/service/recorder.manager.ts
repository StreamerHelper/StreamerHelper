import {
  App,
  Config,
  Inject,
  ILogger,
  Logger,
  Provide,
  Scope,
  ScopeEnum,
} from '@midwayjs/core';
import { Application } from '@midwayjs/koa';
import { Framework } from '@midwayjs/bullmq';
import { JOB_STATUS, Platform } from '../interface';
import { DanmakuManager } from './danmaku.service';
import { JobService } from './job.service';
import {
  Recording,
  RecordingEndEvent,
  RecordingInputOptions,
} from './recording';

/**
 * 录制管理器（单例）
 *
 * 职责：
 * - 管理所有活跃的 Recording 实例
 * - 提供启动/停止录制的接口
 * - 处理录制结束后的清理工作
 * - 提供查询活跃录制的方法
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class RecorderManager {
  @App()
  app: Application;

  @Config('livestream.recorder')
  private recorderConfig: {
    heartbeatInterval: number;
    heartbeatTimeout: number;
    maxRecordingTime: number;
  };

  @Inject()
  jobService: JobService;

  @Inject()
  danmakuManager: DanmakuManager;

  @Inject()
  bullFramework: Framework;

  @Logger()
  private logger: ILogger;

  /**
   * 活跃录制映射
   * key: `${platform}:${streamerId}`
   * value: Recording 实例
   */
  private recordings = new Map<string, Recording>();

  /**
   * 生成录制 key
   */
  private getRecordingKey(platform: Platform, streamerId: string): string {
    return `recording:${platform}:${streamerId}`;
  }

  /**
   * 启动录制
   *
   * @param platform 平台
   * @param streamerId 主播ID
   * @param options 录制选项
   * @returns Recording 实例
   * @throws {Error} 如果已在录制
   */
  async startRecording(
    platform: Platform,
    streamerId: string,
    options: RecordingInputOptions
  ): Promise<Recording> {
    const key = this.getRecordingKey(platform, streamerId);

    // 检查是否已有录制实例
    if (this.recordings.has(key)) {
      throw new Error(`Recording already exists for ${platform}:${streamerId}`);
    }

    this.logger.info('Starting recording', {
      id: options.id,
      jobId: options.jobId,
      platform,
      streamerId,
    });

    // 创建 Recording 实例
    const recording = new Recording({
      ...options,
      services: {
        jobService: this.jobService,
        danmakuManager: this.danmakuManager,
        bullFramework: this.bullFramework,
        app: this.app,
      },
      logger: this.logger,
      recordingConfig: {
        heartbeatInterval: this.recorderConfig.heartbeatInterval * 1000, // 秒转毫秒
        heartbeatTimeout: this.recorderConfig.heartbeatTimeout * 1000, // 秒转毫秒
        maxRecordingTime: this.recorderConfig.maxRecordingTime * 1000, // 秒转毫秒
      },
    });

    // 注册到管理器
    this.recordings.set(key, recording);

    // 监听结束事件，自动清理（once: true 确保监听器只触发一次并自动移除）
    recording.onceEnd((data: RecordingEndEvent) => {
      this.logger.info('Recording ended', {
        id: recording.id,
        platform,
        streamerId,
        reason: data.reason,
        error: data.error,
        videoSegments: data.videoSegments,
        danmakuSegments: data.danmakuSegments,
      });

      // 从管理器中移除
      this.recordings.delete(key);
    });

    // 启动录制（异步）
    recording.start().catch(error => {
      this.logger.error('Recording start failed', {
        id: options.id,
        platform,
        streamerId,
        error: error instanceof Error ? error.message : String(error),
      });
    });

    this.logger.info('Recording started', {
      id: options.id,
      platform,
      streamerId,
      activeRecordings: this.recordings.size,
    });

    return recording;
  }

  /**
   * 停止录制
   *
   * @param platform 平台
   * @param streamerId 主播ID
   */
  async stopRecording(platform: Platform, streamerId: string): Promise<void> {
    const key = this.getRecordingKey(platform, streamerId);
    const recording = this.recordings.get(key);

    if (!recording) {
      this.logger.warn('Recording not found', { platform, streamerId });
      return;
    }

    this.logger.info('Stopping recording', {
      id: recording.id,
      platform,
      streamerId,
    });

    // 更新 Job 状态为 STOPPING
    await this.jobService.updateStatus(recording.id, JOB_STATUS.STOPPING);

    this.logger.info('Recording stop requested', {
      id: recording.id,
      platform,
      streamerId,
    });
  }

  /**
   * 获取录制实例
   *
   * @param platform 平台
   * @param streamerId 主播ID
   * @returns Recording 实例或 undefined
   */
  getRecording(platform: Platform, streamerId: string): Recording | undefined {
    const key = this.getRecordingKey(platform, streamerId);
    return this.recordings.get(key);
  }

  /**
   * 检查是否正在录制
   *
   * @param platform 平台
   * @param streamerId 主播ID
   * @returns 是否正在录制
   */
  isRecording(platform: Platform, streamerId: string): boolean {
    const key = this.getRecordingKey(platform, streamerId);
    return this.recordings.has(key);
  }

  /**
   * 获取所有活跃录制
   *
   * @returns Recording 实例数组
   */
  getActiveRecordings(): Recording[] {
    return Array.from(this.recordings.values());
  }

  /**
   * 获取活跃录制数量
   *
   * @returns 活跃录制数量
   */
  getActiveCount(): number {
    return this.recordings.size;
  }

  /**
   * 获取所有活跃录制的信息
   *
   * @returns 录制信息数组
   */
  getActiveRecordingsInfo(): Array<ReturnType<Recording['getInfo']>> {
    return Array.from(this.recordings.values()).map(r => r.getInfo());
  }

  /**
   * 停止所有录制
   */
  async stopAll(): Promise<void> {
    this.logger.info('Stopping all recordings', {
      count: this.recordings.size,
    });

    const promises = Array.from(this.recordings.values()).map(recording =>
      this.stopRecording(recording.platform, recording.streamerId)
    );

    await Promise.all(promises);
  }
}
