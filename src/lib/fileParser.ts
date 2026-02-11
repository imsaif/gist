import {
  GistDesignFile,
  FileUpdate,
  BeforeAfterUpdate,
  BeforeAfterItem,
  Feature,
  FeatureProgress,
  SectionStatus,
} from '@/types/file';
import { IdentifiedPatternInMessage } from '@/types';

interface ParseResult {
  displayContent: string;
  fileUpdate: FileUpdate | null;
  beforeAfterUpdate: BeforeAfterUpdate | null;
  identifiedPattern: IdentifiedPatternInMessage | null;
}

export function parseFileResponse(content: string): ParseResult {
  let displayContent = content;
  let fileUpdate: FileUpdate | null = null;
  let beforeAfterUpdate: BeforeAfterUpdate | null = null;
  let identifiedPattern: IdentifiedPatternInMessage | null = null;

  // Extract <file_update> JSON from response
  const fileUpdateRegex = /<file_update>([\s\S]*?)<\/file_update>/;
  const fileUpdateMatch = displayContent.match(fileUpdateRegex);

  if (fileUpdateMatch) {
    displayContent = displayContent.replace(fileUpdateRegex, '').trim();
    try {
      fileUpdate = JSON.parse(fileUpdateMatch[1].trim()) as FileUpdate;
    } catch (e) {
      console.error('Failed to parse file update:', e);
    }
  }

  // Extract <before_after_update> JSON from response
  const beforeAfterRegex = /<before_after_update>([\s\S]*?)<\/before_after_update>/;
  const beforeAfterMatch = displayContent.match(beforeAfterRegex);

  if (beforeAfterMatch) {
    displayContent = displayContent.replace(beforeAfterRegex, '').trim();
    try {
      beforeAfterUpdate = JSON.parse(beforeAfterMatch[1].trim()) as BeforeAfterUpdate;
    } catch (e) {
      console.error('Failed to parse before/after update:', e);
    }
  }

  // Extract <pattern_identified> JSON from response
  const patternRegex = /<pattern_identified>([\s\S]*?)<\/pattern_identified>/;
  const patternMatch = displayContent.match(patternRegex);

  if (patternMatch) {
    displayContent = displayContent.replace(patternRegex, '').trim();
    try {
      const parsed = JSON.parse(patternMatch[1].trim());
      identifiedPattern = {
        patternId: parsed.patternId,
        reason: parsed.reason,
      };
    } catch (e) {
      console.error('Failed to parse pattern identified:', e);
    }
  }

  return {
    displayContent,
    fileUpdate,
    beforeAfterUpdate,
    identifiedPattern,
  };
}

export function createFeatureFromUpdate(update: FileUpdate): Feature {
  return {
    id: update.featureId || `feature-${Date.now()}`,
    name: update.featureName || 'Untitled Feature',
    intent: {
      goal: update.intent?.goal || null,
      coreAnxiety: update.intent?.coreAnxiety || null,
      notTryingTo: update.intent?.notTryingTo || [],
    },
    interactionModel: {
      primaryFlow: update.interactionModel?.primaryFlow || [],
      keyInteractions: update.interactionModel?.keyInteractions || [],
      errorHandling: update.interactionModel?.errorHandling || [],
    },
    designDecisions: update.addDesignDecisions || [],
    patternsUsed: update.addPatterns || [],
    constraints: update.addConstraints || [],
    notThis: update.notThis || [],
    openQuestions: update.openQuestions || [],
  };
}

