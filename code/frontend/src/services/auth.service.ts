import useSWRMutation, { SWRMutationResponse } from "swr/mutation";
import {useNavigate} from "react-router-dom";
import { postFetcher } from "./api.service";

export type LoginUser = {
  username: string;
  password: string;
}

// login
export const useLogin = (): SWRMutationResponse<any, any, string, LoginUser> => {
  const navigator = useNavigate();
  
  return useSWRMutation('/api/authorization/login', postFetcher, {
    onSuccess(data) {
      navigator('/');
    },
  })
}