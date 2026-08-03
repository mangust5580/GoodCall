export interface BuildArtifactValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateBuildArtifact(distPath: string): BuildArtifactValidationResult;
