export interface Sensor {
  sensor_id: string;
  latitude: number;
  longitude: number;
}

export const fetchSensors = async (): Promise<Sensor[]> => {
  try {
    const response = await fetch("http://localhost:8000/api/capteurs"); 
    if (!response.ok) {
      throw new Error("Erreur reseau lors de la recuperation");
    }

    //Conversion JSON
    const result = await response.json();
    //returne les donnees extraites de l'API
    return result.data;
  } catch (error) {
    console.error("Erreur de l'API :", error);
    return [];
  }
};