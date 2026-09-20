import { apiClient } from './client';
import { Exam, ExamSubject } from '../types';

export const examApi = {
  async getExams(): Promise<Exam[]> {
    return await apiClient<Exam[]>('/exams');
  },

  async getExam(examId: string): Promise<Exam> {
    return await apiClient<Exam>(`/exams/${examId}`);
  },

  async getExamSubjects(examId: string): Promise<ExamSubject[]> {
    return await apiClient<ExamSubject[]>(`/exams/${examId}/subjects`);
  },
};
