import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { SupabaseService } from '../supabase/supabase.service';

interface Empty {}

interface Playlist {
  id: number;
  name: string;
}

interface PlaylistById {
  id: number;
}

interface CreatePlaylistRequest {
  name: string;
}

interface UpdatePlaylistRequest {
  id: number;
  name?: string;
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

interface Music {
  id: number;
  name: string;
  artist: string;
}

interface User {
  id: number;
  name: string;
  age: number;
}

interface AddMusicToPlaylistRequest {
  playlistId: number;
  musicId: number;
}

interface AddMusicResponse {
  success: boolean;
  data: {
    playlistId: number;
    musicId: number;
  };
}

interface RemoveMusicFromPlaylistRequest {
  playlistId: number;
  musicId: number;
}

@Controller()
export class PlaylistGrpcController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @GrpcMethod('PlaylistService', 'FindAll')
  async findAll(data: Empty): Promise<{ playlists: Playlist[] }> {
    const { data: playlists, error } =
      await this.supabaseService.playlist.select('*');
    if (error) throw new Error(error.message);
    return { playlists: playlists || [] };
  }

  @GrpcMethod('PlaylistService', 'FindOne')
  async findOne(data: PlaylistById): Promise<Playlist> {
    const { data: playlist, error } = await this.supabaseService.playlist
      .select('*')
      .eq('id', data.id)
      .single();
    if (error) throw new Error(error.message);
    return playlist;
  }

  @GrpcMethod('PlaylistService', 'FindMusics')
  async findMusics(data: PlaylistById): Promise<{ musics: Music[] }> {
    const { data: playlistMusicData, error: playlistMusicError } =
      await this.supabaseService.playlistMusic
        .select('musicId')
        .eq('playlistId', data.id);

    if (playlistMusicError || !playlistMusicData?.length) {
      return { musics: [] };
    }

    const musicIds = playlistMusicData.map((pm) => pm.musicId);
    const { data: musics, error } = await this.supabaseService.music
      .select('*')
      .in('id', musicIds);

    if (error) throw new Error(error.message);
    return { musics: musics || [] };
  }

  @GrpcMethod('PlaylistService', 'FindUsers')
  async findUsers(data: PlaylistById): Promise<{ users: User[] }> {
    const { data: userPlaylistData, error: userPlaylistError } =
      await this.supabaseService.userPlaylist
        .select('userId')
        .eq('playlistId', data.id);

    if (userPlaylistError || !userPlaylistData?.length) {
      return { users: [] };
    }

    const userIds = userPlaylistData.map((up) => up.userId);
    const { data: users, error } = await this.supabaseService.user
      .select('*')
      .in('id', userIds);

    if (error) throw new Error(error.message);
    return { users: users || [] };
  }

  @GrpcMethod('PlaylistService', 'Create')
  async create(data: CreatePlaylistRequest): Promise<Playlist> {
    const { data: playlist, error } = await this.supabaseService.playlist
      .insert(data)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return playlist;
  }

  @GrpcMethod('PlaylistService', 'Update')
  async update(data: UpdatePlaylistRequest): Promise<Playlist> {
    const { id, ...updateData } = data;
    const { data: playlist, error } = await this.supabaseService.playlist
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return playlist;
  }

  @GrpcMethod('PlaylistService', 'Delete')
  async remove(data: PlaylistById): Promise<DeleteResponse> {
    const { error } = await this.supabaseService.playlist
      .delete()
      .eq('id', data.id);
    if (error) throw new Error(error.message);
    return { success: true, message: 'Playlist deleted successfully' };
  }

  @GrpcMethod('PlaylistService', 'AddMusic')
  async addMusic(data: AddMusicToPlaylistRequest): Promise<AddMusicResponse> {
    const { data: result, error } = await this.supabaseService.playlistMusic
      .insert({
        playlistId: data.playlistId,
        musicId: data.musicId,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { success: true, data: result };
  }

  @GrpcMethod('PlaylistService', 'RemoveMusic')
  async removeMusic(
    data: RemoveMusicFromPlaylistRequest,
  ): Promise<DeleteResponse> {
    const { error } = await this.supabaseService.playlistMusic
      .delete()
      .eq('playlistId', data.playlistId)
      .eq('musicId', data.musicId);
    if (error) throw new Error(error.message);
    return { success: true, message: 'Music removed from playlist' };
  }
}
