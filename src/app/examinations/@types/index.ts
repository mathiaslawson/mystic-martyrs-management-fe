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