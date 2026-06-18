import { NextResponse } from "next/server";

/** Machine-readable codes returned by contact / registration APIs. */
export type ContactField = "name" | "email" | "service" | "message" | "website";

export type RegistrationField =
  | "companyName"
  | "crNumber"
  | "establishment"
  | "governorate"
  | "mobile"
  | "website"
  | "instagram"
  | "sector"
  | "sectorOther"
  | "fileProfile"
  | "fileCr"
  | "fileRiyada";

export type ApiErrorBody = {
  ok: false;
  field?: ContactField | RegistrationField;
  code?: string;
  error?: string;
};

export function apiFieldError(
  field: ContactField | RegistrationField,
  code: string,
  status = 400
) {
  return NextResponse.json(
    { ok: false, field, code } satisfies ApiErrorBody,
    { status }
  );
}

export function apiGenericError(message: string, status = 500) {
  return NextResponse.json(
    { ok: false, error: message } satisfies ApiErrorBody,
    { status }
  );
}
