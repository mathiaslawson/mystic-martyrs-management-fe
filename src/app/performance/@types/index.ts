export interface ExamDetailTypes {
    id: string
    recorded_results: number
    pending_results: number
    total_members: number
    cell_name: string
    title: string
    date: string
    member_statuses: {
        member_id: string
        name: string
        email: string
        result_status: {
            status: string
            score: string
            recorded_at: string
            remarks: string
        }
    }[]
}

export interface AttendanceByDate {
  date: string;
  totalPresent: number;
  attendancePercentage: number;
}

export interface Attendance {
  averageAttendance: number;
  totalSessions: number;
  totalExpectedAttendance: number;
  totalPresent: number;
  attendanceByDate: AttendanceByDate[];
}

export interface ScoreBrackets {
  excellent: number;
  good: number;
  average: number;
  belowAverage: number;
}

export interface ExamDetail {
  examId: string;
  title: string;
  date: string;
  totalParticipants: number;
  participationRate: number;
  averageScore: number;
  scoreBrackets: ScoreBrackets;
}

export interface ExamPerformance {
  totalExams: number;
  averageParticipationRate: number;
  overallAverageScore: number;
  examDetails: ExamDetail[];
}

export interface PerformanceDistribution {
  totalAppraisals: number;
  distribution: {
    excellent: number;
    veryGood: number;
    good: number;
    satisfactory: number;
    needsImprovement: number;
  };
  averageScores: {
    overall: number;
    attendance: number;
    exams: number;
  };
}

export interface MembershipGrowth {
  joined: number;
  left: number;
  netGrowth: number;
}

export interface PerformanceGrowth {
  averageGrowth: number;
  membersImproved: number;
  membersDeclined: number;
  membersSteady: number;
}

export interface GrowthMetrics {
  membershipGrowth: MembershipGrowth;
  performanceGrowth: PerformanceGrowth;
}

export interface CellHistory {
  division_date: string;
  parent_cell_id: string;
}

export interface MetricsData {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  attendance: Attendance;
  examPerformance: ExamPerformance;
  performanceDistribution: PerformanceDistribution;
  growthMetrics: GrowthMetrics;
  cellHistory: CellHistory[];
}
