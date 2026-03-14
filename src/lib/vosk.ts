import { createModel, type Model } from 'vosk-browser';
import { isElectron } from '../app/utils';

const MODEL_ARCHIVE = 'models/vosk-model-small-en-us-0.15.tar.gz';

const unique = <T,>(items: T[]) => Array.from(new Set(items));

export const getVoskModelCandidates = () => {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    const rootedPath = `${normalizedBase}${MODEL_ARCHIVE}`.replace(/\/+/g, '/');

    const candidates = [
        rootedPath,
        `/${MODEL_ARCHIVE}`,
    ];

    if (typeof window !== 'undefined') {
        candidates.unshift(new URL(rootedPath, window.location.origin).toString());
        if (isElectron()) {
            candidates.push(`./${MODEL_ARCHIVE}`);
        }
    }

    return unique(candidates);
};

const canProbeViaFetch = (candidate: string) => {
    if (typeof window === 'undefined') return false;
    const protocol = window.location.protocol;
    if (protocol === 'file:' || candidate.startsWith('file:')) return false;
    return candidate.startsWith('http://') || candidate.startsWith('https://') || candidate.startsWith('/');
};

const probeCandidate = async (candidate: string) => {
    if (!canProbeViaFetch(candidate)) return true;

    try {
        const response = await fetch(candidate, { method: 'HEAD' });
        if (response.ok) return true;
    } catch {
        // fall back to direct load attempt
    }

    return true;
};

export const loadVoskModel = async (): Promise<{ model: Model; path: string }> => {
    const candidates = getVoskModelCandidates();
    const errors: string[] = [];

    for (const candidate of candidates) {
        const canUseCandidate = await probeCandidate(candidate);
        if (!canUseCandidate) continue;

        try {
            const model = await createModel(candidate);
            return { model, path: candidate };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'unknown error';
            errors.push(`${candidate}: ${message}`);
        }
    }

    throw new Error(
        errors.length > 0
            ? `음성 인식 모델을 불러오지 못했습니다. ${errors[0]}`
            : '음성 인식 모델 파일을 찾지 못했습니다. public/models 경로를 확인해 주세요.'
    );
};

export const getVoskModelArchiveName = () => MODEL_ARCHIVE;
