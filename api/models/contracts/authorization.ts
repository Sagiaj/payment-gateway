export interface IAuthorizationRequest {
  parseFromRequest(correlation_id: string, params: any): IAuthorizationRequest;
}

export interface IAuthorizationResponse {
  parseFromResponse(correlation_id: string, data: any): IAuthorizationResponse;
}
