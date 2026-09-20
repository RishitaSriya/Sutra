import { apiClient } from './client';

export interface SandboxRunPayload {
  code: string;
  language?: 'python' | 'javascript';
  stdin?: string;
}

export interface SandboxRunResponse {
  stdout: string;
  stderr: string;
  success: boolean;
  exit_code: number;
  execution_time_ms: number;
  language: string;
}

export interface TestCaseResult {
  test_name: string;
  input_data: string;
  expected_output: string;
  actual_output: string;
  passed: boolean;
  execution_time_ms: number;
  error_message?: string | null;
}

export interface ChallengeEvaluatePayload {
  code: string;
  language?: 'python' | 'javascript';
}

export interface ChallengeEvaluateResponse {
  passed: boolean;
  score: number;
  total_tests: number;
  passed_tests: number;
  test_results: TestCaseResult[];
  stdout: string;
  stderr: string;
  execution_time_ms: number;
  xp_awarded: number;
  badge_unlocked?: string | null;
  ai_feedback?: string | null;
  total_xp: number;
}

export interface ChallengeStarterTemplate {
  challenge_id: string;
  title: string;
  python: string;
  javascript: string;
  test_cases_count: number;
}

export const sandboxApi = {
  async getLanguages(): Promise<{ id: string; name: string; version: string; available: boolean; icon: string }[]> {
    return apiClient('/sandbox/languages');
  },

  async runCode(payload: SandboxRunPayload): Promise<SandboxRunResponse> {
    return apiClient<SandboxRunResponse>('/sandbox/run', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getChallengeTemplate(challengeId: string): Promise<ChallengeStarterTemplate> {
    return apiClient<ChallengeStarterTemplate>(`/sandbox/challenges/${challengeId}/template`);
  },

  async evaluateChallenge(
    challengeId: string,
    payload: ChallengeEvaluatePayload
  ): Promise<ChallengeEvaluateResponse> {
    return apiClient<ChallengeEvaluateResponse>(`/challenges/${challengeId}/evaluate`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
