import type { FileEntity } from "@fireback/ui-core/sdk/legacy-types/FileEntity";
import { replacePossibleMetaPaths } from "../components/helpers/MetaPathAwareContent";
import { BUILD_VARIABLES } from "./build-variables";

export enum Compiler {
  Nextjs = "nextjs",
  CRA = "cra",
  ReactNative = "reactnative",
  Unknown = "unknown",
}

export function useRemoteInformation() {
  const directPath = (d?: FileEntity) => {
    if (!d?.diskPath && d?.uniqueId) {
      return replacePossibleMetaPaths(d.uniqueId);
    }

    return `${BUILD_VARIABLES.REMOTE_SERVICE}files-inline/${d?.diskPath}`;
  };

  const downloadPath = (d?: FileEntity) => {
    if (!d?.diskPath && d?.uniqueId) {
      return replacePossibleMetaPaths(d.uniqueId);
    }

    return `${BUILD_VARIABLES.REMOTE_SERVICE}files/${d?.diskPath}`;
  };

  return { directPath, downloadPath };
}
