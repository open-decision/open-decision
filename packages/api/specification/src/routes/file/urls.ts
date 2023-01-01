export const fileRoot = "/file";

export const documentRoot = `${fileRoot}/document`;
export const documentPreviewSingle = (documentUuid: string) =>
  `${documentRoot}/preview/${documentUuid}`;

export const documentPublishedSingle = (documentUuid: string) =>
  `${documentRoot}/public/${documentUuid}`;

export const documentPrototypeSingle = (documentUuid: string) =>
  `${documentRoot}/prototype/${documentUuid}`;

export const templateRoot = `${fileRoot}/template`;

export const templateSingle = (templateUuid: string) =>
  `${templateRoot}/${templateUuid}`;

export const templateDownloadUrlSingle = (templateUuid: string) =>
  `${templateRoot}/file/${templateUuid}`;
