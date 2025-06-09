import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Req,
  Res,
  UnauthorizedException,
  Param,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { VCardService } from './vcard.service';
import { CreateVCardDto } from './dto/create-vcard.dto';
import { UpdateVCardDto } from './dto/update-vcard.dto';
import { generateVCardText } from '../utils/vcf-generator';
import { SessionService } from '../session/session.service';
import { toVCardResponse } from './vcard.mapper';
import { VCardResponse } from './dto/response-vcard.dto';

@Controller('vcards')
export class VCardController {
  constructor(
    private readonly vcardService: VCardService,
    private readonly sessionService: SessionService,
  ) {}

  @Post()
  async create(
    @Body() body: CreateVCardDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const session = await this.sessionService.getOrCreate(req.cookies.session_id);

    res.cookie('session_id', session.id, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    const { user, vcard } = await this.vcardService.createOrGet(body, session.id);
    return res.json(toVCardResponse(user, vcard));
  }

  @Get()
  async getCurrent(@Req() req: Request): Promise<VCardResponse> {
    const sessionId = req.cookies.session_id;
    if (!sessionId) throw new UnauthorizedException('Missing session');

    const { user, vcard } = await this.vcardService.getCurrentUserAndVCard(sessionId);
    return toVCardResponse(user, vcard);
  }

  @Put()
  async update(
    @Body() body: UpdateVCardDto,
    @Req() req: Request,
  ): Promise<VCardResponse> {
    const sessionId = req.cookies.session_id;
    if (!sessionId) throw new UnauthorizedException('Missing session');

    const { user, vcard } = await this.vcardService.updateCurrent(sessionId, body);
    return toVCardResponse(user, vcard);
  }

  @Delete()
  async delete(@Req() req: Request) {
    const sessionId = req.cookies.session_id;
    if (!sessionId) throw new UnauthorizedException('Missing session');

    await this.vcardService.deleteCurrent(sessionId);
    return { success: true };
  }

  @Get(':publicID/download')
  async download(@Param('publicID') publicID: string, @Res() res: Response) {
    const { vcard, user } = await this.vcardService.findByHash(publicID);
    const vcf = generateVCardText(vcard, user);

    const filename = `${user.firstName}_${user.lastName}.vcf`;
    const encoded  = encodeURIComponent(filename);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${filename}"; filename*=UTF-8''${encoded}`,
    );
    res.setHeader('Content-Type', 'text/vcard; charset=utf-8');

    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    return res.send(vcf);
  }
}
