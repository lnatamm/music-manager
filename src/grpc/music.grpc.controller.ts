import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { SupabaseService } from '../supabase/supabase.service';

interface Empty {}

interface Music {
  id: number;
  name: string;
  artist: string;
}

interface MusicById {
  id: number;
}

interface CreateMusicRequest {
  name: string;
  artist: string;
}

interface UpdateMusicRequest {
  id: number;
  name?: string;
  artist?: string;
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

@Controller()
export class MusicGrpcController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @GrpcMethod('MusicService', 'FindAll')
  async findAll(data: Empty): Promise<{ musics: Music[] }> {
    const { data: musics, error } =
      await this.supabaseService.music.select('*');
    if (error) throw new Error(error.message);
    return { musics: musics || [] };
  }

  @GrpcMethod('MusicService', 'FindOne')
  async findOne(data: MusicById): Promise<Music> {
    const { data: music, error } = await this.supabaseService.music
      .select('*')
      .eq('id', data.id)
      .single();
    if (error) throw new Error(error.message);
    return music;
  }

  @GrpcMethod('MusicService', 'Create')
  async create(data: CreateMusicRequest): Promise<Music> {
    const { data: music, error } = await this.supabaseService.music
      .insert(data)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return music;
  }

  @GrpcMethod('MusicService', 'Update')
  async update(data: UpdateMusicRequest): Promise<Music> {
    const { id, ...updateData } = data;
    const { data: music, error } = await this.supabaseService.music
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return music;
  }

  @GrpcMethod('MusicService', 'Delete')
  async remove(data: MusicById): Promise<DeleteResponse> {
    const { error } = await this.supabaseService.music
      .delete()
      .eq('id', data.id);
    if (error) throw new Error(error.message);
    return { success: true, message: 'Music deleted successfully' };
  }
}
