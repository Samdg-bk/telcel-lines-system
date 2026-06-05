export class CreateResponsivaDto {
  assignmentId: string;

  generatedAt?: Date;

  signed?: boolean;

  pdfPath?: string;

  deliveredBy?: string;

  department?: string;

  observations?: string;

  signedAt?: Date | null;
}
