import { User } from '../user/user.entity';
import { VCard } from './vcard.entity';
import { VCardResponse } from './dto/response-vcard.dto';

export function toVCardResponse(user: User, vcard: VCard): VCardResponse {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    website: user.website,
    notes: user.notes,
    photo: user.photo,
    publicId: vcard.hash,
  };
}
