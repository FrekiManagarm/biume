import {
  generateReactHelpers,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "@/lib/uploadthing/core";

export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
export const { uploadFiles, useUploadThing } =
  generateReactHelpers<OurFileRouter>();
