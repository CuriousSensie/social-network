import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { FollowsService } from '../follows/follows.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class FeedGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private followsService: FollowsService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth.token ||
        client.handshake.headers['authorization']?.split(' ')[1];

      if (!token) throw new Error('No token provided');

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      // Join a personalized room using the user's ID
      const userId = payload.userId;
      client.join(`user_${userId}`);
      console.log(`User ${userId} connected to sockets.`);
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {}

  @OnEvent('post.created')
  async handleNewPost(post: any) {
    const authorId = post.authorId._id || post.authorId;

    const followerIds = await this.followsService.getFollowerIds(
      authorId.toString(),
    );

    followerIds.forEach((followerId) => {
      this.server.to(`user_${followerId}`).emit('new_feed_post', post);
    });
  }
}
