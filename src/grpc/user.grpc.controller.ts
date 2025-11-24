import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { SupabaseService } from '../supabase/supabase.service';

interface Empty {}

interface User {
  id: number;
  name: string;
  age: number;
}

interface UserById {
  id: number;
}

interface CreateUserRequest {
  name: string;
  age: number;
}

interface UpdateUserRequest {
  id: number;
  name?: string;
  age?: number;
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

interface Playlist {
  id: number;
  name: string;
}

interface AddPlaylistToUserRequest {
  userId: number;
  playlistId: number;
}

interface AddPlaylistResponse {
  success: boolean;
  data: {
    userId: number;
    playlistId: number;
  };
}

interface RemovePlaylistFromUserRequest {
  userId: number;
  playlistId: number;
}

@Controller()
export class UserGrpcController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @GrpcMethod('UserService', 'FindAll')
  async findAll(data: Empty): Promise<{ users: User[] }> {
    const { data: users, error } = await this.supabaseService.user.select('*');
    if (error) throw new Error(error.message);
    return { users: users || [] };
  }

  @GrpcMethod('UserService', 'FindOne')
  async findOne(data: UserById): Promise<User> {
    const { data: user, error } = await this.supabaseService.user
      .select('*')
      .eq('id', data.id)
      .single();
    if (error) throw new Error(error.message);
    return user;
  }

  @GrpcMethod('UserService', 'FindPlaylists')
  async findPlaylists(data: UserById): Promise<{ playlists: Playlist[] }> {
    const { data: userPlaylistData, error: userPlaylistError } =
      await this.supabaseService.userPlaylist
        .select('playlistId')
        .eq('userId', data.id);

    if (userPlaylistError || !userPlaylistData?.length) {
      return { playlists: [] };
    }

    const playlistIds = userPlaylistData.map((up) => up.playlistId);
    const { data: playlists, error } = await this.supabaseService.playlist
      .select('*')
      .in('id', playlistIds);

    if (error) throw new Error(error.message);
    return { playlists: playlists || [] };
  }

  @GrpcMethod('UserService', 'Create')
  async create(data: CreateUserRequest): Promise<User> {
    const { data: user, error } = await this.supabaseService.user
      .insert(data)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return user;
  }

  @GrpcMethod('UserService', 'Update')
  async update(data: UpdateUserRequest): Promise<User> {
    const { id, ...updateData } = data;
    const { data: user, error } = await this.supabaseService.user
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return user;
  }

  @GrpcMethod('UserService', 'Delete')
  async remove(data: UserById): Promise<DeleteResponse> {
    const { error } = await this.supabaseService.user
      .delete()
      .eq('id', data.id);
    if (error) throw new Error(error.message);
    return { success: true, message: 'User deleted successfully' };
  }

  @GrpcMethod('UserService', 'AddPlaylist')
  async addPlaylist(
    data: AddPlaylistToUserRequest,
  ): Promise<AddPlaylistResponse> {
    const { data: result, error } = await this.supabaseService.userPlaylist
      .insert({
        userId: data.userId,
        playlistId: data.playlistId,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { success: true, data: result };
  }

  @GrpcMethod('UserService', 'RemovePlaylist')
  async removePlaylist(
    data: RemovePlaylistFromUserRequest,
  ): Promise<DeleteResponse> {
    const { error } = await this.supabaseService.userPlaylist
      .delete()
      .eq('userId', data.userId)
      .eq('playlistId', data.playlistId);
    if (error) throw new Error(error.message);
    return { success: true, message: 'Playlist removed from user' };
  }
}
