import {resolve} from "path";

const win32 = process.platform === "win32",
    omnisharp = win32 ? "run.cmd" : "run",
    bootstrap = win32 ? "omnisharp.bootstrap.cmd" : "omnisharp.bootstrap";

/* tslint:disable:no-string-literal */
export const omnisharpLocation = process.env["OMNISHARP"] || resolve(__dirname, "../roslyn/", omnisharp);
export const bootstrapLocation = process.env["OMNISHARP_BOOTSTRAP"] || resolve(__dirname, "../roslyn/", bootstrap);
/* tslint:enable:no-string-literal */