export function mergeFileUpdate(currentFile: GistDesignFile, update: FileUpdate): GistDesignFile {
  const newFile = { ...currentFile };

  // Merge product overview (overwrite non-null fields)
  if (update.product) {
    newFile.product = {
      name: update.product.name ?? currentFile.product.name,
      description: update.product.description ?? currentFile.product.description,
      audience: update.product.audience ?? currentFile.product.audience,
      aiApproach: update.product.aiApproach ?? currentFile.product.aiApproach,
    };
  }

  // Merge positioning (scalars overwrite, comparisons append)
  if (update.positioning) {
    newFile.positioning = {
      category: update.positioning.category ?? currentFile.positioning.category,
      forWho: update.positioning.forWho ?? currentFile.positioning.forWho,
      notForWho: update.positioning.notForWho ?? currentFile.positioning.notForWho,
      comparisons: update.positioning.addComparisons
        ? [...currentFile.positioning.comparisons, ...update.positioning.addComparisons]
        : currentFile.positioning.comparisons,
    };
  }

  // Merge context (scalars overwrite, arrays append)
  if (update.context) {
    newFile.context = {
      pricing: update.context.pricing ?? currentFile.context.pricing,
      integratesWith: update.context.integratesWith
        ? [...currentFile.context.integratesWith, ...update.context.integratesWith]
        : currentFile.context.integratesWith,
      requires: update.context.requires
        ? [...currentFile.context.requires, ...update.context.requires]
        : currentFile.context.requires,
      stage: update.context.stage ?? currentFile.context.stage,
    };
  }

  // Merge feature updates
  if (update.featureId) {
    const existingIndex = currentFile.features.findIndex((f) => f.id === update.featureId);

    if (existingIndex >= 0) {
      // Update existing feature
      const existing = currentFile.features[existingIndex];
      const updatedFeature: Feature = {
        ...existing,
        name: update.featureName ?? existing.name,
        intent: {
          goal: update.intent?.goal ?? existing.intent.goal,
          coreAnxiety: update.intent?.coreAnxiety ?? existing.intent.coreAnxiety,
          notTryingTo: update.intent?.notTryingTo
            ? [...existing.intent.notTryingTo, ...update.intent.notTryingTo]
            : existing.intent.notTryingTo,
        },
        interactionModel: {
          primaryFlow: update.interactionModel?.primaryFlow
            ? [...existing.interactionModel.primaryFlow, ...update.interactionModel.primaryFlow]
            : existing.interactionModel.primaryFlow,
          keyInteractions: update.interactionModel?.keyInteractions
            ? [
                ...existing.interactionModel.keyInteractions,
                ...update.interactionModel.keyInteractions,
              ]
            : existing.interactionModel.keyInteractions,
          errorHandling: update.interactionModel?.errorHandling
            ? [...existing.interactionModel.errorHandling, ...update.interactionModel.errorHandling]
            : existing.interactionModel.errorHandling,
        },
        designDecisions: update.addDesignDecisions
          ? [...existing.designDecisions, ...update.addDesignDecisions]
          : existing.designDecisions,
        patternsUsed: update.addPatterns
          ? [...existing.patternsUsed, ...update.addPatterns]
          : existing.patternsUsed,
        constraints: update.addConstraints
          ? [...existing.constraints, ...update.addConstraints]
          : existing.constraints,
        notThis: update.notThis ? [...existing.notThis, ...update.notThis] : existing.notThis,
        openQuestions: update.openQuestions
          ? [...existing.openQuestions, ...update.openQuestions]
          : existing.openQuestions,
      };

      newFile.features = [
        ...currentFile.features.slice(0, existingIndex),
        updatedFeature,
        ...currentFile.features.slice(existingIndex + 1),
      ];
    } else {
      // Create new feature
      newFile.features = [...currentFile.features, createFeatureFromUpdate(update)];
    }
  }

  return newFile;
}

export function calculateFeatureProgress(feature: Feature): FeatureProgress {
  const getSectionStatus = (items: unknown[], hasScalar?: boolean): SectionStatus => {
    if (hasScalar || (Array.isArray(items) && items.length >= 3)) return 'complete';
    if ((Array.isArray(items) && items.length > 0) || hasScalar) return 'partial';
    return 'empty';
  };

  const intentStatus: SectionStatus =
    feature.intent.goal && feature.intent.notTryingTo.length > 0
      ? 'complete'
      : feature.intent.goal || feature.intent.notTryingTo.length > 0
        ? 'partial'
        : 'empty';

  const interactionStatus: SectionStatus =
    feature.interactionModel.primaryFlow.length > 0 &&
    feature.interactionModel.keyInteractions.length > 0 &&
    feature.interactionModel.errorHandling.length > 0
      ? 'complete'
      : feature.interactionModel.primaryFlow.length > 0 ||
          feature.interactionModel.keyInteractions.length > 0 ||
          feature.interactionModel.errorHandling.length > 0
        ? 'partial'
        : 'empty';

  return {
    featureId: feature.id,
    sections: {
      intent: intentStatus,
      interactionModel: interactionStatus,
      designDecisions: getSectionStatus(feature.designDecisions),
      patterns: getSectionStatus(feature.patternsUsed),
      constraints: getSectionStatus(feature.constraints),
      notThis: getSectionStatus(feature.notThis),
      openQuestions: getSectionStatus(feature.openQuestions),
    },
  };
}
