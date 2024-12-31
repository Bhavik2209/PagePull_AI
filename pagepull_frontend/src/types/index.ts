export interface ApiResponse {
    DOM_content?: string;
    get_data?: string;
    error?: string;
  }
  
  export interface ErrorState {
    message: string;
    type: 'url' | 'selector' | null;
  }