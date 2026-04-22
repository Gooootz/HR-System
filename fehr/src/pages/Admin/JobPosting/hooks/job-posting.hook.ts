import { apiURL } from "@/utils/helper";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import getToken from "@/auth.ext/GetToken";
import { useToast } from "@/components/ui/use-toast";
import { JobPosting } from "../types/job-posting.type";

// get all hook
export function GetAllJobPostingHook() {
  const response = useQuery({
    queryKey: ["job-posting"],
    queryFn: async () =>
      await axios.get(`${apiURL}/api/job-posting`).then((res) => res.data),
  });

  return response;
}

// get all closed job postings hook
export function GetAllClosedJobPostingHook() {
  const response = useQuery({
    queryKey: ["job-posting"],
    queryFn: async () => {
      const res = await axios.get(`${apiURL}/api/job-posting`);
      return res.data.filter((job: JobPosting) => job.status === "Closed");
    },
  });

  return response;
}

// get all open job postings hook
export function GetAllOpenJobPostingHook() {
  const response = useQuery({
    queryKey: ["job-posting"],
    queryFn: async () => {
      const res = await axios.get(`${apiURL}/api/job-posting`);
      return res.data.filter((job: JobPosting) => job.status === "Open");
    },
  });

  return response;
}

// get by id hook
export function GetJobPostingByIdHook(id: string) {
  const response = useQuery({
    queryKey: ["job-posting", id],
    queryFn: async () =>
      await axios
        .get(`${apiURL}/api/job-posting/${id}`)
        .then((res) => res.data),
  });

  return response;
}

// create job posting hook
export function PostJobPostingHook() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<JobPosting, Error, Partial<JobPosting>>({
    mutationFn: async (data) => {
      const response = await axios.post(`${apiURL}/api/job-posting`, data, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Job Posting Created",
        description: "Your job posting has been created successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["job-posting"] });
      window.location.href = "/admin/job-posting";
    },
    onError: (error) => {
      toast({
        title: "Error Creating Job Posting",
        description: `Please try again. Error: ${error.message}`,
        variant: "destructive",
      });
    },
    retry: 3,
  });
}

// update job posting hook
export function PutJobPostingHook(id : string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<JobPosting, Error, Partial<JobPosting>>({
    mutationFn: async (data) => {
      const response = await axios.put(`${apiURL}/api/job-posting/${id}`, data, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Job Posting Updated",
        description: "Your job posting has been updated successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["job-posting"] });
      window.location.href = "/admin/job-posting";
    },
    onError: (error) => {
      toast({
        title: "Error Updating Job Posting",
        description: `Please try again. Error: ${error.message}`,
        variant: "destructive",
      });
    },
    retry: 3,
  });
}

// update status of job posting to "Closed" hook
export function PatchCloseJobPostingHook(id : string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<JobPosting, Error, void>({
    mutationFn: async () => {
      const response = await axios.patch(`${apiURL}/api/job-posting/${id}/status`, 
        { status: "Closed" },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Job Posting Status Updated",
        description: "The status of the job posting has been updated to 'Closed'.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["job-posting"] });
    },
    onError: (error) => {
      toast({
        title: "Error Updating Job Posting Status",
        description: `Please try again. Error: ${error.message}`,
        variant: "destructive",
      });
    },
    retry: 3,
  });
}
