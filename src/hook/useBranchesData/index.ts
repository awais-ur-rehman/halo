// src/hook/useBranchesData/index.ts
import { useState, useEffect } from 'react';

export interface BranchScorecard {
  place_id: string;
  branch_name: string;
  last_updated: string;
  overall_score: number;
  rating: number;
  score_grade: 'A' | 'B' | 'C' | 'D';
  reviews: {
    total: number;
    this_month: number;
    average_rating: number;
    customer_reviews: CustomerReview[];
  };
  sentiment_analysis: {
    total_positive: number;
    total_negative: number;
    total_neutral: number;
    positive_percentage: number;
    negative_percentage: number;
    neutral_percentage: number;
  };
  highlighted_employees: Employee[];
  all_employees: Employee[];
  issues: {
    total_count: number;
    critical_count: number;
    high_count: number;
    medium_count: number;
    low_count: number;
    details: Issue[];
  };
  performance_metrics: {
    customer_satisfaction: number;
    service_quality: number;
    wait_time_avg: number;
    resolution_rate: number;
    staff_efficiency: number;
  };
  monthly_trends: MonthlyTrend[];
  recommendations: Recommendation[];
}

export interface CustomerReview {
  review_id: string;
  reviewer: {
    name: string;
    gender: 'Male' | 'Female';
    age_group: string;
    customer_type: string;
    account_tenure: string;
  };
  rating: number;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  review_text: string;
  mentioned_employee: string;
  mentioned_employee_position: string;
  date: string;
  verified: boolean;
  helpful_votes: number;
}

export interface Employee {
  name: string;
  position: string;
  is_highlighted: boolean;
  highlight_type?: 'positive' | 'negative';
  mention_count: number;
}

export interface Issue {
  category: string;
  type: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  count: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  last_incident: string;
}

export interface MonthlyTrend {
  month: string;
  score: number;
  reviews: number;
  issues: number;
}

export interface Recommendation {
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  category: string;
  recommendation: string;
}

interface BranchesData {
  generated_at: string;
  total_branches: number;
  data_version: string;
  branches: BranchScorecard[];
}

export const useBranchesData = () => {
  const [branches, setBranches] = useState<BranchScorecard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBranchesData = async (): Promise<BranchScorecard[]> => {
    try {
      const branchesModule = await import('../../data/branchScore.json');
      const parsedData: BranchesData = branchesModule.default;
      return parsedData.branches;
    } catch (error) {
      console.error('Error loading branches scorecard data:', error);
      throw new Error('Failed to load branches scorecard data');
    }
  };

  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError(null);
      const branchesData = await loadBranchesData();
      setBranches(branchesData);
    } catch (err) {
      setError('Failed to fetch branches data');
      console.error('Error fetching branches:', err);
    } finally {
      setLoading(false);
    }
  };

  const getBranchById = (placeId: string): BranchScorecard | null => {
    return branches.find(branch => branch.place_id === placeId) || null;
  };

  const getBranchesByGrade = (grade: 'A' | 'B' | 'C' | 'D'): BranchScorecard[] => {
    return branches.filter(branch => branch.score_grade === grade);
  };

  const getBranchesByScore = (minScore: number, maxScore: number): BranchScorecard[] => {
    return branches.filter(branch => 
      branch.overall_score >= minScore && branch.overall_score <= maxScore
    );
  };

  const getTopPerformingBranches = (limit: number = 10): BranchScorecard[] => {
    return [...branches]
      .sort((a, b) => b.overall_score - a.overall_score)
      .slice(0, limit);
  };

  const getWorstPerformingBranches = (limit: number = 10): BranchScorecard[] => {
    return [...branches]
      .sort((a, b) => a.overall_score - b.overall_score)
      .slice(0, limit);
  };

  const searchBranches = (query: string): BranchScorecard[] => {
    if (!query.trim()) return branches;
    
    const lowercaseQuery = query.toLowerCase();
    return branches.filter(branch =>
      branch.branch_name.toLowerCase().includes(lowercaseQuery) ||
      branch.place_id.toLowerCase().includes(lowercaseQuery)
    );
  };

  const getBranchStats = () => {
    if (branches.length === 0) return null;

    const totalBranches = branches.length;
    const averageScore = branches.reduce((sum, branch) => sum + branch.overall_score, 0) / totalBranches;
    const gradeDistribution = {
      A: branches.filter(b => b.score_grade === 'A').length,
      B: branches.filter(b => b.score_grade === 'B').length,
      C: branches.filter(b => b.score_grade === 'C').length,
      D: branches.filter(b => b.score_grade === 'D').length,
    };

    const totalIssues = branches.reduce((sum, branch) => sum + branch.issues.total_count, 0);
    const criticalIssues = branches.reduce((sum, branch) => sum + branch.issues.critical_count, 0);
    const totalReviews = branches.reduce((sum, branch) => sum + branch.reviews.total, 0);

    return {
      totalBranches,
      averageScore: Math.round(averageScore * 10) / 10,
      gradeDistribution,
      totalIssues,
      criticalIssues,
      totalReviews,
      highestScore: Math.max(...branches.map(b => b.overall_score)),
      lowestScore: Math.min(...branches.map(b => b.overall_score)),
    };
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  return {
    branches,
    loading,
    error,
    getBranchById,
    getBranchesByGrade,
    getBranchesByScore,
    getTopPerformingBranches,
    getWorstPerformingBranches,
    searchBranches,
    getBranchStats,
    refreshBranches: fetchBranches,
  };
};