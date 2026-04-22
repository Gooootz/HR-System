import axios from "axios";

const API_URL = "https://odeldevdtrapi.azurewebsites.net/api/schoolcalendar";

export interface Holiday {
  date: string;
  type: string;
  title: string;
  color: string;
  whole_day: boolean;
  is_morning: boolean;
  
}

export const fetchHolidays = async (): Promise<Holiday[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return [];
  }
};

export const addOrUpdateHoliday = async (holiday: Holiday): Promise<Holiday> => {
  try {
    const response = await axios.post(API_URL, holiday);
    return response.data;
  } catch (error) {
    console.error("Error adding/updating holiday:", error);
    throw error;
  }
};

export const deleteHoliday = async (title: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${title}`);
  } catch (error) {
    console.error("Error deleting holiday:", error);
    throw error;
  }
};