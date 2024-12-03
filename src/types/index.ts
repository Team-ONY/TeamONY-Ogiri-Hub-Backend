export interface ImageGenerationRequest {
  prompt: string;
}

export interface ImageGenerationResponse {
  imageUrl: string;
}

export interface ErrorResponse {
  error: string;
}
