import ApiRequest from './apiPrototype'

export interface HomeworkItem {
  id: string
  type: string
  deadline: string
  isDone: boolean
  language: string
  isPassed: boolean
}

export interface HomeworkListResponse {
  homeworkList: HomeworkItem[]
}

export interface FileListItem {
  date: string
  puzzleID: string
  fileName: string
  status: string
}

export interface FileListResponse {
  'file-list': FileListItem[]
}

export interface PuzzleInfoRequest {
  puzzleID: string
  testCase?: Array<{
    input: string
    output: string
  }>
}

export interface PuzzleInfoResponse {
  description: string
}

export interface StudentListResponse {
  studentID: string[]
}

export interface CheckTestResultRequest {
  puzzleID: string
}

export interface TestResultLogItem {
  id: string
  result: string
  output: string
}

export interface CheckTestResultResponse {
  'pass-rate': number
  'log': TestResultLogItem[]
}

export interface DeleteHomeworkRequest {
  puzzleID: string
  fileID: string
}

export default class HomeworkApi extends ApiRequest {
    constructor (baseURL = '/') {
        super(baseURL)
    }
    public async getHomeworkList (): Promise<HomeworkListResponse> {
        return this.apiClient
            .get<HomeworkListResponse>('/homework/list')
            .then(response => response.data)
    }

    public async getFileList (): Promise<FileListResponse> {
        return this.apiClient
            .get<FileListResponse>('/homework/file-list')
            .then(response => response.data)
    }
    
    public async getPuzzleInfo (data: PuzzleInfoRequest): Promise<PuzzleInfoResponse> {
        return this.apiClient
            .post<PuzzleInfoResponse>('/homework/puzzle-info', data)
            .then(response => response.data)
    }
    
    public async getStudentList (): Promise<StudentListResponse> {
        return this.apiClient
            .get<StudentListResponse>('/homework/student-list')
            .then(response => response.data)
    }
    
    public async checkTestResult (data: CheckTestResultRequest): Promise<CheckTestResultResponse> {
        return this.apiClient
            .post<CheckTestResultResponse>('/homework/check-test-result', data)
            .then(response => response.data)
    }
    
    public async deleteHomework (data: DeleteHomeworkRequest): Promise<void> {
        return this.apiClient
            .post<void>('/homework/delete-homework', data)
            .then(response => response.data)
    }
}